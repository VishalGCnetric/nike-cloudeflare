
const footerClasses = "border-t-2 mt-4 bg-background p-6 text-muted-foreground";
const linkClasses = "hover:text-primary";
const columnClasses = "mt-2";

const columnGridClasses = "grid grid-cols-4 gap-8";

const Footer = () => {
  return (
    <footer className={footerClasses}>
      <div className={columnGridClasses}>
        <FooterColumn title="Resources" items={["Find A Store", "Become A Member", "Send Us Feedback"]} />
        <FooterColumn title="Help" items={["Get Help", "Order Status", "Delivery", "Returns", "Payment Options", "Contact Us On Nike.com Inquiries", "Contact Us On All Other Inquiries"]} />
        <FooterColumn title="Company" items={["About Nike", "News", "Careers", "Investors", "Sustainability"]} />
        <div className={``}>
        <span>🇮🇳 India</span>
      </div>
      </div>

      <div className={` flex space-x-4 mt-4 `}>
        <p>© 2024 Nike, Inc. All rights reserved</p>
        <div className=" space-x-8">
          <FooterLink href="#" text="Guides" />
          <FooterLink href="#" text="Terms of Sale" />
          <FooterLink href="#" text="Terms of Use" />
          <FooterLink href="#" text="Nike Privacy Policy" />
        </div>
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
    <a href={href} className={linkClasses}>
      {text}
    </a>
  );
};

export default Footer;
