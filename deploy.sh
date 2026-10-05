#!/usr/bin/env bash
# =============================================================
# Filscan 一键构建脚本：生成主网 + 测试网的 standalone 部署包
# 自动完成：构建 -> 复制静态资源进 standalone -> 打包
# 用法：bash deploy.sh    （或 ./deploy.sh）
# 产物：dist/filscan-main.tar.gz（主网）、dist/filscan-cali.tar.gz（Calibration 测试网）
# =============================================================
set -euo pipefail

OUT_DIR="dist"
mkdir -p "$OUT_DIR"

# 构建并打包单个环境
# 参数：$1=环境名  $2=构建脚本  $3=默认端口
build_env() {
  local name="$1"
  local script="$2"
  local port="$3"

  echo ""
  echo "=============================================="
  echo " [1/3] 构建 ${name}（npm run ${script}）"
  echo "=============================================="
  npm run "$script"

  echo ""
  echo " [2/3] 复制静态资源进 standalone（${name}）..."
  # 先清掉可能残留的旧目录，避免 cp 目录嵌套
  rm -rf .next/standalone/.next/static .next/standalone/public
  cp -r .next/static .next/standalone/.next/static
  cp -r public .next/standalone/public

  echo ""
  echo " [3/3] 打包 ${name}..."
  tar -czf "${OUT_DIR}/filscan-${name}.tar.gz" -C .next/standalone .

  # 校验部署包完整性（防止 server.js 启动时报 .next/BUILD_ID 缺失）
  # 注意：不能写成 `tar -tzf ... | grep -q ...`——grep -q 命中即退出会让 tar 收
  # SIGPIPE(141)，配合脚本顶部的 `set -o pipefail` 会把这条管道判成失败，
  # 于是 `!` 反转成「校验不通过」并 exit 1（实测：构建完 main 就中止，cali 从未产出）。
  # 这里先把清单读进变量，再对变量 grep，producer 不会收到 SIGPIPE。
  local tar_file="${OUT_DIR}/filscan-${name}.tar.gz"
  local listing
  listing="$(tar -tzf "$tar_file")"
  if ! grep -qF ".next/BUILD_ID" <<<"$listing"; then
    echo "       ❌ 部署包缺少 .next/BUILD_ID，构建不完整！"
    exit 1
  fi
  if ! grep -qF "server.js" <<<"$listing"; then
    echo "       ❌ 部署包缺少 server.js，构建不完整！"
    exit 1
  fi
  echo "       ✅ 已生成 ${tar_file}（端口 ${port}），完整性校验通过"
}

echo "=============================================="
echo "  Filscan 一键构建：主网 + 测试网"
echo "=============================================="

build_env "main" "build:main" "9090"
build_env "cali" "build:cali" "9092"

echo ""
echo "=============================================="
echo "  全部完成！部署包位于 ./${OUT_DIR}/"
echo "=============================================="
ls -lh "${OUT_DIR}"
