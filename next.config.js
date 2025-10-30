// // // next.config.js

// const nextConfig = {
//   poweredByHeader: false,
//   eslint: {
//     ignoreDuringBuilds: true, // ✅ Skip ESLint errors in build
//   },
//   typescript: {
//     ignoreBuildErrors: true, // ✅ Skip TS errors if any
//   },
//   output: "export",
//   images: {
//     unoptimized: true, 
//   },
//   trailingSlash: true,
//   async headers() {
//     return [
//       {
//         source: '/:path*',
//         headers: [
//           { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
//           { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
//           { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true, 
//   },
//   output: "export", 
//   images: {
//     unoptimized: true, 
//   },
//   trailingSlash: true, 
// };

// module.exports = nextConfig;

// next.config.js
const nextConfig = {
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Remove or comment out headers() when doing static export
  // async headers() { ... }
};

module.exports = nextConfig;
