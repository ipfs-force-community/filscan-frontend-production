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
  echo "       ✅ 已生成 ${OUT_DIR}/filscan-${name}.tar.gz（端口 ${port}）"
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
