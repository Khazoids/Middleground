// components/Pages/Subscription.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  // Temporary state to toggle between subscribed/unsubscribed views
  const [isSubscribed, setIsSubscribed] = useState(false);

  // TO-DO: Implement navigation to a payment processing page (needs to be implemented as well someday).
  const navigate = useNavigate();

  const handleCancel = () => {
    setIsSubscribed(false);
    // TO-DO: Add actual cancellation logic here
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    // TO-DO: Add actual subscription logic here
  };

  const handleLearnMore = () => {
    // TO-DO: Add navigation to subscription details page
    // navigate blah blah blah
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Subscription</h1>
        <span
          className={`text-lg text-center ${
            isSubscribed ? "text-black" : "text-base-content/80"
          }`}
        >
          {isSubscribed ? "Subscribed" : "Not Subscribed."}
        </span>
      </div>

      <div className="divider divider-neutral"></div>

      {isSubscribed ? (
        // Subscribed View
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-6">
            Thank you for supporting our team
          </h2>
          <button
            onClick={handleCancel}
            className="btn btn-outline min-w-[200px]"
          >
            Cancel
          </button>
        </div>
      ) : (
        // Not Subscribed View
        <div className="bg-accent rounded-lg p-8 mt-6">
          <div className="flex gap-8">
            {/* Info Icon Column */}
            <div className="flex-none">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                {/* Add information icon here at later date */}
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-grow">
              <p className="text-lg mb-4">
                With a subscription, you get access to exclusive features like
                an expanded Watch List limit and more detailed market analytics.
              </p>

              <div className="flex items-center gap-4">
                <button onClick={handleLearnMore} className="btn btn-link px-0">
                  Learn More
                </button>

                <button onClick={handleSubscribe} className="btn btn-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
