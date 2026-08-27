const DISPLAY_SIZES = {
  xs: 16,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 80,
};

const BrandLogo = ({ size = 'sm', className = '', alt = 'LockForge logo' }) => {
  const px = DISPLAY_SIZES[size] || DISPLAY_SIZES.sm;

  return (
    <img
      src={"/LockForge_light.svg" || "/android-chrome-512x512.png" || "/LockForge_light.png"}
      // src="/android-chrome-512x512.png"
      alt={alt}
      width={px}
      height={px}
      className={`brand-logo-img brand-logo-img--${size} ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
};

export default BrandLogo;
