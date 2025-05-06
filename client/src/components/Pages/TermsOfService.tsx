import Footer from "../Navigation/Footer/Footer";
const TermsOfService = () => {
  return (
    <div className="container flex flex-col h-full place-self-center">
      <div className="container flex grow flex-col space-y-8 mt-4">
        <h1 className="font-bold text-4xl">Terms of Service</h1>
        <h2 className="font-bold">Last updated: 2025-03-20</h2>
        <p>
          This website provides a free service and, as such, we provide no
          warranty or guarantee of service or uptime. By using this site, you
          acknowledge that you have read and agree to these terms and do so at
          your own risk.
        </p>
        <p>
          This website and its services are intended for consumers. Scraping
          and/or other automated data collection from our website and/or emails
          is prohibited. Republishing our data is prohibited. Referencing our
          data without credit, particularly on other affiliate websites, is
          prohibited.
        </p>
        <p>
          We reserve the right to disable or delete user accounts and/or price
          watches for any reason. Usually, in cases of abuse or overuse.{" "}
        </p>
        <p>
          CERTAIN CONTENT THAT APPEARS ON THIS SITE COMES FROM AMAZON SERVICES
          LLC. THIS CONTENT IS PROVIDED ‘AS IS’ AND IS SUBJECT TO CHANGE OR
          REMOVAL AT ANY TIME.
        </p>
        <p>
          MiddleGround is a participant in the Amazon Services LLC Associates
          Program, an affiliate advertising program designed to provide a means
          for sites to earn advertising fees by advertising and linking to
          Amazon.com. Amazon and the Amazon logo are trademarks of Amazon.com,
          Inc. or its affiliates.
        </p>
        <p>
          {" "}
          Product prices and availability are accurate as of the date/time
          indicated and are subject to change. Any price and availability
          information displayed on Amazon at the time of purchase will apply to
          the purchase of this product.
        </p>
        
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
