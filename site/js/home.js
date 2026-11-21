(function () {
  const { K, L, vcard, scard, snsHtml, fmtSubs, esc } = window.KApp;
  document.getElementById("sub").href = L.sub;
  const subs = fmtSubs(K.subs);
  document.getElementById("st-subs").innerHTML = subs.replace(/(万人|人)$/, "<small>$1</small>");
  document.getElementById("st-videos").innerHTML = K.videos.length + "<small>本</small>";
  document.getElementById("st-shoes").innerHTML = K.shoes.length + "<small>足</small>";
  const byId = Object.fromEntries(K.videos.map((v) => [v.id, v]));
  document.getElementById("featured").innerHTML = K.featured.map((id) => vcard(byId[id])).join("");
  const feat = new Set(K.featured);
  document.getElementById("latest").innerHTML = K.videos.filter((v) => !feat.has(v.id)).slice(0, 8).map((v) => vcard(v)).join("");
  document.getElementById("sns").innerHTML = snsHtml();

  // 目標タイムから探す（その目標だけを扱う動画を先に、次に新しい順）
  const gbs = document.getElementById("gbs"), glist = document.getElementById("glist"), gmore = document.getElementById("gmore");
  const count = (k) => K.videos.filter((v) => v.g.includes(k)).length;
  gbs.innerHTML = K.goals.map(([k, n, p]) => `<button class="gb np" role="tab" data-g="${k}"><b>${k === "finish" ? "完走" : n}</b><small>${k === "finish" ? "初マラソン・初心者" : p}</small><i>${count(k)}本</i></button>`).join("");
  function showGoal(k) {
    const g = K.goals.find((x) => x[0] === k);
    gbs.querySelectorAll(".gb").forEach((b) => { b.classList.toggle("on", b.dataset.g === k); b.setAttribute("aria-selected", b.dataset.g === k); });
    const list = K.videos.map((v, i) => [v, i]).filter(([v]) => v.g.includes(k)).sort((a, b) => a[0].g.length - b[0].g.length || a[1] - b[1]).slice(0, 8).map(([v]) => v);
    glist.innerHTML = list.map((v) => vcard(v)).join("");
    gmore.href = "videos.html?goal=" + k; gmore.textContent = `${g[1]}向けの動画をすべて見る（${count(k)}本）→`;
    window.KApp.phraseAll(glist);
  }
  gbs.onclick = (e) => { const b = e.target.closest(".gb"); if (b) showGoal(b.dataset.g); };
  showGoal("sub4");

  // ミニマップ（かたさ × 反発）
  const css = getComputedStyle(document.documentElement);
  const nar = window.innerWidth < 620;  // スマホは横をつめて、写真と文字を大きく見せる
  const W = nar ? 440 : 1000, H = nar ? 400 : 420, M = nar ? { l: 44, r: 8, t: 12, b: 44 } : { l: 50, r: 20, t: 20, b: 44 }, iw = nar ? 34 : 46, ih = nar ? 19 : 26;
  const pts = K.shoes.filter((s) => s.hard != null && s.rebH != null);
  const X = (v) => M.l + ((v - 22) / (48 - 22)) * (W - M.l - M.r), Y = (v) => H - M.b - ((v - 28) / (63 - 28)) * (H - M.t - M.b);
  let o = `<rect x="${M.l}" y="${M.t}" width="${W - M.l - M.r}" height="${H - M.t - M.b}" fill="#f7f9fd" rx="10"/>`;
  [25, 30, 35, 40, 45].forEach((t) => (o += `<line x1="${X(t)}" x2="${X(t)}" y1="${M.t}" y2="${H - M.b}" stroke="#e3e8f3"/><text x="${X(t)}" y="${H - M.b + 18}" text-anchor="middle" font-size="12" fill="#5b6680">${t}</text>`));
  [30, 40, 50, 60].forEach((t) => (o += `<line x1="${M.l}" x2="${W - M.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="#e3e8f3"/><text x="${M.l - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="12" fill="#5b6680">${t}</text>`));
  o += `<text x="${M.l}" y="${H - 6}" font-size="13" font-weight="700" fill="#1c4fb3">← 柔らかい</text><text x="${W - M.r}" y="${H - 6}" text-anchor="end" font-size="13" font-weight="700" fill="#1c4fb3">かたい →</text><text x="${(M.l + W - M.r) / 2}" y="${H - 6}" text-anchor="middle" font-size="13" font-weight="900" fill="#0e1a3c">かたさ（HC）</text>`;
  o += `<text transform="translate(${nar ? 11 : 14} ${H / 2}) rotate(-90)" text-anchor="middle" font-size="13" font-weight="900" fill="#0e1a3c">反発（cm）</text>`;
  const labN = { af: 1, cf: 1, yg: 1, sb: 1, on: 1, sc: 1, mr: 1 };
  const lab = { af: "Alphafly 4", cf: "CLIFTON 11", ms: "METASLEEK", yg: "YOGIRI", sb: "SONICBLAST 2", rb: "Rebel", on: "Strike 2", nb: "NOVABLAST 6", sc: "SLOWCUSH", mr: "MIRAI 2", gm: "Ghost Max 4" };
  pts.forEach((s) => {
    const c = css.getPropertyValue("--c-" + s.type).trim(), x = X(s.hard), y = Y(s.rebH), left = s.k === "cf" || s.k === "sb" || s.k === "on";
    o += `<image href="img/shoes/t_${s.k}.jpg" x="${x - iw / 2}" y="${y - ih / 2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice"/><rect x="${x - iw / 2}" y="${y - ih / 2}" width="${iw}" height="${ih}" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if (lab[s.k] && (!nar || labN[s.k])) o += `<text x="${x + (left ? -1 : 1) * (iw / 2 + 5)}" y="${y + 5}" text-anchor="${left ? "end" : "start"}" font-size="13" font-weight="700" fill="#1a2238" paint-order="stroke" stroke="#fff" stroke-width="4">${esc(lab[s.k])}</text>`;
  });
  const m = document.getElementById("mini");
  m.setAttribute("viewBox", `0 0 ${W} ${H}`); m.style.width = "100%"; m.innerHTML = o;
})();
