import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/multica-website-example",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
