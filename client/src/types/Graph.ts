import { SearchResult } from "./Search";

export const LABEL_TRUNCATION_LENGTH = 10;
export const PERIOD_FILTER = [
    "All Time",
    "Last Year",
    "Last 90 Days",
    "Last 30 Days",
    "Last 7 Days",
]

export enum GraphType {
    PriceHistory,
    SimilarItems
}

export interface GraphProps {
    currentProduct : SearchResult;
    products: SearchResult[];
    graphType: GraphType;
    cachedItems?: Map<string, SearchResult>;
    onSimilarItemClick?: (productId: string) => void;
}

export interface FilterOptions {
    showPlatforms?: boolean,
    showTimeScale?: boolean
}