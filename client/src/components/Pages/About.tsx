import brady_headshot from "../../assets/brady_headshot.png";
import daniel_headshot from "../../assets/daniel_headshot.png";
import phillip_headshot from "../../assets/phillip_headshot.jpg";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import priceHistoryImg from "../../assets/priceHistory.png";
import productCompareImg from "../../assets/priceComparison.png";
import watchlistImg from "../../assets/watchlist.png";

const About = () => {
  return (
    <div className="container justify-self-center h-full">
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-lift">
      <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="The Project"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <h2 className="text-2xl font-bold mb-4">Middleground: Price Comparison Tool</h2>
          <p className="mb-4">
            Middleground is a smart shopping assistant that compares product prices across Amazon, eBay, and Best Buy. 
            It solves the problem of manually checking multiple websites to find the best deal on a product.
            With live data from APIs and scrapers, users get real-time price comparisons, price history graphs, 
            and the ability to create a personalized watchlist for items they care about.
          </p>

          <p className="mb-4">
            <strong>Key Features:</strong>
            <ul className="list-disc list-inside ml-4">
              <li>Live price comparison across major platforms</li>
              <li>Price history visualization</li>
              <li>Watchlist with alert capability</li>
              <li>Clean, responsive UI for seamless shopping</li>
            </ul>
          </p>

          <p className="mb-4">
            <strong>Technologies Used: </strong>
            React, Typescript, Node.js, Puppeteer (for scraping BestBuy), 
            Amazon & eBay APIs, MongoDB for storing user data and price history, AWS for web hosting
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <img src={productCompareImg} alt="Product Comparison" className="rounded-xl shadow-md w-full" />
              <p className="text-center mt-2 text-sm">Live product comparison</p>
            </div>
            <div>
              <img src={priceHistoryImg} alt="Price History Graph" className="rounded-xl shadow-md w-full" />
              <p className="text-center mt-2 text-sm">Price history tracking</p>
            </div>
            <div>
              <img src={watchlistImg} alt="Watchlist" className="rounded-xl shadow-md w-full" />
              <p className="text-center mt-2 text-sm">User watchlist</p>
            </div>
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="The Team"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <h1 className="text-center font-bold text-2xl">Team Members</h1>
          <div className="people-container space-y-8">
            <div className="grid grid-cols-[20%_80%] grid-rows-[15%_85%]">
              <h1 className="text-center font-bold text-2xl mb-2">
                Brady Spinti
              </h1>
              <div className="col-start-1 row-start-2 text-center flex flex-col items-center">
                <img
                  alt="brady"
                  src={brady_headshot}
                  className="h-60 w-60 border border-primary rounded-full"
                />
                <p className="font-bold">Brady.spinti@gmail.com</p>
              </div>
              <span className="my-auto row-span-2">
              Hi there! I'm Brady Spinti. I am a computer science student at the 
              University of Utah with a strong interest in both web develpment
              and machine learning. Throughout my academic journey, I've gained 
              experience programming in multiple languages, with a particular 
              emphasis on Python and Java. My technical skills have been further 
              developed through hands-on work during my internship with the Center 
              for High Performance Computing (CHPC) at the university, where I am
              deeply involved in managing and analyzing computer networks. 
              This experience helped me strengthen my understanding of system-level 
              operations, network protocols, and performance monitoring in high-performance 
              computing environments.
              <br />
              <br />
              Beyond academics and technical projects, I enjoy staying active and spending time in nature. 
              I’m an avid hiker, skier, and enjoy playing disc golf. I also enjoy reading and playing games 
              in my down time.
              </span>
            </div>

            <div className="grid grid-cols-[80%_20%] grid-rows-[15%_85%]">
              <span className="col-start-1 row-span-2 my-auto">
                Hi there! I'm Daniel Wong, a senior at the University of Utah
                graduating this coming spring with my bachelor's in Computer
                Science. I'm passionate about full-stack development, DevOps,
                and cloud platform engineering. For MiddleGround, I worked as a
                full-stack developer primarily responsible for implementing the
                search capabilities, contributing to the product details and
                results pages, and managing our cloud deployment. I leveraged
                technologies like React, TypeScript, and Tailwind CSS on the
                front-end while working with AWS cloud services to ensure
                reliable deployment and scalability. <br />
                <br />
                When I'm not coding, I'm usually either weight training, rock
                climbing, or gaming. After graduation, I hope to join a dynamic
                team where I can continue growing my skillset while contributing
                to meaningful projects that make a difference in people's lives.
              </span>
              <h1 className="text-center font-bold col-start-2 row-start-1 text-2xl mb-2">
                Daniel Wong
              </h1>
              <div className="col-start-2 row-start-2 text-center flex flex-col items-center">
                <img
                  alt="daniel"
                  src={daniel_headshot}
                  className="h-60 w-60 border border-secondary rounded-full"
                />
                <div className="text-center">
                  <p className="font-bold">dnwong0214@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[20%_80%] grid-rows-[15%_85%]">
              <h1 className="font-bold text-center text-2xl mb-2">
                Phillip Truong
              </h1>
              <div className="col-start-1 row-start-2 text-center flex flex-col items-center">
                <div className="overflow-hidden h-60 w-60 flex-none rounded-full border border-success">
                  <img alt="phillip" src={phillip_headshot} />
                </div>
                <div className="text-center">
                  <p className="font-bold">Phillipxtr@gmail.com</p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href="https://www.linkedin.com/in/pxtruong/"
                      target="_blank"
                    >
                      <LinkedInLogoIcon width={25} height={25} />
                    </a>
                    <a href="https://github.com/Khazoids" target="_blank">
                      <GitHubLogoIcon width={25} height={25} />
                    </a>
                  </div>
                </div>
              </div>
              <span className="my-auto row-span-2">
                Hello, my name is Phillip Truong and I'm double bachelor's
                student at the University of Utah. Currently, I'm a senior at
                the University of Utah pursuing my second bachelor's degree in
                Computer Science. I'll be graduating this Spring at the
                conclusion of capstone semester. Some of my academic interests
                are computer graphics, foreign language, and artificial
                intelligence. I was born and raised here in Salt Lake City, UT.
                Some of my other interests as of late are computer graphics and
                audio processing.
                <br />
                <br />I have a lot of hobbies outside of programming and coding
                but often find that whatever it is I do, there is some aspect of
                technology interwoven into it. For example, I like collecting a
                lot of things that may or may not stay with me for a short time.
                When the time comes, I'll have to find an interested buyer to
                give my collectible a new home. The burden of buying and selling
                when collecting items was the inspiration for this capstone
                project. If technology is involved at every turn, then why not
                try and take advantage of it to make our lives easier? With the
                tools I've learned to wield through the coursework here at the
                University of Utah, I plan to pursue these interests in the form
                of personal projects. These are simply projects undertaken for
                personal enjoyment, but I hope my efforts will improve the life
                of someone wherever they may be.
              </span>
            </div>
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="User Tutorial"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">How to Use MiddleGround</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/D6LbGueAwuE"
                title="User Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px]"
              ></iframe>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Follow along with our tutorial to learn how to make the most of
              MiddleGround's features.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
