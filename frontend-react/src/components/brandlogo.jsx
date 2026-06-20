// BrandLogo.jsx
// Simple, dependency-free mark for HisaabKitaab. Kept as its own component
// so Auth.jsx (and anywhere else) can import a single source of truth for
// the brand mark instead of duplicating SVG/markup.
//
// Usage: <BrandLogo size="large" /> or <BrandLogo size="small" />

const BrandLogo = ({ size = "small" }) => {
  const dimension = size === "large" ? 56 : 40;

  return (
    <div className="brand-mark" style={{ width: dimension, height: dimension }}>
      <svg
        width={dimension * 0.56}
        height={dimension * 0.56}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* An open ledger / passbook mark — two ruled pages meeting at a spine */}
        <path
          d="M12 4.5C10.1 3.3 7.6 2.7 5 2.7c-.7 0-1.3.06-2 .17v14.9c.7-.11 1.3-.17 2-.17 2.6 0 5.1.6 7 1.8 1.9-1.2 4.4-1.8 7-1.8.7 0 1.3.06 2 .17V2.87c-.7-.11-1.3-.17-2-.17-2.6 0-5.1.6-7 1.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 4.5v14.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M5.6 6.4c1.3-.15 2.7 0 3.9.5M5.6 9.4c1.3-.15 2.7 0 3.9.5M5.6 12.4c1.3-.15 2.7 0 3.9.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default BrandLogo;
