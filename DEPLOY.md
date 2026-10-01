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
5. 应用端口：主网 3000（本机 Nginx 9090 反代，公网入口 443/80 → 9090）、cali 9092（Nginx 443 反代）；端口规划见下方架构

### 部署架构与端口

| 环境 | 入口 | 中间层 | 应用监听 |
|---|---|---|---|
| 主网 filscan.io | DNS 直连弹性 IP 35.77.192.250（绑 frontend01） | 本机 Nginx 443/80（LE 证书，含 80→443 跳转与 /api/v1/*、/pro/v1/* 分流）→ 127.0.0.1:9090（三层限流） | 127.0.0.1:3000 |
| cali calibration.filscan.io | DNS 直连（无 ALB），EIP 57.182.186.126 直绑应用机 172.31.33.238 | 本机 Nginx 443（与前端/后端同机，三层限流，无 real_ip） | 127.0.0.1/内网 9092（前端）、27000（API） |

Nginx 配置在仓库 `nginx/` 目录：主网入口 `filscan-edge.conf`+`filscan-edge-proxy.conf`，主网业务反代 `filscan.conf`+`anti-dos-limits.conf`，cali `cali-online.conf`。主网三份文件与线上逐字节一致（`md5` 相同），线上改动必须同步回仓。

主网自 2026-10-01 起去掉 ALB+NLB，弹性 IP 35.77.192.250 直接绑到 frontend01，链路为 `DNS → 35.77.192.250(frontend01) → 本机 Nginx 443/80 → 127.0.0.1:9090（三层限流）→ 127.0.0.1:3000`；证书由 ALB 侧商业证书换成本机 Let's Encrypt（一张覆盖 filscan.io / www.filscan.io / m.filscan.io / api-v2.filscan.io，webroot 自动续期、`certbot.timer` 已启用，**公网 80 必须保持放行**）。API 路径 `/api/v1/*`、`/pro/v1/*` 由入口直接反代到主网后端 172.31.34.109:27000（与替换前 ALB 的路径分流一致）；9090 业务块的 `set_real_ip_from` 只信任 `127.0.0.1`（原 ALB 网段已删除），入口层单独写日志 `/var/log/nginx/edge-access.log` 以免与 9090 层重复计数。

cali 的 Nginx 自 2026-10-01 起与前端/后端同机部署在 172.31.33.238（弹性 IP 57.182.186.126 直绑该机，DNS 直连无 ALB），链路为 DNS 直连 → 本机 Nginx 443 → 127.0.0.1/内网 9092（前端）/ 27000（API）；**公网 80 必须保持放行**，因为 api-cali.filscan.io 的 Let's Encrypt 证书靠 HTTP-01 续期。

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

### 502 归因：分两层看（入口层 443/80 还是业务反代层 9090）

主网链路（2026-10-01 起）是 `DNS → 本机 Nginx 443/80 → Nginx(9090) → Next.js(127.0.0.1:3000)`。ALB/NLB 已下线，因此 **502/504 只可能来自本机 nginx 或应用进程**：要么入口层拿不到 9090 的响应，要么 9090 拿不到 127.0.0.1:3000 的响应。

两层日志分开看：

- **入口层（本机 Nginx 443/80，`nginx/filscan-edge.conf`）**：访问日志 `/var/log/nginx/edge-access.log`（该块显式指定，单独记账以免与 9090 层重复）；错误进全局 `/var/log/nginx/error.log`。
- **业务反代层（本机 Nginx 9090，`nginx/filscan.conf`）**：访问日志 `/var/log/nginx/access.log`；限流与上游错误日志 `/var/log/nginx/filscan-limit.log`（该 server 块的 `error_log` 指向它，**不是** `error.log`）。
- `/api/v1/*`、`/pro/v1/*` 由入口层直接反代到后端 172.31.34.109:27000，不经过 9090；这些路径报错要去看后端，不要只看前端两个日志。

```bash
curl -sSI https://filscan.io/ | grep -i -E '^(HTTP|server)'
# server: nginx  → 本机 nginx 报的：入口层连不上 9090（查 nginx 是否重载失败 / 9090 是否在监听），
#                  或 9090 连不上 127.0.0.1:3000（查 PM2 应用，按「快速恢复」处理）
```

判定依据：

- 现在公网 5xx 只可能带 `Server: nginx`。Nginx 自产 502 页是标准页（502 约 150 字节，含 `<hr><center>nginx</center>`）；`server_tokens off` 只去掉版本号，`Server` 值仍是 `nginx`。
- **历史判据（自 2026-10-01 起失效，仅用于回溯该日期之前的故障记录）**：ALB 自产错误页曾带 `Server: awselb/2.0`；ALB/NLB 已下线、EIP 35.77.192.250 直绑 frontend01，该签名不会再出现，CloudWatch 的 `HTTPCode_Target_5XX_Count` / `HTTPCode_ELB_5XX_Count` 也随之停用。
- 全站（含 `/_next/static/*`、`robots.txt`）持续 502 且耗时稳定 = 3000 端口长期不可用，不是抖动、也不是限流（限流走 429/503）。若同时 `calibration.filscan.io` 返回 200，则机房/DNS 层均正常，问题只在该应用的 Node 进程。
- 出现 502 说明请求已经走到 Nginx，**与安全组、网络 ACL 无关**；先分层看日志，别只看一层。

排查顺序：`pm2 status` → `ss -tlnp | grep :3000` → `tail -100 /var/log/nginx/filscan-limit.log`（9090 层，找 `connect() failed (111: Connection refused) while connecting to upstream`）→ `tail -100 /var/log/nginx/error.log` 与 `tail -100 /var/log/nginx/edge-access.log`（入口层，找连 9090 失败/超时）→ `pm2 logs filscan_main --err` → `free -m`。

主网前端主机 `frontend01`（AWS ap-northeast-1，SSH 别名已配在本地 `~/.ssh/config`），应用目录 `/root/shuqi/filscan-frontend-production/dist/standalone`。

### 504 归因：全站 504 一般是前端进程自己卡住

`Server: nginx`（2026-10-01 起公网 5xx 唯一可能的签名）+ **所有路径**（含 `favicon.ico`/`robots.txt`）一致 504 ⇒ 上游等不到响应：入口层（443/80）等不到 9090，或 9090 等不到 127.0.0.1:3000。责任在 3000 端口的 Node 进程或其宿主机，**不在 filscan_backend、不在 londobell、不在 aggregator**（前端页面与静态资源都不经它们；`/api/v1/*`、`/pro/v1/*` 虽由入口直连后端 172.31.34.109:27000，但后端慢只会让页面数据空/慢，不会让页面本身 504）。

（历史判据，2026-10-01 起失效：ALB 自产 504 错误页、以及 ALB「无健康 target」时的 503，均已随 ALB/NLB 下线消失；签名细节见上文「502 归因」的历史判据。）

三类签名速查（同一次故障会先后出现不同签名，别当成三个问题）：

| 外部看到 | 含义 | 本机证据 |
|---|---|---|
| 504 `Server: nginx` | Node 进程活着但不回包（GC 卡死 / 事件循环阻塞） | `filscan-limit.log` 里的 `upstream timed out (110)` |
| 502 `Server: nginx` | 3000 端口没人监听（进程崩了 / 重启中 / 没起来） | `filscan-limit.log` 里的 `connect() failed (111: Connection refused)` |
| 502/504 `Server: nginx` 且 9090 层日志无对应记录 | 入口层连不上 9090（nginx 重载失败 / 9090 未监听） | 入口层 `/var/log/nginx/error.log` 里的 `connect() failed ... 127.0.0.1:9090` |

**前端进程最常见的崩溃模式：V8 堆 OOM。** 判据（在 frontend01 上）：

```bash
grep -c "FATAL ERROR" /root/.pm2/logs/filscan-main-error.log   # >0 即发生过堆 OOM
grep -n "heap out of memory" /root/.pm2/logs/filscan-main-error.log | tail
grep -E "SIGABRT" /root/.pm2/pm2.log | tail                    # PM2 记录的自杀式退出
```

崩法不是瞬间死：报错是 `Ineffective mark-compacts near heap limit` —— 堆到顶后 GC 变成无效回收，**事件循环被卡死几分钟**，请求收得进、回不出，所以外部表现为 504；随后 V8 abort（SIGABRT），PM2 秒级重启（这两次重启用户通常无感）。整机会被 GC 一起拖僵（`journalctl` 里 snapd watchdog 超时、sshd/EC2 Instance Connect 超时），但**内核日志里没有 oom-killer 记录** —— 别去 `dmesg` 找 OOM，那是另一个方向。

**已固化的生产基线（2026-09-21 起，改动前先看这里）：**

1. **PM2 开机自启**：`systemctl is-enabled pm2-root` 应为 `enabled`（单元 `/etc/systemd/system/pm2-root.service`，`ExecStart=.../pm2 resurrect`、`PM2_HOME=/root/.pm2`）。**改过进程列表必须 `pm2 save`**，否则重启后 resurrect 的是旧 dump；缺这个单元时重启机器后应用不会自己起来，只能人工拉起。
2. **运行时版本（2026-09-24 起）**：node **18.20.8**（`/root/.nvm/versions/node/v18.20.8/bin/node`）——pm2 systemd 单元的 `Environment=PATH` 与三个 `Exec*` 绝对路径、`/root/check_frontend.sh` 的 PATH、`nvm alias default` 都指它。**从 18.16.0 升级的原因**：18.16.0 自带的 undici 5.21.0 在内部 IPC fetch（router worker → render worker）上每页面请求保留约 19KB 对象图，约 2h20m 就撞满内存上限被回收一次；18.20.8 的 undici 5.29.0 已修（隔离实测 18,967 B/请求 → 280 B/请求，页面响应逐字节一致）。升级只换 node 二进制，standalone 产物与 `server.js` 不用改。
3. **内存上限自动回收**：`filscan_main` 以 `--max-memory-restart 1000M` 启动，并带 `NODE_OPTIONS="--max-old-space-size=900"`（**2026-09-23 起已撤掉 `--heapsnapshot-near-heap-limit`**：快照的内存膨胀会先撞上上限，13 次快照全部停在 0 字节，产不出证据；撤开关的同时必须把上限压到「堆硬限 + 堆外开销」之下，否则秒级回收会退化成 V8 十几秒 abort）。堆泄漏修掉后这个上限退化为安全网，正常情况下不再触发。
4. **每分钟探活看门狗**：`/root/check_frontend.sh`（cron `* * * * *`，仓内副本 `ops/check_frontend.sh`，改动两边同步）探 `http://127.0.0.1:3000/`，连续 2 次非 200 即 `pm2 restart filscan_main`，日志 `/root/logs/check_frontend.log`。**钉钉告警要求把本机出口 IP 加进机器人白名单**，否则返回 `errcode 310000`（自愈仍生效，只是收不到消息）。

迁移/换机清单：装 node 18.20.8（nvm）并在该 node 下 `npm i -g pm2@5.3.0` + `pm2 startup systemd -u root --hp /root` + `pm2 save` + 装上探活看门狗 cron，四件缺一件就会退化成"崩了没人管"。

### 常见问题

- **页面 JS/CSS 404**：确认部署包包含 `.next/static`（用 deploy.sh 或手动 cp）
- **cali chunk 404**：线上 Nginx 静态 location 必须反代应用，不能 `root` 本地目录（`cali-online.conf` 已修复）
- **限流返回 503 而不是 429**：检查是否漏配 `limit_req_status 429;`
- **502 Bad Gateway**：响应头现在只会是 `Server: nginx`（本机 nginx；ALB 自产错误页的签名自 2026-10-01 起已失效，见上文「502 归因」的历史判据）。分入口层（`/var/log/nginx/edge-access.log`、`error.log`）和业务层（`/var/log/nginx/access.log`、`filscan-limit.log`）看；本机 Nginx 报的多为应用崩溃循环或端口不对，按上面"快速恢复"
- **图片裂图**：确认 `public/images/` 存在（本地模式），或 `NEXT_PUBLIC_STATIC_URL` 指向的资源可访问
- **改环境变量不生效**：`NEXT_PUBLIC_*` 构建时内联，需重新构建
- **OSS 图片下载 403**：OSS 有防盗链，需带 `Referer: https://filscan.io/`
