/** @type {import('next').NextConfig} */
const path = require('path')

// 构建产物（_next/*）资源前缀，通过 .env 的 NEXT_PUBLIC_ASSET_PREFIX 配置：
//   - 留空：使用本地（/_next/static/...，由 Next.js server 或 nginx 提供）
//   - OSS：https://filscan-v2.oss-accelerate.aliyuncs.com/client
//   - CDN：https://cdn.filscan.io/client
const assetPrefix = process.env['NEXT_PUBLIC_ASSET_PREFIX'] || undefined

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // 本项目是纯 pages router（无 app/ 目录），必须关闭 appDir。
  // 否则 Next 13.4 默认 appDir=true，会启用 next-render-worker-pages 渲染 worker，
  // 且这些 worker 会泄漏累积（单个 130-194MB），最终吃满内存。
  experimental: {
    appDir: false,
  },
  // 构建时跳过 ESLint（develop 分支存在历史 prettier 格式错误，会阻断 build）
  // 格式问题可单独用 npm run lint-fix 处理
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    APP_ENV: process.env['NEXT_PUBLIC_environment'],
    APP_BASE_URL: process.env['NEXT_PUBLIC_APP_BASE_URL'],
    APP_BASE_URL_PRO: process.env['NEXT_PUBLIC_APP_BASE_URL_PRO'],
    environment: process.env['NEXT_PUBLIC_environment'],
    NET_WORK: process.env['NEXT_PUBLIC_NET_WORK'],
    PORT: process.env['NEXT_PUBLIC_PORT'],
  },
  output: 'standalone',
  assetPrefix,
  i18n: {
    locales: ['zh', 'en', 'kr'],
    defaultLocale: 'zh',
  },
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
