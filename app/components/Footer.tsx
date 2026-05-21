'use client';

import './footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="c-footer">
      <div className="c-footer-inner">
        {/* Head */}
        <div className="c-footer-head">
          <svg viewBox="0 0 36 18" width="36" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" className="c-footer-circles">
            <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
            <circle cx="18" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
            <circle cx="27" cy="9" r="8.5" stroke="white" strokeOpacity="0.4"/>
          </svg>
          <h2 className="c-footer-title t-h2">
            We w<i>o</i>uld l<i>o</i>ve t<i>o</i>&nbsp;hear fr<i>o</i>m you.
          </h2>
        </div>

        {/* Body */}
        <div className="c-footer-body">
          {/* Left — contact */}
          <div className="c-footer-col c-footer-col--contact">
            <p className="c-footer-gray t-text">
              Feel free to reach out if you want to collaborate with us, or simply have a chat.
            </p>
            <a href="mailto:hello@capos.coffee" className="c-footer-email t-h5">
              hello@capos.coffee <span className="c-footer-arrow">→</span>
            </a>
          </div>

          {/* Right — columns */}
          <div className="c-footer-cols-right">
            {/* Address */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Our Address</h5>
              <address className="c-footer-address c-footer-gray t-text">
                CAPOS Coffee<br />
                London, United Kingdom<br />
                <br />
                hello@capos.coffee
              </address>
            </div>

            {/* Social */}
            <div className="c-footer-col">
              <h5 className="c-footer-col-title t-h6">Follow Us</h5>
              <ul className="c-footer-socials">
                <li><a href="#" className="c-footer-social-link t-text">Ig</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Tw</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Fb</a></li>
                <li><a href="#" className="c-footer-social-link t-text">Li</a></li>
              </ul>
            </div>

            {/* Nav */}
            <div className="c-footer-col">
              <ul className="c-footer-nav t-h6">
                <li><a href="/" className="c-footer-nav-link">Home</a></li>
                <li><a href="#work" className="c-footer-nav-link">Work</a></li>
                <li><a href="#about" className="c-footer-nav-link">About</a></li>
                <li><a href="#contact" className="c-footer-nav-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="c-footer-bottom">
          <span className="c-footer-gray t-text-sm">
            © CAPOS COFFEE 2024 All rights reserved
          </span>
          <button className="c-footer-top-btn t-text-sm" onClick={scrollToTop}>
            top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
