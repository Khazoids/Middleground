export interface SearchResult {
  product: ProductInfo;
  seller?: SellerInfo;
  relevanceScore?: number;
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
  sellerId: string;
  sellerName: string;
  posFeedbackPercent?: number;
  totalRatingCount?: number;
  thirtyDayRatingCount?: number;
}

export interface RecentSearch extends SearchResult {
  searchedAt: Date;
}

export interface PriceHistoryItem {
  price: number;
  date: Date;
  source: string;
}
