# Filscan Frontend 构建与部署指南

## 快速开始（最常用路径）

```bash
# 1. 安装依赖
npm install

# 2. 一键构建主网 + 测试网部署包（自动把静态资源放进 standalone 并打包）
bash deploy.sh

# 产物在 dist/ 目录：
#   dist/filscan-main.tar.gz  （主网，端口 9090）
#   dist/filscan-cali.tar.gz  （Calibration 测试网，端口 9092）

# 3. 部署：上传解压即用，无需手动移动任何目录
tar -xzf dist/filscan-main.tar.gz -C /root/standalone
cd /root/standalone
PORT=9090 node server.js        # 或 pm2 start node server.js --name filscan_main
```

## 环境要求

- Node.js >= 18（推荐用 nvm）
- pm2（`npm i -g pm2`，可选）
- 国内网络可配置 npm 镜像：`npm config set registry https://registry.npmmirror.com/`

## 手动构建（按需）

```bash
npm run build:main    # 主网（.env.minner）
npm run build:cali    # Calibration 测试网（.env.calibration）
npm run build:pro     # 生产（.env.proMain）
npm run build:pre     # 预发（.env.pre）
```

手动构建后需自行处理静态资源（deploy.sh 已自动完成）：
`cp -r .next/static .next/standalone/.next/static` 和 `cp -r public .next/standalone/public`

## 环境变量

- `NEXT_PUBLIC_STATIC_URL`：图片资源基地址，**默认留空 = 本地**（`/images/xxx`，资源在 `public/images/`）；填 OSS/CDN 完整地址则使用远端
- `NEXT_PUBLIC_ASSET_PREFIX`：构建产物前缀，**默认留空 = 本地**；填 OSS/CDN 地址则使用远端（OSS/CDN 配置示例见 `.env.proMain` 注释）
- `NEXT_PUBLIC_*` 在构建时内联进产物，**修改后必须重新构建**

## 常见问题

- **页面 JS/CSS 404**：确认部署包包含 `.next/static`（用 deploy.sh 或手动 cp）
- **图片裂图**：确认 `public/images/` 存在（本地模式），或 `NEXT_PUBLIC_STATIC_URL` 指向的资源可访问
- **改环境变量不生效**：`NEXT_PUBLIC_*` 构建时内联，需重新构建
- **OSS 图片下载 403**：OSS 有防盗链，需带 `Referer: https://filscan.io/`
