import { CommonSearchResults } from "../types/product"

const generateTestProducts = () : CommonSearchResults[] => {
    const products = []
    for(let i = 0; i < 20; i++) {
        products.push({
            _id: i + "",
            name: "Test Product " + i,
            brand: "Test Brand " + i,
            platform: i % 2 === 0 ? "Amazon" : "eBay",
            imageURL: "https://images-na.ssl-images-amazon.com/images/I/61EL2AKKcBL.jpg",
            price: Math.random() *  500,
            productUrl: "https://www.amazon.com/dp/B0CTBCDD6D",
            relevanceScore: 0
        })
    }
    return products;
}

const generateRandomDate = (start: Date, end: Date) : Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
const generateSingleTestProduct = () : CommonSearchResults => {
    const priceHistory = [];
    for(let i = 0; i < 200; i++) {
        priceHistory.push({
            price: Math.random() * 500,
            date: generateRandomDate(new Date(), new Date(2025, 0, 1)),
            source: "amazon"
        })
    }

    return ({
        product: {
        _id: "0",
        name: "Test Product ",
        brand: "Test Brand ",
        platform: "Amazon",
        condition: "New",
        imageURL: "https://images-na.ssl-images-amazon.com/images/I/61EL2AKKcBL.jpg",
        price: Math.random() *  500,
        priceHistory: priceHistory,
        },
        seller: {
            sellerName:"Test Seller Name"
        },

        relevanceScore: 0
    })
}
export const TestProducts : CommonSearchResults[] = generateTestProducts();
export const SingleTestProduct : CommonSearchResults = generateSingleTestProduct();