'use client';

import '../styles/footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="footer">
      <div className="footer-content container">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>CAPOS</h2>
            <p>Coffee Collective</p>
            <p className="footer-tagline">Exceptional coffee, crafted with passion</p>
          </div>

          <div className="footer-contact">
            <h3>Get In Touch</h3>
            <p>
              <a href="mailto:hello@capos.coffee">hello@capos.coffee</a>
            </p>
            <p>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#featured">Shop</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#">Subscription</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" aria-label="Instagram">@capos.coffee</a>
              <a href="#" aria-label="Twitter">@capos_coffee</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CAPOS. All rights reserved.</p>
          <button className="footer-top-btn" onClick={scrollToTop}>
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
