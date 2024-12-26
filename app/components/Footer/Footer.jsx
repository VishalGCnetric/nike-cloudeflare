import PropTypes from "prop-types";

const footerClasses = "border-t-2 mt-4 bg-background p-6 text-muted-foreground";
const linkClasses = "hover:text-primary";
const columnClasses = "mt-2";
const columnGridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8";

const Footer = () => {
  return (
    <footer className={footerClasses}>
      <div className={columnGridClasses}>
        <FooterColumn title="Resources" items={["Find A Store", "Become A Member", "Send Us Feedback"]} />
        <FooterColumn title="Help" items={["Get Help", "Order Status", "Delivery", "Returns", "Payment Options", "Contact Us On Nike.com Inquiries", "Contact Us On All Other Inquiries"]} />
        <FooterColumn title="Company" items={["About Nike", "News", "Careers", "Investors", "Sustainability"]} />
        <div className={`mt-2`}>
          <span>🇮🇳 India</span>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row md:justify-between space-x-0 md:space-x-4 mt-4`}>
        <p>© 2024 Nike, Inc. All rights reserved</p>
        <nav className="space-x-8">
          <FooterLink href="#" text="Guides" />
          <FooterLink href="#" text="Terms of Sale" />
          <FooterLink href="#" text="Terms of Use" />
          <FooterLink href="#" text="Nike Privacy Policy" />
        </nav>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, items }) => {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className={columnClasses}>
        {items.map((item, index) => (
          <li key={index}>
            <FooterLink href="#" text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterLink = ({ href, text }) => {
  return (
    <a href={href} className={linkClasses} aria-label={text}>
      {text}
    </a>
  );
};

// PropTypes validation
FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Footer;
