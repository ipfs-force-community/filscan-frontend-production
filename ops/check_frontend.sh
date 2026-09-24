#!/bin/bash
# filscan 前端探活看门狗（生产实际运行在 frontend01:/root/check_frontend.sh，本文件是仓内副本，改动请两边同步）
# 部署：cp ops/check_frontend.sh /root/check_frontend.sh && chmod 700 /root/check_frontend.sh
# cron：* * * * * /root/check_frontend.sh <钉钉webhook> >> /root/logs/check_frontend.log 2>&1
# 用法：check_frontend.sh <钉钉webhook> [应用端口，默认 3000]
# 逻辑：每分钟探活 http://127.0.0.1:3000/ ；连续 2 次非 200 才动作（避免抖动误判），
#      重启 PM2 应用后复测并钉钉告警。PM2 里找不到应用时走 resurrect。
# 说明：钉钉机器人若配了 IP 白名单，需把本机出口 IP 加入，否则返回 errcode 310000（自愈仍生效）。
export PATH=/root/.nvm/versions/node/v18.20.8/bin:$PATH

HOOK="$1"
PORT="${2:-3000}"
APP=filscan_main
STATE=/root/logs/check_frontend.state
LOG=/root/logs/check_frontend.log

code() { curl -s -o /dev/null -m 8 -w '%{http_code}' "http://127.0.0.1:${PORT}/"; }

C=$(code)
if [ "$C" = "200" ]; then
  [ -f "$STATE" ] && rm -f "$STATE"
  exit 0
fi

N=$(( $(cat "$STATE" 2>/dev/null || echo 0) + 1 ))
echo "$N" > "$STATE"
[ "$N" -lt 2 ] && exit 0

echo "[$(date '+%F %T')] 探活失败 http=$C（连续 ${N} 次），开始自愈" >> "$LOG"
if pm2 describe "$APP" >/dev/null 2>&1; then
  pm2 restart "$APP" >> "$LOG" 2>&1
else
  echo "[$(date '+%F %T')] PM2 中无 $APP，尝试 resurrect dump" >> "$LOG"
  pm2 resurrect >> "$LOG" 2>&1
fi

sleep 8
C2=$(code)
MSG="[$(date '+%F %T')] $(hostname) 前端探活失败(http=$C)，已执行 pm2 restart ${APP}；复测 http=$C2"
echo "$MSG" >> "$LOG"
if [ -n "$HOOK" ]; then
  curl -s -m 10 "$HOOK" -H 'Content-Type: application/json' \
    -d "{\"msgtype\":\"text\",\"text\":{\"content\":\"$MSG\"}}" >> "$LOG" 2>&1
fi
rm -f "$STATE"
exit 0
