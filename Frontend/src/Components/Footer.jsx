import "./Footer.css";
import insta from "../Assets/instagram.png";
import twitter from "../Assets/twitter.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Urban Fashion</h2>
          <p>
            Defining high-street premium style for
            <br />
            the digital generation. Elevating your
            <br />
            wardrobe one collection at a time.
          </p>

          <div className="social-icons">
            <a href="#">
              <twitter />
            </a>
            <a href="#">
              <insta />
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h4>COMPANY</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Store Locator</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="footer-column">
          <h4>CUSTOMER SUPPORT</h4>
          <ul>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Shipping & Returns</a>
            </li>
            <li>
              <a href="#">Size Guide</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-column">
          <h4>LEGAL</h4>
          <ul>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 Urban Fashion. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
