import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./FAQ.css";

function FAQItem({ question, answer, isOpen, toggle }) {
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={toggle}>
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} /> {question}
        </h3>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="faq-icon"
        />
      </div>
      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  // Store which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle FAQ item expansion
  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  
  const faqData = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Orders' section in your profile. There you'll find real-time updates on your order status, including shipping information and expected delivery dates."
    },
    {
      question: "What is your return policy?",
      answer: "DefendX offers a 30-day return policy for unworn and unwashed items with original tags attached. To initiate a return, log into your account, go to your order history, select the item you wish to return, and follow the instructions. Return shipping is free for exchanges, while refunds may incur a small shipping fee."
    },
    {
      question: "How do I know which size to choose?",
      answer: "We provide detailed size guides for all our products. When viewing an item, look for the 'Size Guide' link near the size selection options. Our size charts include measurements in inches and centimeters, as well as conversion from international sizing standards. For the best fit, we recommend measuring yourself and comparing to our size chart."
    },
    {
      question: "Are there any active promotional codes?",
      answer: "First-time customers can use the code DEFEND1 to get 20% off their first order. We regularly offer seasonal promotions and special discounts to our newsletter subscribers and social media followers. You can also earn exclusive discounts by referring friends to our store."
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Signup' button in the top right corner of our website. You'll need to provide your email address, create a username and password, and fill in basic information. Verifying your email unlocks additional benefits such as account recovery options and exclusive discounts."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard)and bank transfers. All transactions are secured using industry-standard encryption to protect your payment information."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping within Sri Lanka takes 3-5 business days. This may vary depending on your location and customs processing. Express shipping options are available at checkout for faster delivery. You'll receive tracking information once your order ships."
    },
    
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team by emailing support@defendxstore.com or through the 'Support' section of our website where you can create a support ticket. Our team is available Monday through Friday, 9 AM to 6 PM Sri Lanka time. You can also connect with us through our social media channels."
    },
    {
      question: "What is the referral program?",
      answer: "Our referral program allows you to earn rewards by inviting friends to shop with us. When you create an account, you'll receive a unique referral link that you can share. When someone makes their first purchase using your link, you'll receive store credit or exclusive discounts on future purchases."
    }
  ];

  return (
    <div className="content">
      <h1>
        <FontAwesomeIcon icon={faQuestionCircle} /> Frequently Asked Questions
      </h1>
      
      <div className="faq-container">
        <div className="faq-intro container">
          <p>
            Welcome to the DefendX Store FAQ section. Here you'll find answers to the most common questions about our products, 
            ordering process, shipping, returns, and account management. If you can't find what you're looking for, 
            please don't hesitate to contact our customer support team 📞.
          </p>
        </div>

        <div className="faq-list">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={!!expandedItems[index]}
              toggle={() => toggleItem(index)}
            />
          ))}
        </div>

        <div className="faq-contact container">
          <h3>Still have questions?</h3>
          <p>
            If you couldn't find the answer to your question, feel free to reach out to our customer support team at{" "}
            <a href="mailto:support@defendxstore.com">support@defendxstore.com</a> or create a support ticket through our{" "}
            <a href="/support">Support page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}