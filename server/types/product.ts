export interface CommonSearchResults {
  product: ProductInfo,
  seller?: SellerInfo
  searchTerms?: Array<string>,
  relevanceScore?: number
}

export interface ProductInfo {
  _id: string;
  name: string;
  brand?: string;
  platform: string;
  condition?: string;
  price: number | null;
  priceHistory?: Array<PriceHistoryItem>;
  productUrl?: string;
  imageURL?: string | null;
}

export interface SellerInfo {
  sellerName: string;
  posFeedbackPercent?: number;
  totalRatingCount?: number;
  thirtyDayRatingCount?: number;
}

export interface PriceHistoryItem {
  price: number;
  date: Date;
  source: string;
}

export interface AmazonSearchResults {
    asin: string,
    title: string,
    brand: string,
    csv: number[][],
    imagesCSV: string,
    buyBoxUsedHistory?: string[],
    buyBoxSellerIdHistory?: string[],
    offers: AmazonOffersObject[],
    liveOffersOrder?: number[],
    stats?: {
        current: number[],
        avg: number[]
    }
}

export interface AmazonOffersObject {
  sellerId: string,
  offerCSV: number[],
  condition: string,
  isFBA: string
}
export interface eBaySearchResults {
  itemId: string,
  title: string,
  condition: string,
  seller: {
    username: string,
    feedbackPercentage: number,
    feedbackScore: number
  },
  image: {
    imageUrl: string
  },
  price: {
    value: string
  }
}

