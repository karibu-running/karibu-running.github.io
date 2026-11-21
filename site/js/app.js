/* 共通: ヘッダー・フッター・動画カード・モーダル */
(function () {
  const K = window.KARIBU;
  const L = {
    yt: "https://www.youtube.com/@カリブー.ランニングシューチューバー",
    sub: "https://www.youtube.com/channel/UCQZxCuvYUSKjX0tQHaizz6Q?sub_confirmation=1",
    en: "https://www.youtube.com/@KARIBURunning",
    ig: "https://www.instagram.com/karibu.running.shoe.youtuber/",
    tk: "https://www.tiktok.com/@karibu.running.shoe",
    mail: "running.analyst.researcher@gmail.com",
  };
  const IC = {
    yt: '<svg viewBox="0 0 24 24"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2zM9.7 15.3V8.7l5.8 3.3-5.8 3.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3"/></svg>',
    tk: '<svg viewBox="0 0 24 24"><path d="M16.600 2h-3.200v13.600a2.700 2.700 0 1 1-2.700-2.700c.3 0 .5 0 .8.100V9.700a6 6 0 1 0 5.100 5.900V8.700a7.500 7.500 0 0 0 4.400 1.400V6.900A4.400 4.400 0 0 1 16.600 2z"/></svg>',
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const catName = Object.fromEntries(K.cats);
  const page = document.body.dataset.page;

  // ---- header / footer
  const nav = [["index.html", "ホーム", "home"], ["shoes.html", "シューズ実測マップ", "shoes"], ["videos.html", "動画一覧", "videos"], ["about.html", "プロフィール", "about"]];
  document.getElementById("hd").innerHTML =
    `<div class="wrap"><a class="brand" href="index.html"><img src="img/icon.png" alt="" width="40" height="40"><span>カリブー<small>ランニングシューチューバー</small></span></a>
     <button class="menu" aria-label="メニューを開く" aria-expanded="false">☰</button>
     <nav class="nav">${nav.map(([h, t, k]) => `<a href="${h}"${k === page ? ' class="on" aria-current="page"' : ""}>${t}</a>`).join("")}
     <a class="sub" href="${L.sub}" target="_blank" rel="noopener">チャンネル登録</a></nav></div>`;
  const mb = document.querySelector(".menu"), nv = document.querySelector(".nav");
  mb.onclick = () => mb.setAttribute("aria-expanded", nv.classList.toggle("open"));

  const snsHtml = () =>
    `<div class="sns">
      <a class="sn yt" href="${L.yt}" target="_blank" rel="noopener"><span class="ic">${IC.yt}</span><span><b>YouTube</b><small>登録者 ${fmtSubs(K.subs)}・動画${K.videos.length}本</small></span></a>
      <a class="sn ig" href="${L.ig}" target="_blank" rel="noopener"><span class="ic">${IC.ig}</span><span><b>Instagram</b><small>@karibu.running.shoe.youtuber</small></span></a>
      <a class="sn tk" href="${L.tk}" target="_blank" rel="noopener"><span class="ic">${IC.tk}</span><span><b>TikTok</b><small>@karibu.running.shoe</small></span></a>
    </div>
    <p class="ennote">海外のランナー向けに、<a href="${L.en}" target="_blank" rel="noopener">英語のYouTubeチャンネル</a>もやっています。</p>`;
  function fmtSubs(n) { return n >= 10000 ? String(Math.floor(n / 100) / 100) + "万人" : n.toLocaleString() + "人"; }

  const ft = document.getElementById("ft");
  if (ft) ft.innerHTML =
    `<section class="cta"><div class="wrap"><h2>今日も、ナイスラン！</h2><p>毎日19:00に新しい動画を投稿しています。</p>
      <div class="btns"><a class="btn yt" href="${L.sub}" target="_blank" rel="noopener">${IC.yt.replace("<svg", '<svg width="20" height="20" fill="#fff"')}YouTubeでチャンネル登録</a><a class="btn gh" href="shoes.html">シューズ実測マップを見る</a></div></div></section>
     <footer class="ft"><div class="wrap"><div class="cols">
      <div><a class="brand" href="index.html"><img src="img/icon.png" alt="" width="40" height="40"><span>カリブー<small style="color:#9db8f0">ランニングシューチューバー</small></span></a>
        <p style="max-width:30em;margin-top:14px">ランニングやマラソンに役立つ情報を、研究データとシューズの実測でわかりやすく発信しています。皆さんが少しでも走ることを好きになって、長く続けてくれますように。</p></div>
      <ul><li><a href="index.html">ホーム</a></li><li><a href="shoes.html">シューズ実測マップ</a></li><li><a href="videos.html">動画一覧</a></li><li><a href="about.html">プロフィール・お問い合わせ</a></li></ul>
      <ul><li><a href="${L.yt}" target="_blank" rel="noopener">YouTube</a></li><li><a href="${L.ig}" target="_blank" rel="noopener">Instagram</a></li><li><a href="${L.tk}" target="_blank" rel="noopener">TikTok</a></li></ul>
     </div><p class="cp">※ 掲載している数値は、カリブーが実物を同じ条件ではかったものです。内容は公開情報と実測にもとづく個人の見解で、特定メーカーの内部情報・非公開情報は扱いません。<br>© ${new Date().getFullYear()} カリブー / ランニングシューチューバー　データ更新日 ${K.updated}</p></div></footer>`;

  // ---- 動画カード
  const thumb = (id, q) => `https://i.ytimg.com/vi/${id}/${q || "mqdefault"}.jpg`;
  function vcard(v, opt) {
    const tags = goalChip(v) + (v.c || []).filter((c) => c !== "other").slice(0, 2).map((c) => `<span class="chip">${catName[c]}</span>`).join("");
    return `<button class="vc" data-v="${v.id}" data-t="${esc(v.t)}"><span class="th"><img loading="lazy" src="${thumb(v.id)}" srcset="${thumb(v.id)} 320w, ${thumb(v.id, "hq720")} 1280w" sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 300px" onerror="this.onerror=null;this.removeAttribute('srcset')" alt="" width="320" height="180"></span><span class="tt">${esc(v.t)}</span>${opt && opt.noTags ? "" : `<span class="tg">${tags}</span>`}</button>`;
  }
  // 目標タイムのチップ（幅があるときは「サブ3〜サブ4」のようにまとめる）
  const goalName = Object.fromEntries(K.goals.map((g) => [g[0], g[1]]));
  function goalChip(v) {
    const g = v.g || [];
    if (!g.length) return "";
    const short = (k) => (k === "finish" ? "完走" : goalName[k]);
    const t = g.length === K.goals.length ? "全レベル" : g.length === 1 ? short(g[0]) : g.length === 2 ? short(g[0]) + "・" + short(g[1]) : short(g[0]) + "〜" + short(g[g.length - 1]);
    return `<span class="chip goal">${t}</span>`;
  }
  // 日本語を文節の切れ目だけで折り返す（言葉の途中で改行しない）
  const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter("ja", { granularity: "word" }) : null;
  const isHira = (s) => /^[\u3041-\u309f]+$/.test(s), isClose = (s) => /^[、。，．・：；！？!?）」』】〕〉》\)\]％%〜ー…\s]+$/.test(s), isOpen = (s) => /[（「『【〔〈《\(\[]$/.test(s);
  const LEAD = new Set(["この", "その", "あの", "どの", "今の", "同じ", "次の", "各", "約", "全"]);
  function chunks(text) {
    if (!seg) return [text];
    const out = [];
    for (const { segment: w } of seg.segment(text)) {
      const prev = out[out.length - 1];
      const glue = prev !== undefined && !/[、。！？!?｜\s]$/.test(prev) && (LEAD.has(prev) || isHira(w) || isClose(w) || isOpen(prev) || /[0-9０-９.,]$/.test(prev) || /^[0-9０-９]/.test(w) && /[約第全]$/.test(prev) || /[A-Za-z\-\/×@._]$/.test(prev) && /^[A-Za-z0-9\-\/×@._]/.test(w));
      if (glue || (prev !== undefined && isClose(w))) out[out.length - 1] += w; else out.push(w);
    }
    // 途中で切りたくない言葉は、中の切れ目を消す
    let pos = 0; const cut = new Set(); out.forEach((c) => { pos += c.length; cut.add(pos); });
    KEEP.forEach((k) => { for (let i = text.indexOf(k); i >= 0; i = text.indexOf(k, i + 1)) for (let j = i + 1; j < i + k.length; j++) cut.delete(j); });
    const res = []; let st = 0; [...cut].sort((a, b) => a - b).forEach((p) => { res.push(text.slice(st, p)); st = p; });
    if (st < text.length) res.push(text.slice(st));
    return res;
  }
  const KEEP = K.shoes.map((x) => x.name).concat(["RED HARE 9 ULTRA", "S/LAB GENESIS 2", "FAST-RB NITRO ELITE 2", "レビュー動画", "非公開情報", "内部情報", "公開情報", "個人の見解", "実測レビュー", "同じ条件", "このページ", "その靴", "この20足", "20足", "19足", "ランニングシューズ", "ランニングシューチューバー", "チャンネル登録", "研究開発", "研究データ", "目標タイム", "初マラソン", "フルマラソン", "ハーフマラソン", "ポイント練習", "スピード練習", "シューズ実測マップ", "実測マップ", "練習法", "ゆるジョグ", "くつ底", "土踏まず", "前足部", "お問い合わせ", "お仕事", "お願い", "わかりやすく", "いちばん", "それぞれ", "まとめ画像", "英語チャンネル", "元スポーツメーカー", "スポーツメーカー", "買って後悔しにくい順", "正直レビュー", "徹底比較", "完全版", "早見表", "全手順", "市民ランナー", "厚底シューズ", "カーボンシューズ", "インターバル走", "ペース走", "テンポ走", "設定ペース", "サブ3.5", "サブ4.5", "サブ5.5", "1足", "2足目", "3足目"]);
  function phrase(root) {
    if (!seg || !root) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach((n) => {
      if (!n.nodeValue.trim() || n.parentNode.closest("svg,script,style,select,.np")) return;
      const cs = chunks(n.nodeValue); if (cs.length < 2) return;
      const f = document.createDocumentFragment();
      cs.forEach((c, i) => { if (i) f.appendChild(document.createElement("wbr")); f.appendChild(document.createTextNode(c)); });
      n.parentNode.replaceChild(f, n);
    });
    root.classList.add("jp");
  }
  const PH = "h1,h2,h3,p,li,blockquote,.tt,.kv b,.sn b,.sn small,.specs div,.uses span,.insight,.btn,.tab,.gb b,.gb small,.hx,.hy,.sc span,td,.count";
  function phraseAll(scope) { (scope || document).querySelectorAll(PH).forEach((el) => { if (!el.closest(".jp")) phrase(el); }); }
  function scard(v) {
    return `<a class="sc" href="https://www.youtube.com/shorts/${v.id}" target="_blank" rel="noopener"><img loading="lazy" src="img/shorts/${v.id}.jpg" onerror="this.onerror=null;this.src='${thumb(v.id, "hqdefault")}'" alt="" width="360" height="640"><span>${esc(v.t)}</span></a>`;
  }

  // ---- モーダル
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `<div class="mbox" role="dialog" aria-modal="true"><button class="x" aria-label="閉じる">✕</button><div class="mc"></div></div>`;
  document.body.appendChild(modal);
  const mc = modal.querySelector(".mc");
  let lastFocus = null;
  function openModal(html) { lastFocus = document.activeElement; mc.innerHTML = html; phraseAll(mc); modal.classList.add("open"); document.body.style.overflow = "hidden"; modal.querySelector(".x").focus(); }
  function closeModal() { modal.classList.remove("open"); mc.innerHTML = ""; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".x")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  function playVideo(id, title) {
    openModal(`<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(title)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
      <div class="mb"><h3>${esc(title)}</h3><a class="btn yt" href="https://youtu.be/${id}" target="_blank" rel="noopener">YouTubeで見る</a></div>`);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (b) { e.preventDefault(); playVideo(b.dataset.v, b.dataset.t || ""); }
  });

  window.KApp = { K, L, IC, esc, vcard, scard, thumb, snsHtml, fmtSubs, openModal, closeModal, catName, goalName, phrase, phraseAll };
  // ページごとのスクリプトが描き終わってから、全体の改行を整える
  window.addEventListener("DOMContentLoaded", () => phraseAll());
  if (document.readyState !== "loading") setTimeout(() => phraseAll(), 0);
})();
