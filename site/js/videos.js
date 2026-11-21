(function () {
  const { K, L, vcard, scard, phraseAll } = window.KApp;
  const qs = new URLSearchParams(location.search);
  let cat = "all", q = "";
  let goal = K.goals.some((g) => g[0] === qs.get("goal")) ? qs.get("goal") : "all";
  const catsEl = document.getElementById("cats"), goalsEl = document.getElementById("goals");
  const inGoal = (v, g) => g === "all" || (v.g || []).includes(g), inCat = (v, c) => c === "all" || v.c.includes(c);
  function render() {
    // それぞれの本数は、もう片方の絞り込みをかけた後の数
    const gs = [["all", "すべて"]].concat(K.goals.map((g) => [g[0], g[1]]));
    goalsEl.innerHTML = gs.map(([k, t]) => `<button class="tab np${k === goal ? " on" : ""}" aria-pressed="${k === goal}" data-g="${k}">${t}<small>${K.videos.filter((v) => inGoal(v, k) && inCat(v, cat)).length}</small></button>`).join("");
    const cs = [["all", "すべて"]].concat(K.cats.filter(([k]) => k !== "other"));
    catsEl.innerHTML = cs.map(([k, t]) => `<button class="tab np${k === cat ? " on" : ""}" aria-pressed="${k === cat}" data-c="${k}">${t}<small>${K.videos.filter((v) => inGoal(v, goal) && inCat(v, k)).length}</small></button>`).join("");
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = K.videos.filter((v) => inGoal(v, goal) && inCat(v, cat) && words.every((w) => v.t.toLowerCase().includes(w)));
    const gname = goal === "all" ? "" : K.goals.find((g) => g[0] === goal)[1] + "向け ";
    document.getElementById("count").textContent = list.length ? `${gname}${list.length}本（新しい順）` : "当てはまる動画がありません。言葉を短くするか、絞り込みを「すべて」にしてみてください。";
    window.KApp.phrase(document.getElementById("count"));
    const el = document.getElementById("list");
    el.innerHTML = list.map((v) => vcard(v)).join("");
    phraseAll(el);
  }
  goalsEl.onclick = (e) => { const b = e.target.closest("[data-g]"); if (b) { goal = b.dataset.g; history.replaceState(null, "", goal === "all" ? location.pathname : "?goal=" + goal); render(); } };
  catsEl.onclick = (e) => { const b = e.target.closest("[data-c]"); if (b) { cat = b.dataset.c; render(); } };
  document.getElementById("q").oninput = (e) => { q = e.target.value; render(); };
  render();
})();
