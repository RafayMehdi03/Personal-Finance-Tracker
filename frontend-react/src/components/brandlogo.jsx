import "./BrandLogo.css";

const BrandLogo = ({ size = "large" }) => {
  return (
    <div className={`brand-logo ${size}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="10" y="12" width="34" height="40" rx="8" className="book-main" />
        <path d="M20 23H34" className="book-line" />
        <path d="M20 31H34" className="book-line" />
        <path d="M20 39H29" className="book-line" />

        <rect x="26" y="18" width="28" height="34" rx="8" className="wallet-main" />
        <path d="M34 36L39 31L44 34L50 27" className="growth-path" />
        <circle cx="50" cy="27" r="2.7" className="growth-dot" />

        <text x="22" y="47" className="hk-small">HK</text>
      </svg>
    </div>
  );
};

export default BrandLogo;