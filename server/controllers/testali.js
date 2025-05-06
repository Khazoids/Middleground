import axios from "axios";

const ALIEXPRESS_API_KEY = process.env.ALIEXPRESS_API_KEY || "your-rapidapi-key";

const testAliExpressAPI = async () => {
  try {
    const url = "https://aliexpress-datahub.p.rapidapi.com/item_search?q=iphone&page=1&sort=default";

    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": ALIEXPRESS_API_KEY,
        "X-RapidAPI-Host": "aliexpress-datahub.p.rapidapi.com"
      },
    });

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error testing AliExpress API:", error.response?.data || error.message);
  }
};

testAliExpressAPI();
