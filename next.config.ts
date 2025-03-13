/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  experimental: {
    // ... other experimental options
    esmExternals: true,
  },
}

export default nextConfig
