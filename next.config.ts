// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // ✅ Skip ESLint errors in build
//   },
//   typescript: {
//     ignoreBuildErrors: true, // ✅ Skip TS errors if any
//   },
//   output: "export", // ✅ Enables static export (creates /out)
//   images: {
//     unoptimized: true, // ✅ Prevents image optimization error on static hosting
//   },
//   trailingSlash: true, // ✅ Ensures every route like /admin → /admin/index.html
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // skip ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // skip TS type errors during build
  },
  // ❌ No `output: "export"` — we are NOT doing static export here
  images: {
    // add remotePatterns if you load external images, e.g.:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'images.example.com' },
    // ],
    unoptimized: false, // let Next optimize images when running on a server
  },
  trailingSlash: false, // typical for server-hosted Next.js
};

module.exports = nextConfig;



