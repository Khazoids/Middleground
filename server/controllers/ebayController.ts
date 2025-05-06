import eBayApi from "ebay-api";
import { CommonSearchResults, eBaySearchResults } from "../types/product";
import { eBaySearchParameters } from "../types/searchParams";


const EBAY = "eBay";
const eBay = new eBayApi({
  appId: process.env.EBAY_APP_ID,
  certId: process.env.EBAY_CERT_ID,
  sandbox: false,
});

export const ebaySearch = async (
  params: eBaySearchParameters,
  page = 0
): Promise<Array<CommonSearchResults>> => {
  try {
    const data = await eBay.buy.browse.search({
      ...params,
      sort: "BEST_MATCH",
      limit: params.limit !== undefined ? params.limit : "10",
      offset: String(page * 10)
    });

    if (!data.itemSummaries) {
      return [];
    }

    const results = data.itemSummaries.map(
      (item: eBaySearchResults): CommonSearchResults => {
        return {
          product: {
            _id: item.itemId,
            name: item.title,
            brand: item.seller.username,
            condition: item.condition,
            platform: EBAY,
            imageURL: item.image.imageUrl,
            price: parseFloat(item.price.value) || 0,
          },
          searchTerms: [params.q.toLowerCase()],
        };
      }
    );

    return results;
  } catch (error) {
    console.log("Error retrieving results from eBay search: \n" + error);
    return [];
  }
};

export const eBaySearchById = async (
  id: string
): Promise<CommonSearchResults> => {
  try {
    const item: eBaySearchResults = await eBay.buy.browse.getItem(id);

    if (!item) {
      return null;
    }

    // Create initial price history entry
    const priceHistory = [
      {
        price: Number(item.price.value) || 0,
        date: new Date(),
        source: "ebay",
      },
    ];

    return {
      product: {
        _id: item.itemId,
        name: item.title,
        brand: item.seller.username,
        condition: item.condition,
        platform: EBAY,
        imageURL: item.image.imageUrl,
        productUrl: `https://www.ebay.com/itm/${
          item.itemId.split("|")[1] || item.itemId
        }`,
        price: Number(item.price.value) || 0,
        priceHistory: priceHistory,
      },
      seller: {
        sellerName: item.seller.username,
        posFeedbackPercent: item.seller.feedbackPercentage,
        totalRatingCount: item.seller.feedbackScore,
      },
    };
  } catch (error) {
    console.log("Error retrieving eBay item by id\n");
    return null;
  }
};
