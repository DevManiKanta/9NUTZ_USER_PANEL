// // next.config.js

const nextConfig = {
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
};

module.exports = nextConfig;



