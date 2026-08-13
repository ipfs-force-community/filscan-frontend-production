# Filscan Frontend 构建与部署指南

## 快速开始（最常用路径）

```bash
# 1. 安装依赖
npm install

# 2. 一键构建主网 + 测试网部署包（自动把静态资源放进 standalone 并打包）
bash deploy.sh

# 产物在 dist/ 目录：
#   dist/filscan-main.tar.gz  （主网，应用内部端口 3000，对外由 Nginx 9090 反代）
#   dist/filscan-cali.tar.gz  （Calibration 测试网，端口 9092）

# 3. 部署：上传解压即用，无需手动移动任何目录
tar -xzf dist/filscan-main.tar.gz -C /root/standalone
cd /root/standalone
HOSTNAME=127.0.0.1 PORT=3000 pm2 start server.js --name filscan_main && pm2 save
```

## 生产运维规范（务必遵守，避免事故）

### PM2 启动规则

```bash
# 标准启动（主网示例）：直接 node server.js，禁止 npm 包装，禁止 --watch
cd /root/shuqi/filscan-frontend-production/dist/standalone
HOSTNAME=127.0.0.1 PORT=3000 pm2 start server.js --name filscan_main
pm2 save

# cali 测试网：端口 9092
cd /root/shuqi/filscan-frontend-production/dist/standalone
HOSTNAME=127.0.0.1 PORT=9092 pm2 start server.js --name filscan_cali
pm2 save
```

1. **禁止 `--watch`**：standalone 运行时 `.next`/日志有文件写入会触发无限重启（历史上 main 进程重启 5600+ 次）
2. **禁止 npm 包装**（`pm2 start npm -- run main`）：会读到服务器上旧的 package.json 脚本（旧 PORT），改用 `pm2 start server.js`
3. **改启动方式必须 `pm2 delete` 后重建**：`pm2 restart` 保留旧启动参数和环境
4. **每次改动后 `pm2 save`**：覆盖 dump，否则 pm2/系统重启会 resurrect 旧的坏进程
5. 应用端口：主网 3000（Nginx 9090 反代）、cali 9092（Nginx 443 反代）；端口规划见下方架构

### 部署架构与端口

| 环境 | 入口 | 中间层 | 应用监听 |
|---|---|---|---|
| 主网 filscan.io | ALB | Nginx 9090（含 set_real_ip_from ALB 网段） | 127.0.0.1:3000 |
| cali calibration.filscan.io | DNS 直连（无 ALB） | Nginx 443（三层限流，无 real_ip） | 172.31.33.238:9092 |

Nginx 配置在仓库 `nginx/` 目录：主网 `filscan.conf`+`anti-dos-limits.conf`，cali `cali-online.conf`。

### 快速恢复（502/无法访问时）

```bash
# 1. 看进程和端口
pm2 status
ss -tlnp | grep -E '3000|9090|9092'

# 2. 应用没起来/崩溃循环（restarts 很大、uptime 0s）：
pm2 delete <应用名>
cd <standalone目录>
HOSTNAME=127.0.0.1 PORT=<正确端口> pm2 start server.js --name <应用名>
pm2 save

# 3. 验证链路
curl -sI http://127.0.0.1:<应用端口>/ | head -3    # 应用 200
curl -sI http://127.0.0.1:<nginx端口>/  | head -3   # Nginx 200
```

### 常见问题

- **页面 JS/CSS 404**：确认部署包包含 `.next/static`（用 deploy.sh 或手动 cp）
- **cali chunk 404**：线上 Nginx 静态 location 必须反代应用，不能 `root` 本地目录（`cali-online.conf` 已修复）
- **限流返回 503 而不是 429**：检查是否漏配 `limit_req_status 429;`
- **502 Bad Gateway**：多为应用崩溃循环或端口不对，按上面"快速恢复"
- **图片裂图**：确认 `public/images/` 存在（本地模式），或 `NEXT_PUBLIC_STATIC_URL` 指向的资源可访问
- **改环境变量不生效**：`NEXT_PUBLIC_*` 构建时内联，需重新构建
- **OSS 图片下载 403**：OSS 有防盗链，需带 `Referer: https://filscan.io/`
