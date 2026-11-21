# トップの背景(site/img/hero_bg.jpg)を作る。サムネで使っている写真8枚(work/hero_src)＋シューズ写真20枚を、8列で小さく並べる。
# 写真や靴を変えたら python3 work/hero_bg.py
import pathlib
from PIL import Image, ImageOps
here = pathlib.Path(__file__).resolve().parent
root = here.parent / "site/img"
TW, TH, G, C, R = 250, 141, 4, 8, 4
# 自分の写真: (ファイル, 列, 段, たてのマス数, 切り出しの中心)
ME = [("p6", 4, 0, 2, (0.5, 0.35)), ("p3", 1, 1, 2, (0.5, 0.5)), ("p9", 6, 2, 2, (0.5, 0.1)), ("p4", 3, 2, 2, (0.5, 0.62)),
      ("p2", 2, 0, 1, (0.5, 0.38)), ("p5", 6, 0, 1, (0.62, 0.38)), ("p8", 7, 1, 1, (0.7, 0.35)), ("p7", 0, 3, 1, (0.55, 0.32))]
shoes = "nb af ky on gt rb cf h2 sb pp yg gm mr ms sc h1 rh pr fr gn".split()
assert len(set(shoes)) == len(list((root / "shoes").glob("c_*.jpg"))), "並び順に無い靴がある"
used = {(c, r + i) for _, c, r, h, _ in ME for i in range(h)}
cells = [(c, r) for r in range(R) for c in range(C) if (c, r) not in used]
assert len(cells) == len(shoes), (len(cells), len(shoes))
B = Image.new("RGB", (C * TW, R * TH), (14, 26, 60))
for (c, r), k in zip(cells, shoes):
    B.paste(ImageOps.fit(Image.open(root / f"shoes/c_{k}.jpg").convert("RGB"), (TW - G, TH - G)), (c * TW + G // 2, r * TH + G // 2))
for f, c, r, h, ctr in ME:
    im = ImageOps.exif_transpose(Image.open(here / f"hero_src/{f}.jpg")).convert("RGB")
    B.paste(ImageOps.fit(im, (TW - G, TH * h - G), centering=ctr), (c * TW + G // 2, r * TH + G // 2))
# 同じ並びがすぐ下にくり返されないよう、下半分は横に3列ずらして重ねる
W = Image.new("RGB", (C * TW, 2 * R * TH)); W.paste(B, (0, 0))
s = 3 * TW; W.paste(B.crop((s, 0, C * TW, R * TH)), (0, R * TH)); W.paste(B.crop((0, 0, s, R * TH)), (C * TW - s, R * TH))
W.save(root / "hero_bg.jpg", quality=72, optimize=True, progressive=True)
print(W.size, (root / "hero_bg.jpg").stat().st_size // 1024, "KB")
