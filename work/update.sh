#!/bin/sh
# 動画一覧を取り直して、サイトのデータを作り直す
cd "$(dirname "$0")" || exit 1
PY=/Library/Developer/CommandLineTools/usr/bin/python3
$PY fetch.py 2>/dev/null && $PY build.py
