import React, { useState } from "react";
import Footer from "../Navigation/Footer/Footer";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How does the price comparison work?",
      answer:
        "Our system gathers pricing data from multiple platforms using APIs and web scraping, then displays the results in a consolidated view.",
    },
    {
      question: "Which vendors are supported?",
      answer:
        "Currently, we support platforms like Amazon, eBay, and Best Buy. We are continually adding more platforms based on user demand.",
    },
    {
      question: "How accurate is the pricing information?",
      answer:
        "We update pricing information frequently, but there may be slight delays due to the platform's update intervals.",
    },
    {
      question: "Can I search for specific products?",
      answer:
        "Yes, you can search for specific products by entering keywords in the search bar. Our system will return results from all supported platforms.",
    },
    {
      question: "Are there any subscription fees for using the platform?",
      answer:
        "No, the platform is completely free to use. However, in the future, we are considering a subscription service for users who want to save more items to their watchlist.",
    },
    {
      question: "Can I set alerts for price drops?",
      answer:
        "Yes, you can set alerts for specific products. You'll be notified via email.",
    },
    {
      question: "Can I filter results by specific criteria?",
      answer:
        "Yes, you can filter results by price, name, and other criteria on the search results page.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        color: "black",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
      className="flex flex-col h-full"
    >
      <h1>Frequently Asked Questions</h1>
      <div className="h-full">
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <button
              onClick={() => toggleQuestion(index)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderTop: "none",
                  borderRadius: "0 0 5px 5px",
                  marginTop: "-1px",
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
