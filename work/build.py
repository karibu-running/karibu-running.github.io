# -*- coding: utf-8 -*-
"""videos.json(fetch.pyの出力)と下の実測データから site/data/data.js を作る。
使い方:  python3 fetch.py && python3 build.py
"""
import json, re, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "..", "site")
d = json.load(open(os.path.join(HERE, "videos.json")))

# ---------------------------------------------------------------- 動画の分類
CATS = [
    ("shoes", "シューズ", r"レビュー|実測し|実測1|実測2|シューズの|シューズは|シューズ19|シューズ5足|シューズ vs|マラソンシューズ|ノヴァブラスト|メタスピード|メタスリーク|LightSpray|ライトスプレー|GT-2000|厚底の時代|カーボンシューズ|ランキング| vs |アルファフライ|ファントムライド|ゴーストマックス|クリフトン|カヤノ|ニンバス|ペガサス|ヨギリ|リーニン|サロモン|SuperComp|プーマ|SLOWCUSH"),
    ("pace", "ペース別・完全版", r"1km[0-9０-９]分|サブ4|サブ3|サブ5|サブエガ|サブ100|サブ90|上位何%"),
    ("marathon", "マラソン準備・本番", r"マラソン|ハーフ|30km|給水|ペース配分|スタート直後|当日"),
    ("training", "練習法", r"インターバル|LSD|筋トレ|ノルウェー|トレーニング|練習|アップ|腕振り|走り方|着地|呼吸|ゆっくり|10km|朝ラン|心拍|ペース"),
    ("body", "体・ケガ・ケア", r"痛|シンスプリント|足攣り|つる|ケア|回復|超回復|体重|痩せ|脇腹|筋肉痛|長生き|セカンドウインド|ランナーズハイ|心理|疲れ|冬ラン|寒"),
    ("beginner", "初心者向け", r"初心者|初マラソン|完走|走り始め|今更聞けない|入門|楽に"),
]

def classify(title):
    out = [k for k, _, rx in CATS if re.search(rx, title)]
    return out or ["other"]

def clean_short(t):
    return re.sub(r"\s*#\S+", "", t).strip()

# ---------------------------------------------------------------- 目標タイムの分類
# 速い順。タイトルに書いてある目標を拾い、「サブ5〜サブ3」「サブ5・サブ4」のように幅があれば間も埋める。
# タイトルから決まらない動画（シューズのレビューなど）は GOAL_FIX に手で書く。
GOALS = [("sub3", "サブ3", "1km 4:15"), ("sub35", "サブ3.5", "1km 4:58"), ("sub4", "サブ4", "1km 5:41"),
         ("sub45", "サブ4.5", "1km 6:23"), ("sub5", "サブ5", "1km 7:06"), ("finish", "完走・初マラソン", "まず走り切る")]
GK = [g[0] for g in GOALS]
ALL = GK[:]
GOAL_RX = [(r"サブエガ|サブ2\.5|サブ3(?![\.0-9])", "sub3"), (r"サブ3\.5", "sub35"), (r"サブ4(?![\.0-9])", "sub4"), (r"サブ4\.5", "sub45"),
           (r"サブ5(?![\.0-9])", "sub5"), (r"サブ5\.5|完走|初マラソン|初心者", "finish"),
           (r"1km3分台", "sub3"), (r"1km4分台", "sub3"), (r"1km4分台", "sub35"), (r"1km5分台", "sub4"),
           (r"1km6分台", "sub45"), (r"1km6分台", "sub5"), (r"1km7分台", "sub5"), (r"1km7分台", "finish")]
GOAL_FIX = {
    "zy7YqLcRjgw": ["sub35", "sub45"],
    "EYjS97SQ-So": ["sub35", "sub4"],            # サブ4.5とサブ3.5の2本立て
    "wXjUjJboxx4": ["sub3", "sub35"],             # ハーフ サブ90・サブ100
    "TLI6mA3CFi8": ALL, "OORVAJtJpDM": ALL, "NP-UIr6Dpmk": ALL, "zInnDOpkQOk": ALL, "dJsi_O8AmfQ": ALL, "Wsk3Ml_o9ic": ALL,
    "O6dT3PyN-Ek": ["sub3"],                      # 5km 15分
    "h3UhEx_C2Qk": [],                            # 年代の話で、目標タイムは決めていない
    # ---- シューズのレビュー（動画の中で言っている「こんな人に」から）
    "tJYsK9CCyGM": ["sub3"], "t-uQJBujctQ": ["sub3"],
    "hu_ppysejiM": ["sub3", "sub35", "sub4"],
    "8A9dmL-unMY": ["sub3", "sub35"], "kYvsvG8ArmI": ["sub3", "sub35"], "3yhQudnYd1g": ["sub3", "sub35"], "B-uD2x3X6cg": ["sub3", "sub35"],
    "TnZqfSXwVQs": ["sub3", "sub35", "sub4"],
    "WG7GLUovyU8": ["sub35", "sub4"], "j3w6FSZXQD4": ["sub35", "sub4"],
    "A4FGOsBoJCE": ["sub35", "sub4", "sub45", "sub5", "finish"], "R29vVTyqlhg": ["sub35", "sub4", "sub45", "sub5", "finish"],
    "3dORdem2gzI": ["sub4", "sub45", "sub5"],
    "a670HPZJIFg": ["sub4", "sub45", "sub5", "finish"], "GiIjJh8lBww": ["sub4", "sub45", "sub5", "finish"], "gw9K3fSgqMo": ["sub4", "sub45", "sub5", "finish"],
    "0m-wEQHHtwg": ["sub45", "sub5", "finish"], "dfrO0iSY64A": ["sub45", "sub5", "finish"],
    "pHEVxP7_rTQ": ["sub5", "finish"], "lISsmH6LPFE": ["sub5", "finish"], "JraUT3nnGCw": ["sub5", "finish"],
}
def goals(vid, title):
    if vid in GOAL_FIX: return [g for g in GK if g in GOAL_FIX[vid]]
    hit = {g for rx, g in GOAL_RX if re.search(rx, title)}
    if not hit: return []
    idx = [GK.index(g) for g in hit]
    return GK[min(idx):max(idx) + 1]

jp_videos = [{"id": e["id"], "t": e["title"], "c": classify(e["title"]), "g": goals(e["id"], e["title"])} for e in d["jp_videos"]]
jp_shorts = [{"id": e["id"], "t": clean_short(e["title"])} for e in d["jp_shorts"]]
en_videos = [{"id": e["id"], "t": e["title"]} for e in d["en_videos"]]

# ---------------------------------------------------------------- 実測20足
# hard=かかとのかたさ(HC・2層の靴は上の層) / reb=反発(cm) かかと・前足部 / mid=くつ底の幅(土踏まず cm)
# use=[ジョグ, ポイント練習, レース]  記号: ◎○△✕ / "–"=動画で判定していない
# rank=買って後悔しにくい順。2026年19足ランキングに Alphafly 4 を14位で追加した20足の順位(2026-11-21)
S = [
 dict(k="nb", brand="ASICS", name="NOVABLAST 6", jp="ノヴァブラスト 6", price=17600, w=223.0, hard=30.5, rebH=43, rebF=45, mid=None,
      type="jog", plate="なし", rank=1, use="◎○○", one="サブ4までなら、練習も本番もこの1足", who="初心者〜サブ4の、最初の1足に", v="R29vVTyqlhg"),
 dict(k="yg", brand="ASICS", name="YOGIRI SPEED", jp="ヨギリ スピード", price=24200, w=202.5, hard=25.0, rebH=44, rebF=44, mid=None,
      type="race", plate="カーボン", rank=2, use="✕–◎", one="正直、マイナスポイントが見当たらない", who="サブ4〜サブ3.5のレース本番に", v="WG7GLUovyU8"),
 dict(k="pp", brand="NIKE", name="Pegasus Plus 2", jp="ペガサス プラス 2", price=22000, w=226.5, hard=29.0, rebH=42, rebF=43, mid=None,
      type="jog", plate="なし", rank=3, use="◎△–", one="テンポ靴ではなく、上質な万能デイリートレーナー", who="ゆるジョグからマラソンペースまで1足で走りたい人に", v="3dORdem2gzI"),
 dict(k="h2", brand="MIZUNO", name="HYPERWARP ELITE 2", jp="ハイパーワープ エリート 2", price=29700, w=146.0, hard=33.0, rebH=41, rebF=41, mid=6.0,
      type="race", plate="カーボン", rank=4, use="✕○◎", one="迷ったら2代目", who="サブ3〜サブ4くらいまでのレースに", v="hu_ppysejiM"),
 dict(k="mr", brand="ASICS", name="NIMBUS MIRAI 2", jp="ニンバス ミライ 2", price=24200, w=227.0, hard=31.0, rebH=49, rebF=46, mid=None,
      type="jog", plate="なし", rank=5, use="○△–", one="軽くて反発はアシックスでトップ、柔らかさはほどほど", who="ゆるジョグから少しペースを上げる日まで1足で", v="0m-wEQHHtwg"),
 dict(k="rb", brand="New Balance", name="SuperComp Rebel", jp="スーパーコンプ レベル", price=23980, w=191.5, hard=29.5, rebH=56, rebF=51, mid=None,
      type="speed", plate="ナイロン系", rank=6, use="✕◎–", one="スピード練習の武器が欲しいなら", who="サブ3〜サブ3.5のポイント練習に", v="ncYdkCH8VOk"),
 dict(k="sb", brand="ASICS", name="SONICBLAST 2", jp="ソニックブラスト 2", price=22000, w=209.0, hard=43.5, rebH=48, rebF=43, mid=None,
      type="speed", plate="樹脂", rank=7, use="✕◎○", one="硬さは残したまま、弱点だけを消してきた靴", who="サブ3.5より上を狙う人のスピード練習に", v="j3w6FSZXQD4"),
 dict(k="gt", brand="ASICS", name="GT-2000 15", jp="GT-2000 15", price=16500, w=232.0, hard=30.5, rebH=41, rebF=44, mid=7.1,
      type="stable", plate="なし", rank=8, use="◎✕△", one="安くて、柔らかくて、ぶれない", who="初心者・完走目標・着地のぶれが不安な人に", v="GiIjJh8lBww"),
 dict(k="pr", brand="WORKMAN", name="ファントムライド", jp="ファントムライド", price=3900, w=295.0, hard=32.5, rebH=39, rebF=35, mid=None,
      type="jog", plate="樹脂", rank=9, use="◎△–", one="5,000円以下で始めるなら、ちゃんと走れる1足", who="安く走り始めたい人、ゆるジョグ用の2足目に", v="JraUT3nnGCw"),
 dict(k="ky", brand="ASICS", name="GEL-KAYANO 33", jp="ゲルカヤノ 33", price=22000, w=272.5, hard=40.0, rebH=32, rebF=42, mid=7.5,
      type="stable", plate="なし", rank=10, use="◎✕○", one="4Dがなくなっても、安定感は健在", who="1km6分より遅いペースで走る、完走目標の人に", v="lISsmH6LPFE"),
 dict(k="cf", brand="HOKA", name="CLIFTON 11 虎視眈々", jp="クリフトン 11", price=19800, w=234.0, hard=45.5, rebH=38, rebF=39, mid=7.9,
      type="stable", plate="なし", rank=11, use="◎✕✕", one="ゆるジョグならクリフトン11、ペースを上げる日はノヴァブラスト6", who="走り始めたばかりの人、かためで安定した履き心地が好きな人に", v="a670HPZJIFg"),
 dict(k="sc", brand="ASICS", name="GEL-SLOWCUSH", jp="ゲルスロークッシュ", price=26400, w=258.0, hard=29.0, rebH=34, rebF=38, mid=8.8,
      type="jog", plate="なし", rank=12, use="◎△△", one="最上級のクッションは本当。深く沈んで、ゆっくり戻る", who="ゆっくり長く走る日の専用に", v="pHEVxP7_rTQ"),
 dict(k="gm", brand="BROOKS", name="Ghost Max 4", jp="ゴーストマックス 4", price=24200, w=265.0, hard=41.0, rebH=35, rebF=43, mid=8.1,
      type="stable", plate="なし", rank=13, use="◎△–", one="見た目はふかふか、実はかたくて安定感がすごい", who="ゆるジョグを安定して走りたい人、立ち仕事にも", v="dfrO0iSY64A"),
 dict(k="on", brand="On", name="Cloudboom Strike 2", jp="クラウドブーム ストライク 2", price=44000, w=156.5, hard=27.5, rebH=56, rebF=52, mid=None,
      type="race", plate="カーボン", rank=15, use="✕○◎", one="価格据え置きで、全項目で進化", who="サブ3以上を狙う人の勝負靴", v="8A9dmL-unMY", note="26.0cmで測定"),
 dict(k="rh", brand="LI-NING", name="RED HARE 9 ULTRA", jp="レッドヘア 9 ウルトラ", price=None, w=232.0, hard=None, rebH=52, rebF=48, mid=None,
      type="speed", plate="グラスファイバー", rank=16, use="○◎✕", one="足を守りながら、速いペースの走り込みまでこなす", who="テンポよく走り込みたい人の練習靴に", v="B-uD2x3X6cg", note="日本の正規販売なし。かたさは層が薄く測れず"),
 dict(k="h1", brand="MIZUNO", name="HYPERWARP ELITE 初代", jp="ハイパーワープ エリート 初代", price=29700, w=152.0, hard=37.5, rebH=33, rebF=32, mid=6.5,
      type="race", plate="カーボン", rank=17, use="✕○○", one="予算をいちばん大事にする人で、サイズが残っていれば", who="セールの在庫で選ぶ人に", v="hu_ppysejiM", note="25.0cmで測定"),
 dict(k="ms", brand="ASICS", name="METASLEEK", jp="メタスリーク", price=19800, w=116.0, hard=38.0, rebH=31, rebF=36, mid=None,
      type="speed", plate="なし", rank=18, use="✕◎△", one="速くなる脚を、作るための靴", who="サブ4以上を狙う人の、脚を鍛える日の2足目に", v="TnZqfSXwVQs"),
 dict(k="gn", brand="Salomon", name="S/LAB GENESIS 2", jp="S/LAB ジェネシス 2", price=28600, w=247.0, hard=None, rebH=None, rebF=None, mid=None,
      type="trail", plate="なし", rank=19, use="–––", one="地面を読んで、自分で足を置く靴", who="岩や木の根が多い、テクニカルな山を走る人に", v="KdaT2TlEti4", note="トレイル靴のため、かたさ・反発は測らず参考枠"),
 dict(k="fr", brand="PUMA", name="FAST-RB NITRO ELITE 2", jp="FAST-RB ニトロ エリート 2", price=66000, w=220.0, hard=30.5, rebH=None, rebF=54, mid=6.0,
      type="race", plate="カーボン2枚", rank=20, use="✕△✕", one="構造を体験する、2足目・3足目の特別な1足", who="足首が強く、前足部で着地できる人に", v="t-uQJBujctQ", note="国内100足限定。公式レースでは使えない。かかとの反発は測定できず"),
 dict(k="af", brand="NIKE", name="Alphafly 4", jp="アルファフライ 4", price=39600, w=171.5, hard=38.0, rebH=60, rebF=54, mid=6.4,
      type="race", plate="カーボン＋エア", rank=14, use="✕–◎", one="かかとの反発は60cm台。エアの反発がやばい", who="サブ3以上と、5〜10kmで記録を狙う人に", v="tJYsK9CCyGM", note="19足ランキングの動画の後に購入。順位はこのサイトで追加"),
]

TYPES = {"jog": "ジョグ・万能", "stable": "安定・クッション", "speed": "スピード練習", "race": "レース", "trail": "トレイル"}

# 注目の動画(トップページ)
FEATURED = ["dJsi_O8AmfQ", "JraUT3nnGCw", "pHEVxP7_rTQ", "PeY9kxHxW_E", "EwA4XGjSABM", "-20SCMB0eyQ", "zInnDOpkQOk", "nap4aqplGyQ"]
ids = {v["id"] for v in jp_videos}
assert all(f in ids for f in FEATURED), "FEATUREDに無い動画IDがある"
assert all(s["v"] in ids for s in S), [s["k"] for s in S if s["v"] not in ids]

data = dict(
    updated=(datetime.datetime.utcnow()+datetime.timedelta(hours=9)).date().isoformat(),  # 日本時間
    subs=d["jp_meta"].get("channel_follower_count") or 13500,  # 取れなかったときの控え(2026-11-21)
    subsEn=d["en_meta"].get("channel_follower_count") or 293,
    cats=[[k, n] for k, n, _ in CATS] + [["other", "その他"]],
    goals=[list(g) for g in GOALS],
    videos=jp_videos,  # ショートと英語チャンネルの動画はサイトに載せない(2026-11-21)
    featured=FEATURED, shoes=S, types=TYPES,
)
os.makedirs(os.path.join(SITE, "data"), exist_ok=True)
with open(os.path.join(SITE, "data", "data.js"), "w") as f:
    f.write("window.KARIBU=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")

from collections import Counter
c = Counter(k for v in jp_videos for k in v["c"])
print("goals", {g: sum(g in v["g"] for v in jp_videos) for g in GK}, "none", sum(not v["g"] for v in jp_videos))
print("videos", len(jp_videos), "shorts", len(jp_shorts), "en", len(en_videos), dict(c))
for v in jp_videos:
    if v["c"] == ["other"]: print("  other:", v["t"])
