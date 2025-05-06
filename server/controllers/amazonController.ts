import axios from "axios";
import {
  AmazonSearchResults,
  CommonSearchResults,
  SellerInfo,
} from "../types/product";

const KEEPA_API_KEY = process.env.KEEPA_API_KEY;
const AMAZON = "Amazon";

/*
The csvArray is a field in the Product result returned by the KEEPA API. The field contains a two-dimensional array.
The first dimension contains fields referencing prices from different sources. The second dimension is a history of the 
prices in the format of csvArray[i] = fieldName and csvArray[i + 1] = value.
*/
const getPriceFromCsv = (csvArray: Array<number>): number => {
  if (!csvArray || csvArray.length < 2) {
    return null;
  }

  for (let i = csvArray.length - 1; i >= 0; i -= 2) {
    // iterate by two steps because we only care about the value and not the field name
    const price = csvArray[i];
    if (price !== -1) {
      // -1 means the item was out of stock or unavailable at that time. Return the first price in history that's available
      return price / 100;
    }
  }
  return null;
};

const getPriceHistory = (csv: Array<Array<number>>): Array<number> => {
  if (!csv) {
    return [];
  }

  // get the price type that has the most amount of data
  const amazonPriceHistoryLength = csv[0] ? csv[0].length : 0;
  const newPriceHistoryLength = csv[1] ? csv[1].length : 0;
  const buyBoxPriceHistoryLength = csv[18] ? csv[18].length : 0;

  let isBuyBox = false;
  let longestHistory = [];
  if (
    amazonPriceHistoryLength > newPriceHistoryLength &&
    amazonPriceHistoryLength > buyBoxPriceHistoryLength
  ) {
    longestHistory = csv[0];
  } else if (
    newPriceHistoryLength > amazonPriceHistoryLength &&
    newPriceHistoryLength > buyBoxPriceHistoryLength
  ) {
    longestHistory = csv[1];
  } else if (
    buyBoxPriceHistoryLength > amazonPriceHistoryLength &&
    buyBoxPriceHistoryLength > newPriceHistoryLength
  ) {
    isBuyBox = true;
    longestHistory = csv[18];
  }

  const priceHistory = [];
  const stepSize = isBuyBox ? 3 : 2; // if buyBox, then it will include a third number which is the shipping cost

  // Process each pair of keepaMinutes and price
  for (let i = 0; i < longestHistory.length - 1; i += stepSize) {
    const keepaMinutes = longestHistory[i];
    const price = isBuyBox
      ? longestHistory[i + 1]
      : longestHistory[i + 1] + longestHistory[i + 2];

    if (price >= 0) {
      const timestamp = (keepaMinutes + 21564000) * 60000;
      const date = new Date(timestamp);

      priceHistory.push({
        price: price / 100,
        date: date,
        source: "amazon",
      });
    }
  }

  return priceHistory;
};

export const amazonSearch = async (
  query,
  page = 0
): Promise<Array<CommonSearchResults>> => {
  try {
    const url = `https://api.keepa.com/search?key=${KEEPA_API_KEY}&domain=1&type=product&term=${encodeURIComponent(
      query
    )}&page=${page}`;

    const response = await axios.get(url);
    const { data } = response;

    if (!data || !data.products) {
      return null;
    }

    const results = data.products.map(
      (product: AmazonSearchResults): CommonSearchResults => {
        const amazonPrice = getPriceFromCsv(product.csv?.[0]);
        const marketplaceNewPrice = getPriceFromCsv(product.csv?.[1]);
        const buyBoxPrice = getPriceFromCsv(product.csv?.[18]);

        const currentPrice = buyBoxPrice || amazonPrice || marketplaceNewPrice;

        // Unneeded at the moment
        // const ebayLinks =
        //   product.ebayListingIds?.map(
        //     (id) => `https://www.ebay.com/itm/${id}`
        //   ) || [];

        return {
          product: {
            _id: product.asin,
            name: product.title,
            brand: product.brand || "Unknown Brand",
            platform: AMAZON,
            imageURL: product.imagesCSV
              ? `https://images-na.ssl-images-amazon.com/images/I/${
                  product.imagesCSV.split(",")[0]
                }`
              : null,
            price: currentPrice,
          },
          searchTerms: [query.toLowerCase()],
        };
      }
    );

    return results;
  } catch (error) {
    console.error("Amazon Search Error:", error);
    return [];
  }
};

const getSeller = async (sellerId: string): Promise<SellerInfo> => {
  try {
    const url = `https://api.keepa.com/seller?key=${KEEPA_API_KEY}&domain=1&seller=${sellerId}`;

    const response = await axios.get(url);
    const { data } = response;

    if (!data || !data.sellers) {
      return {} as SellerInfo;
    }

    const seller = data.sellers[sellerId];

    return {
      posFeedbackPercent: seller.currentRating,
      totalRatingCount: seller.currentRatingCount,
      thirtyDayRatingCount: seller.ratingsLast30Days,
      sellerName: seller.sellerName,
    };
  } catch (error) {
    console.error(`Error searching for seller ID: ${sellerId}`, error);
    return {} as SellerInfo;
  }
};

const extractSellerInfo = (json: AmazonSearchResults) => {
  if (json.buyBoxUsedHistory) {
    return {
      condition: parseInt(json.buyBoxUsedHistory[2]) > 2 ? "Used" : "New",
      isFBA: json.buyBoxUsedHistory[3], // 1 if fulfilled by Amazon, 0 otherwise
      sellerId: json.buyBoxUsedHistory[1],
    };
  }

  if (json.liveOffersOrder && json.offers) {
    const mostRecentOfferIdx = json.liveOffersOrder[0];
    const offer = json.offers[mostRecentOfferIdx];

    return {
      condition: parseInt(offer.condition) > 2 ? "Used" : "New",
      isFBA: offer.isFBA,
      sellerId: offer.sellerId,
    };
  }

  if (json.buyBoxSellerIdHistory) {
    return {
      condition: "New",
      sellerId: json.buyBoxSellerIdHistory,
    };
  }
};
export const amazonSearchById = async (
  asin: string
): Promise<CommonSearchResults> => {
  try {
    const num_offers = "20"; // 20 is the minimum allowed by the API
    const only_live_offers = "1"; // Ensures we get the same price visible on the Amazon page
    const url = `https://api.keepa.com/product?key=${KEEPA_API_KEY}&domain=1&asin=${asin}&history=1&offers=${num_offers}&only-live-offers=${only_live_offers}`;

    const response = await axios.get(url);
    const { data } = response;
    if (!data || !data.products) {
      return null;
    }

    // Get price history and relevant info to request seller from KEEPA
    const productResult = data.products.map((product: AmazonSearchResults) => {
      const priceHistory = getPriceHistory(product.csv);

      return {
        _id: product.asin,
        name: product.title,
        brand: product.brand || "Unknown Brand",
        platform: "Amazon",
        ...extractSellerInfo(product),
        price:
          getPriceFromCsv(product.csv?.[18]) ||
          getPriceFromCsv(product.csv?.[0]) ||
          getPriceFromCsv(product.csv?.[1]),
        priceHistory: priceHistory,
        productUrl: `https://www.amazon.com/dp/${product.asin}`,
        imageURL: product.imagesCSV
          ? `https://images-na.ssl-images-amazon.com/images/I/${
              product.imagesCSV.split(",")[0]
            }`
          : null,
      };
    });

    // Make another network call to get seller info
    const product = productResult[0];
    const seller: SellerInfo =
      product.isFBA === "1"
        ? ({
            sellerName: "Amazon",
          } as SellerInfo)
        : {
            ...(await getSeller(product.sellerId)),
          }; // if fulfilled by amazon, skip the network call bc Amazon info stays the same

    return {
      product: product,
      seller: seller,
    };
  } catch (error) {
    console.error("Amazon Search By ID Error:", error);
    return null;
  }
};
