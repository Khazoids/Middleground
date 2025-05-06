import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex justify-center border-t-2">
        <ul className="flex space-x-8 m-4">
          <li>
            <Link to="/tos" className="link link-hover link-info">
              <p>Terms Of Service</p>
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="link link-hover link-info">
              <p>Privacy Policy</p>
            </Link>
          </li>
          <li>
            <Link to="/faqs" className="link link-hover link-info">
              <p>FAQs</p>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="link link-hover link-info">
              <a>Contact</a>
            </Link>
          </li>
        </ul>
    </div>
  );
};

export default Footer;
