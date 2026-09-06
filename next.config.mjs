/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    // The placeholder art in public/images is SVG, which the optimizer rejects
    // unless explicitly allowed. It is served under a sandbox CSP that blocks
    // scripting, which is the documented safe configuration. Once real photography
    // replaces the placeholders these three lines can go.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
};

export default nextConfig;
