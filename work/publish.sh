#!/bin/sh
# 手元の変更を公開する:  sh work/publish.sh "何を直したか"
# GitHubへ送ると、1〜2分で https://karibu-running.github.io/ に反映される。
cd "$(dirname "$0")/.." || exit 1
git add -A
git commit -q -m "${1:-サイトを更新}" || echo "新しい変更はありません"
git push -q origin main && echo "送りました。1〜2分で反映されます。"
