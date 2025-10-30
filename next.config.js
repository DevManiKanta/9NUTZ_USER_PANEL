// // next.config.js

const nextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors in build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TS errors if any
  },
  // output: "export", // ✅ Enables static export (creates /out)
  images: {
    unoptimized: true, // ✅ Prevents image optimization error on static hosting
  },
  trailingSlash: true, // ✅ Ensures every route like /admin → /admin/index.html
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;



