// // next.config.js

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors in build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TS errors if any
  },
  output: "export", // ✅ Enables static export (creates /out)
  images: {
    unoptimized: true, // ✅ Prevents image optimization error on static hosting
  },
  trailingSlash: true, // ✅ Ensures every route like /admin → /admin/index.html
};

module.exports = nextConfig;

// next.config.js
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
//   // Remove this line:
//   output: "export",
//   // Use this if you want a portable server build (Docker/Node):
//   output: "standalone",
//   images: { unoptimized: true },
// };
// module.exports = nextConfig;

