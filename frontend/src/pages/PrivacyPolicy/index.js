import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShieldAlt, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import "./PrivacyPolicy.css"

const PrivacyPolicy = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="content">
      <h1>
        <FontAwesomeIcon icon={faShieldAlt} /> Privacy Policy
      </h1>

      <div className="privacy-policy-container">
        <div className="privacy-intro container">
          <p>
            At DefendX Store, we take your privacy seriously. This Privacy
            Policy outlines how we collect, use, disclose, and safeguard your
            information when you visit our website or make a purchase. Please
            read this privacy policy carefully. By accessing or using our site,
            you acknowledge that you have read, understood, and agree to be
            bound by all the terms outlined in this policy.
          </p>
          <p>
            <strong>Last Updated: May 5, 2025</strong>
          </p>
        </div>

        <div className="policy-section">
          <h2>Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> When you create an account,
            place an order, or sign up for our newsletter, we collect personal
            information such as your name, email address, shipping address,
            billing address, phone number, and payment information.
          </p>
          <p>
            <strong>Transaction Information:</strong> We collect details about
            purchases or transactions made on our site, including product
            details, purchase price, and date of transaction.
          </p>
          <p>
            <strong>Technical Information:</strong> We automatically collect
            certain information when you visit our website, including IP
            address, browser type, device type, operating system, page views,
            and access times.
          </p>
        </div>

        <div className="policy-section">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>
              Communicate with you about your order, account, or customer
              service inquiries
            </li>
            <li>
              Send promotional emails and newsletters if you've opted to receive
              them
            </li>
            <li>Improve our website, products, and customer experience</li>
            <li>
              Detect and prevent fraudulent transactions and other illegal
              activities
            </li>
            <li>Comply with our legal obligations</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party vendors who help
              us operate our business (payment processors, shipping companies,
              etc.)
            </li>
            <li>
              <strong>Marketing Partners:</strong> With your consent, we may
              share your information with marketing partners to provide you with
              relevant offers and promotions
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties for their marketing purposes.
          </p>
        </div>

        <div className="policy-section">
          <h2>Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information, including using industry-standard
            encryption to protect sensitive data transmitted online and
            maintaining safeguards to protect information stored offline.
          </p>
          <p>
            However, no method of transmission over the Internet or electronic
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="policy-section">
          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our site and hold certain information to improve your browsing
            experience. You can instruct your browser to refuse all cookies or
            to indicate when a cookie is being sent.
          </p>
        </div>

        <div className="policy-section">
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access personal information we hold about you</li>
            <li>Correct inaccurate personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
            <li>Request transfer of your personal information</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@defendxstore.com">
              privacy@defendxstore.com
            </a>
            .
          </p>
        </div>

        <div className="policy-section">
          <h2>Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us
            immediately.
          </p>
        </div>

        <div className="policy-section">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </div>

        <div className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
            <a href="mailto:privacy@defendxstore.com">
              privacy@defendxstore.com
            </a>
          </p>
        </div>

        <div className="back-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} /> Back to Top
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
