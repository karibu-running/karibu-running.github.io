# 共有用の画像(site/img/ogp.png 1200x630)を作る。キャッチコピーを変えたらここも直して python3 ogp.py
import base64, pathlib, subprocess, tempfile
root = pathlib.Path(__file__).resolve().parent.parent / "site"
icon = base64.b64encode((root / "img/icon.png").read_bytes()).decode()
html = f"""<html><head><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;900&display=swap" rel="stylesheet">
<style>body{{margin:0;width:1200px;height:630px;background:linear-gradient(100deg,#0e1a3c 0%,#14285e 55%,#1c4fb3 100%);color:#fff;font-family:'Noto Sans JP','Hiragino Sans',sans-serif;display:flex;align-items:center}}
.t{{padding-left:72px;flex:1}}h1{{font-size:56px;font-weight:900;line-height:1.32;margin:0}}.n{{font-size:42px;font-weight:900;color:#ffd75a;margin-top:14px}}
p{{font-size:27px;margin:20px 0 0;color:#dfe8ff;line-height:1.6}}small{{display:block;font-size:24px;color:#c9d6f5;margin-top:24px}}
img{{width:360px;height:360px;border-radius:50%;margin-right:64px;background:#fff}}</style></head><body>
<div class="t"><h1>走ることを、<br>もっと好きに。<br>もっと長く続けて欲しい。</h1><div class="n">今日もナイスラン！</div><p>ランニング・マラソンに役立つ情報と<br>シューズの実測レビュー</p><small>カリブー / ランニングシューチューバー</small></div>
<img src="data:image/png;base64,{icon}"></body></html>"""
tmp = pathlib.Path(tempfile.mkdtemp()) / "ogp.html"; tmp.write_text(html, encoding="utf-8")
subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "--headless=new", "--hide-scrollbars", "--window-size=1200,630",
                "--virtual-time-budget=8000", f"--screenshot={root / 'img/ogp.png'}", tmp.as_uri()], check=True, capture_output=True)
