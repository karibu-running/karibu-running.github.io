/* シューズ実測マップ・マトリックス・表 */
(function () {
  const { K, esc, openModal } = window.KApp;
  const S = K.shoes;
  const SHORT = { cf: "CLIFTON 11", h2: "HYPERWARP 2", h1: "HYPERWARP 初代", fr: "FAST-RB", on: "Strike 2", rb: "Rebel", rh: "RED HARE", gn: "GENESIS 2", sc: "SLOWCUSH", ky: "KAYANO 33", mr: "MIRAI 2", pp: "Pegasus Plus 2", gm: "Ghost Max 4", yg: "YOGIRI", af: "Alphafly 4" };
  S.forEach((s) => (s.s = SHORT[s.k] || s.name));
  const byK = Object.fromEntries(S.map((s) => [s.k, s]));
  const css = getComputedStyle(document.documentElement);
  const COL = Object.fromEntries(Object.keys(K.types).map((t) => [t, css.getPropertyValue("--c-" + t).trim()]));
  const th = (s) => `<img class="tn" loading="lazy" src="img/shoes/t_${s.k}.jpg" alt="" width="192" height="108">`;
  const yen = (n) => (n == null ? "—" : "¥" + n.toLocaleString());
  const f1 = (n) => (n == null ? "—" : n.toFixed(1));

  const AX = {
    w: { n: "重さ", u: "g", lo: "軽い", hi: "重い", th: [200, 230], fmt: f1 },
    hard: { n: "かたさ（かかと）", u: "HC", lo: "柔らかい", hi: "かたい", th: [30, 36], fmt: f1 },
    rebH: { n: "反発（かかと）", u: "cm", lo: "弾まない", hi: "弾む", th: [40, 48], fmt: (n) => n },
    rebF: { n: "反発（前足部）", u: "cm", lo: "弾まない", hi: "弾む", th: [40, 48], fmt: (n) => n },
    price: { n: "価格（税込）", u: "円", lo: "安い", hi: "高い", th: [], fmt: (n) => n.toLocaleString() },
  };
  const PRESETS = [
    ["hard", "rebH", "かたさ × 反発", "<b>「柔らかい＝弾む」ではありません。</b>いちばんかたい CLIFTON 11（45.5）は反発38cm、同じくらいかたい SONICBLAST 2（43.5）は48cm。かたさと反発は別の物差しです。"],
    ["w", "rebH", "重さ × 反発", "<b>軽くて弾む靴はレース用に集まります。</b>ただし116gでいちばん軽い METASLEEK は反発31cmでいちばん低い。「脚を鍛える靴」という狙いが数字に出ています。"],
    ["price", "rebH", "価格 × 反発", "<b>高い靴ほど弾む、とは限りません。</b>¥23,980の SuperComp Rebel は、¥44,000の Cloudboom Strike 2 と同じ56cm。"],
    ["w", "hard", "重さ × かたさ", "<b>重い靴＝ふかふか、でもありません。</b>265gの Ghost Max 4 はかたさ41、258gの GEL-SLOWCUSH は29。同じ「厚底のジョグ靴」でも正反対です。"],
    ["price", "w", "価格 × 重さ", "<b>値段の幅は¥3,900〜¥66,000で約17倍。</b>いちばん安いファントムライドがいちばん重く（295g）、軽いレース靴は3万円前後から上。例外は¥19,800で116gの METASLEEK です。"],
  ];

  // ---------------------------------------------------------------- 散布図
  const svg = document.getElementById("map");
  let W = 1000, H = 600, M = { l: 64, r: 26, t: 26, b: 56 }, R = 8, IW = 50, IH = 28, narrow = null;
  function size() { const n = svg.parentNode.clientWidth < 620; if (n === narrow) return false; narrow = n; if (n) { W = 460; H = 620; M = { l: 46, r: 12, t: 16, b: 52 }; R = 6.5; IW = 38; IH = 21; } else { W = 1000; H = 600; M = { l: 64, r: 26, t: 26, b: 56 }; R = 8; IW = 50; IH = 28; } return true; }
  size();
  const selX = document.getElementById("ax-x"), selY = document.getElementById("ax-y");
  const off = new Set();
  let cur = { x: "hard", y: "rebH" };
  Object.entries(AX).forEach(([k, a]) => { selX.add(new Option(a.n, k)); selY.add(new Option(a.n, k)); });

  function nice(min, max) {
    const span = max - min || 1, pad = span * 0.09;
    let lo = min - pad, hi = max + pad;
    const step = Math.pow(10, Math.floor(Math.log10(span / 5)));
    const st = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => span / s <= 7) || step * 10;
    lo = Math.floor(lo / st) * st; hi = Math.ceil(hi / st) * st; if (min >= 0 && lo < 0) lo = 0;
    const ticks = []; for (let v = lo; v <= hi + 1e-9; v += st) ticks.push(+v.toFixed(6));
    return { lo, hi, ticks };
  }

  function draw() {
    const ax = AX[cur.x], ay = AX[cur.y];
    const pts = S.filter((s) => s[cur.x] != null && s[cur.y] != null);
    const miss = S.filter((s) => s[cur.x] == null || s[cur.y] == null);
    const nx = nice(Math.min(...pts.map((s) => s[cur.x])), Math.max(...pts.map((s) => s[cur.x])));
    const ny = nice(Math.min(...pts.map((s) => s[cur.y])), Math.max(...pts.map((s) => s[cur.y])));
    const X = (v) => M.l + ((v - nx.lo) / (nx.hi - nx.lo)) * (W - M.l - M.r);
    const Y = (v) => H - M.b - ((v - ny.lo) / (ny.hi - ny.lo)) * (H - M.t - M.b);
    let o = `<rect x="${M.l}" y="${M.t}" width="${W - M.l - M.r}" height="${H - M.t - M.b}" fill="#f7f9fd" rx="10"/>`;
    // 目安の帯
    if (ax.th.length) o += `<rect x="${X(ax.th[0])}" y="${M.t}" width="${X(ax.th[1]) - X(ax.th[0])}" height="${H - M.t - M.b}" fill="#1c4fb3" opacity=".05"/>`;
    if (ay.th.length) o += `<rect x="${M.l}" y="${Y(ay.th[1])}" width="${W - M.l - M.r}" height="${Y(ay.th[0]) - Y(ay.th[1])}" fill="#1c4fb3" opacity=".05"/>`;
    nx.ticks.forEach((t) => { o += `<line x1="${X(t)}" x2="${X(t)}" y1="${M.t}" y2="${H - M.b}" stroke="#e3e8f3"/><text x="${X(t)}" y="${H - M.b + 20}" text-anchor="middle" font-size="12" fill="#5b6680">${cur.x === "price" ? (t / 10000) + "万" : t}</text>`; });
    ny.ticks.forEach((t) => { o += `<line x1="${M.l}" x2="${W - M.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="#e3e8f3"/><text x="${M.l - 10}" y="${Y(t) + 4}" text-anchor="end" font-size="12" fill="#5b6680">${cur.y === "price" ? (t / 10000) + "万" : t}</text>`; });
    // 軸ラベル
    if (!narrow) o += `<text x="${M.l}" y="${H - 10}" font-size="13" font-weight="700" fill="#1c4fb3">← ${ax.lo}</text><text x="${W - M.r}" y="${H - 10}" text-anchor="end" font-size="13" font-weight="700" fill="#1c4fb3">${ax.hi} →</text>`;
    o += `<text x="${(M.l + W - M.r) / 2}" y="${H - 10}" text-anchor="middle" font-size="13" font-weight="900" fill="#0e1a3c">${ax.n}（${ax.u}）</text>`;
    o += `<text transform="translate(${narrow ? 12 : 16} ${(M.t + H - M.b) / 2}) rotate(-90)" text-anchor="middle" font-size="13" font-weight="900" fill="#0e1a3c">${ay.n}（${ay.u}）</text>`;
    if (!narrow) o += `<text transform="translate(16 ${M.t + 4}) rotate(-90)" text-anchor="end" font-size="13" font-weight="700" fill="#1c4fb3">${ay.hi} →</text><text transform="translate(16 ${H - M.b}) rotate(-90)" text-anchor="start" font-size="13" font-weight="700" fill="#1c4fb3">← ${ay.lo}</text>`;
    // 四隅の言葉
    const cw = (t, x, y, a) => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="${narrow ? 12 : 15}" font-weight="900" fill="#0e1a3c" opacity=".22">${t}</text>`;
    o += cw(`${ax.lo}・${ay.hi}`, M.l + 14, M.t + 26, "start") + cw(`${ax.hi}・${ay.hi}`, W - M.r - 14, M.t + 26, "end") + cw(`${ax.lo}・${ay.lo}`, M.l + 14, H - M.b - 14, "start") + cw(`${ax.hi}・${ay.lo}`, W - M.r - 14, H - M.b - 14, "end");

    // 点とラベル（重ならない位置を探す）
    const rx = IW / 2, ry = IH / 2;
    const boxes = pts.map((s) => ({ x: X(s[cur.x]) - rx - 2, y: Y(s[cur.y]) - ry - 2, w: IW + 4, h: IH + 4 }));
    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const tw = (t) => [...t].reduce((n, c) => n + (c.charCodeAt(0) > 255 ? 12.5 : 7.2), 0);
    const order = pts.slice().sort((a, b) => Y(a[cur.y]) - Y(b[cur.y]));
    const place = {};
    order.forEach((s) => {
      const px = X(s[cur.x]), py = Y(s[cur.y]), w = tw(s.s), h = 16;
      const cand = [[0, ry + 15, "middle"], [0, -(ry + 5), "middle"], [rx + 5, 5, "start"], [-(rx + 5), 5, "end"], [rx + 4, -8, "start"], [-(rx + 4), -8, "end"], [rx + 4, 17, "start"], [-(rx + 4), 17, "end"], [0, ry + 31, "middle"], [0, -(ry + 21), "middle"], [rx + 6, -22, "start"], [-(rx + 6), -22, "end"], [rx + 6, 31, "start"], [-(rx + 6), 31, "end"], [0, ry + 47, "middle"], [0, -(ry + 37), "middle"], [rx + 30, 5, "start"], [-(rx + 30), 5, "end"]];
      let best = null;
      for (const [dx, dy, a] of cand) {
        const bx = a === "start" ? px + dx : a === "end" ? px + dx - w : px - w / 2;
        const b = { x: bx, y: py + dy - 12, w, h };
        if (b.x < M.l + 2 || b.x + b.w > W - M.r - 2 || b.y < M.t + 2 || b.y + b.h > H - M.b - 2) continue;
        if (boxes.some((q) => hit(b, q))) continue;
        best = { dx, dy, a, b }; break;
      }
      if (!best) { const [dx, dy, a] = cand[0]; best = { dx, dy, a, b: { x: px + dx, y: py + dy - 12, w, h } }; }
      boxes.push(best.b); place[s.k] = best;
    });
    pts.forEach((s) => {
      const p = place[s.k], px = X(s[cur.x]), py = Y(s[cur.y]);
      o += `<g class="pt${off.has(s.type) ? " dim" : ""}" data-k="${s.k}" tabindex="0" role="button" aria-label="${esc(s.name)} ${ax.n}${s[cur.x]} ${ay.n}${s[cur.y]}"><image href="img/shoes/t_${s.k}.jpg" x="${px - rx}" y="${py - ry}" width="${IW}" height="${IH}" preserveAspectRatio="xMidYMid slice"/><rect x="${px - rx}" y="${py - ry}" width="${IW}" height="${IH}" rx="4" fill="none" stroke="${COL[s.type]}" stroke-width="2.5"/><text x="${px + p.dx}" y="${py + p.dy}" text-anchor="${p.a}">${esc(s.s)}</text></g>`;
    });
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = o;
    document.getElementById("miss").textContent = miss.length ? "この組み合わせで測っていない靴: " + miss.map((s) => s.name).join("、") : "";
    const pre = PRESETS.find((p) => p[0] === cur.x && p[1] === cur.y);
    const ins = document.getElementById("insight");
    ins.style.display = pre ? "" : "none";
    if (pre) { ins.innerHTML = pre[3]; window.KApp.phrase(ins); }
    window.KApp.phrase(document.getElementById("miss"));
    document.querySelectorAll("#presets .tab").forEach((b, i) => b.classList.toggle("on", PRESETS[i] === pre));
    selX.value = cur.x; selY.value = cur.y;
  }
  document.getElementById("presets").innerHTML = PRESETS.map((p, i) => `<button class="tab" data-i="${i}">${p[2]}</button>`).join("");
  document.getElementById("presets").onclick = (e) => { const b = e.target.closest(".tab"); if (b) { const p = PRESETS[b.dataset.i]; cur = { x: p[0], y: p[1] }; draw(); } };
  selX.onchange = selY.onchange = () => { cur = { x: selX.value, y: selY.value }; draw(); };
  const lg = document.getElementById("legend");
  lg.innerHTML = Object.entries(K.types).map(([k, n]) => `<button class="lg" data-t="${k}" aria-pressed="true"><i style="background:${COL[k]}"></i>${n}</button>`).join("");
  lg.onclick = (e) => { const b = e.target.closest(".lg"); if (!b) return; const t = b.dataset.t; off.has(t) ? off.delete(t) : off.add(t); b.classList.toggle("off", off.has(t)); b.setAttribute("aria-pressed", !off.has(t)); draw(); };
  svg.addEventListener("click", (e) => { const g = e.target.closest(".pt"); if (g) showShoe(g.dataset.k); });
  svg.addEventListener("keydown", (e) => { const g = e.target.closest(".pt"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showShoe(g.dataset.k); } });
  draw();
  window.addEventListener("resize", () => { if (size()) draw(); });

  // ---------------------------------------------------------------- 3×3 マトリックス
  const band = (v, [a, b]) => (v < a ? 0 : v > b ? 2 : 1);
  const cells = Array.from({ length: 9 }, () => []);
  const out = [];
  S.forEach((s) => {
    const r = s.rebH != null ? s.rebH : s.rebF;
    if (r == null) { out.push(s); return; }
    cells[(2 - band(r, [40, 48])) * 3 + band(s.w, [200, 230])].push(s);
  });
  const rows = [["よく弾む", "48cmより上"], ["ふつう", "40〜48cm"], ["あまり弾まない", "40cmより下"]];
  const cols = [["軽い", "200gより下"], ["ふつう", "200〜230g"], ["重め", "230gより上"]];
  let mx = `<div class="hy"></div>` + cols.map((c) => `<div class="hx">${c[0]}<small>${c[1]}</small></div>`).join("");
  rows.forEach((r, ri) => {
    mx += `<div class="hy">${r[0]}<small>${r[1]}</small></div>`;
    for (let ci = 0; ci < 3; ci++) mx += `<div class="cell${ri === 0 && ci === 0 ? " hot" : ""}">` + cells[ri * 3 + ci].sort((a, b) => a.w - b.w).map((s) => `<button class="pill" data-k="${s.k}" style="background:${COL[s.type]}">${th(s)}${esc(s.s)}${s.rebH == null ? "※" : ""}</button>`).join("") + `</div>`;
  });
  document.getElementById("mx").innerHTML = mx;

  // ---------------------------------------------------------------- シューズリスト(用途)
  const UC = { "◎": "u-a", "○": "u-b", "△": "u-c", "✕": "u-x", "–": "u-n" };
  const ranked = S.slice().sort((a, b) => (a.rank || 99) - (b.rank || 99));
  document.getElementById("use").innerHTML =
    `<thead><tr><th>シューズ</th><th style="text-align:center">ジョグ</th><th style="text-align:center">ポイント練習</th><th style="text-align:center">レース</th><th style="text-align:left">こんな人に</th></tr></thead><tbody>` +
    ranked.map((s) => `<tr><td data-k="${s.k}"><span class="nm">${th(s)}<span>${esc(s.name)}<small>${s.brand}・${K.types[s.type]}</small></span></span></td>` + [...s.use].map((u) => `<td class="c ${UC[u]}">${u}</td>`).join("") + `<td style="text-align:left;white-space:normal;min-width:220px">${esc(s.who)}</td></tr>`).join("") + `</tbody>`;

  // ---------------------------------------------------------------- 全データ表（並べ替え）
  const COLS = [["rank", "順位", (v) => (v ? v + "位" : "—"), 1], ["price", "価格", yen, 1], ["w", "重さ g", f1, 1], ["hard", "かたさ HC", f1, 1], ["rebH", "反発 かかと cm", (v) => v ?? "—", -1], ["rebF", "反発 前足部 cm", (v) => v ?? "—", -1], ["mid", "くつ底の幅 cm", f1, -1]];
  const tb = document.getElementById("tbl");
  let sort = { k: "rank", d: 1 };
  const ext = {};
  COLS.forEach(([k]) => { const v = S.map((s) => s[k]).filter((x) => x != null); ext[k] = [Math.min(...v), Math.max(...v)]; });
  function table() {
    const list = S.slice().sort((a, b) => { const x = a[sort.k], y = b[sort.k]; if (x == null) return 1; if (y == null) return -1; return (x - y) * sort.d; });
    tb.innerHTML = `<thead><tr><th>シューズ</th>` + COLS.map(([k, n]) => `<th data-k="${k}" class="${sort.k === k ? "s" + (sort.d < 0 ? " d" : "") : ""}" aria-sort="${sort.k === k ? (sort.d > 0 ? "ascending" : "descending") : "none"}">${n}</th>`).join("") + `</tr></thead><tbody>` +
      list.map((s) => `<tr><td data-k="${s.k}"><span class="nm">${th(s)}<span>${esc(s.name)}<small>${s.brand}${s.note && /cmで測定/.test(s.note) ? "・" + s.note : ""}</small></span></span></td>` + COLS.map(([k, , f]) => {
        const v = s[k];
        if (k === "rank") return `<td class="n">${f(v)}</td>`;
        if (v == null) return `<td class="n u-n">—</td>`;
        const [lo, hi] = ext[k], pct = 12 + ((v - lo) / (hi - lo || 1)) * 88;
        const top = (k === "w" && v === lo) || (k === "price" && v === lo) || ((k === "rebH" || k === "rebF") && v === hi);
        return `<td class="n${top ? " best" : ""}">${f(v)}<span class="bar"><i style="width:${pct}%"></i></span></td>`;
      }).join("") + `</tr>`).join("") + `</tbody>`;
  }
  tb.addEventListener("click", (e) => {
    const th = e.target.closest("th[data-k]");
    if (th) { const k = th.dataset.k, def = COLS.find((c) => c[0] === k)[3]; sort = sort.k === k ? { k, d: -sort.d } : { k, d: def }; table(); }
  });
  table();

  // ---------------------------------------------------------------- 目的から選ぶ
  const GUIDE = [
    ["走り始め・ゆるジョグ中心", "重めでOK／反発ふつう／ふつう〜柔らかめ／幅広め", ["nb", "gt", "pr"]],
    ["体重が軽めでケガが心配", "柔らかめ", ["pp", "mr"]],
    ["ぶれが気になる", "重めでOK／反発低め〜ふつう／かため／幅広い", ["ky", "gm", "cf"]],
    ["ペースを上げる練習", "軽め／反発高い／かため〜ふつう", ["sb", "rb"]],
    ["レース（サブ4〜サブ3）", "軽い／反発高い／柔らかめ〜ふつう／細め", ["yg", "h2", "on"]],
    ["記録狙い（サブ3より速く・5km/10km）", "軽い／反発いちばん高い", ["af"]],
    ["脚を鍛えたい", "いちばん軽い／反発低い", ["ms"]],
  ];
  document.getElementById("guide").innerHTML = GUIDE.map(([t, d, ks]) => `<div><b>${t}</b><p>${d}</p><p style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">${ks.map((k) => `<button class="pill" data-k="${k}" style="background:${COL[byK[k].type]}">${th(byK[k])}${esc(byK[k].s)}</button>`).join("")}</p></div>`).join("");

  // ---------------------------------------------------------------- カード
  document.getElementById("cards").innerHTML = ranked.map((s) =>
    `<button class="sh" data-k="${s.k}"><span class="im"><img loading="lazy" src="img/shoes/c_${s.k}.jpg" alt="${esc(s.name)}の横からの写真" width="800" height="450">${s.rank ? `<span class="rk${s.rank <= 3 ? " top" : ""}">${s.rank}位</span>` : ""}<span class="ty" style="background:${COL[s.type]}">${K.types[s.type]}</span></span>
      <span class="bd"><span class="br">${s.brand}</span><h3>${esc(s.name)}</h3><span class="sp"><span><b>${f1(s.w)}</b>g</span><span><b>${f1(s.hard)}</b>かたさ</span><span><b>${s.rebH ?? "—"}</b>反発cm</span><span><b>${s.price ? "¥" + s.price.toLocaleString() : "—"}</b>価格</span></span></span></button>`).join("");

  // ---------------------------------------------------------------- 詳細
  function showShoe(k) {
    const s = byK[k]; if (!s) return;
    const spec = (v, u, l) => `<div><b>${v}${v === "—" ? "" : `<small>${u}</small>`}</b>${l}</div>`;
    const u = [...s.use];
    openModal(`<div class="sd"><div class="im"><img src="img/shoes/c_${s.k}.jpg" alt="${esc(s.name)}"></div>
      <div class="info"><span class="chip" style="background:${COL[s.type]};color:#fff">${K.types[s.type]}</span>${s.rank ? ` <span class="chip">後悔しにくい順 ${s.rank}位／${S.length}足</span>` : ""}
        <div class="br" style="margin-top:10px;font-size:12px;font-weight:700;color:#5b6680;letter-spacing:.08em">${s.brand}</div><h3>${esc(s.name)}</h3>
        <blockquote>「${esc(s.one)}」</blockquote><p style="margin:0;font-size:14px">${esc(s.who)}</p></div></div>
      <div class="specs">${spec(s.price ? s.price.toLocaleString() : "—", "円", "価格（税込）")}${spec(f1(s.w), "g", "重さ（片足）")}${spec(f1(s.hard), "HC", "かたさ（かかと）")}${spec(s.rebH ?? "—", "cm", "反発 かかと")}${spec(s.rebF ?? "—", "cm", "反発 前足部")}${spec(f1(s.mid), "cm", "くつ底の幅（土踏まず）")}</div>
      <div class="uses"><span>ジョグ <b class="${UC[u[0]]}">${u[0]}</b></span><span>ポイント練習 <b class="${UC[u[1]]}">${u[1]}</b></span><span>レース <b class="${UC[u[2]]}">${u[2]}</b></span><span>プレート: ${esc(s.plate)}</span></div>
      <div class="mb">${s.note ? `<p class="note" style="margin:0 0 14px">※ ${esc(s.note)}</p>` : ""}<button class="btn yt" data-v="${s.v}" data-t="${esc(s.name)} のレビュー動画">▶ この靴のレビュー動画を見る</button></div>`);
    history.replaceState(null, "", "#" + k);
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b && !b.closest("#map") && !b.closest("thead")) showShoe(b.dataset.k); });
  if (location.hash && byK[location.hash.slice(1)]) showShoe(location.hash.slice(1));
})();
