(function () {
  const { L, snsHtml } = window.KApp;
  document.getElementById("sns").innerHTML = snsHtml();
  const m = document.getElementById("mail"); m.href = "mailto:" + L.mail; m.textContent = "✉ " + L.mail; m.classList.add("np");
})();
