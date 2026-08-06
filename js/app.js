(function () {
  "use strict";

  const state = {
    currentQuestion: 0,
    scores: {} // productId -> accumulated points
  };

  const productsById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen")
  };

  const els = {
    startBtn: document.getElementById("start-btn"),
    restartBtn: document.getElementById("restart-btn"),
    progressBar: document.getElementById("progress-bar"),
    progressLabel: document.getElementById("progress-label"),
    questionText: document.getElementById("question-text"),
    optionsList: document.getElementById("options-list"),
    resultList: document.getElementById("result-list"),
    shareBtn: document.getElementById("share-btn"),
    downloadBtn: document.getElementById("download-btn"),
    shareCanvas: document.getElementById("share-canvas"),
    shareCard: document.getElementById("share-card")
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("screen--active", key === name);
    });
  }

  function resetState() {
    state.currentQuestion = 0;
    state.scores = Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]));
  }

  function startQuiz() {
    resetState();
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[state.currentQuestion];
    const total = QUESTIONS.length;
    const step = state.currentQuestion + 1;

    els.progressBar.style.width = `${((step - 1) / total) * 100}%`;
    els.progressLabel.textContent = `Fråga ${step} av ${total}`;
    els.questionText.textContent = q.text;

    els.optionsList.innerHTML = "";
    q.options.forEach((option) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = option.text;
      btn.addEventListener("click", () => selectAnswer(option));
      li.appendChild(btn);
      els.optionsList.appendChild(li);
    });
  }

  function selectAnswer(option) {
    Object.entries(option.weights).forEach(([productId, points]) => {
      state.scores[productId] = (state.scores[productId] || 0) + points;
    });

    if (state.currentQuestion < QUESTIONS.length - 1) {
      state.currentQuestion += 1;
      renderQuestion();
    } else {
      els.progressBar.style.width = "100%";
      finishQuiz();
    }
  }

  function computeMaxPossible() {
    const max = Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]));
    QUESTIONS.forEach((q) => {
      PRODUCTS.forEach((p) => {
        const best = Math.max(...q.options.map((opt) => opt.weights[p.id] || 0));
        max[p.id] += best;
      });
    });
    return max;
  }

  function computeResults() {
    const max = computeMaxPossible();
    return PRODUCTS.map((p) => {
      const score = state.scores[p.id] || 0;
      const possible = max[p.id] || 1;
      const percent = Math.round((score / possible) * 100);
      return { product: p, percent };
    }).sort((a, b) => b.percent - a.percent);
  }

  function finishQuiz() {
    const results = computeResults();
    renderResults(results);
    showScreen("result");
  }

  function renderResults(results) {
    els.resultList.innerHTML = "";

    results.forEach((r, index) => {
      const li = document.createElement("li");
      li.className = "result-item" + (index === 0 ? " result-item--top" : "");

      const img = document.createElement("img");
      img.src = r.product.image;
      img.alt = r.product.name;
      img.className = "result-item__img";

      const info = document.createElement("div");
      info.className = "result-item__info";

      const name = document.createElement("div");
      name.className = "result-item__name";
      name.textContent = r.product.name;
      if (index === 0) {
        const badge = document.createElement("span");
        badge.className = "result-item__badge";
        badge.textContent = "Bästa match";
        name.appendChild(badge);
      }

      const tagline = document.createElement("div");
      tagline.className = "result-item__tagline";
      tagline.textContent = r.product.tagline;

      const barTrack = document.createElement("div");
      barTrack.className = "result-item__bar-track";
      const bar = document.createElement("div");
      bar.className = "result-item__bar";
      bar.style.width = "0%";
      barTrack.appendChild(bar);

      info.append(name, tagline, barTrack);

      const percent = document.createElement("div");
      percent.className = "result-item__percent";
      percent.textContent = `${r.percent}%`;

      li.append(img, info, percent);
      els.resultList.appendChild(li);

      requestAnimationFrame(() => {
        bar.style.width = `${r.percent}%`;
      });
    });

    els.shareBtn.dataset.top = JSON.stringify({
      name: results[0].product.name,
      percent: results[0].percent,
      image: results[0].product.image,
      tagline: results[0].product.tagline
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function drawShareCard(top) {
    const canvas = els.shareCanvas;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#fff6d9");
    gradient.addColorStop(1, "#cfe4ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.fillStyle = "#2c2320";
    ctx.font = "600 44px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("VALKOMPASSEN", W / 2, 180);
    ctx.font = "400 32px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("Wermlands Mejeri", W / 2, 230);

    try {
      const img = await loadImage(top.image);
      const size = 620;
      const x = (W - size) / 2;
      const y = 320;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, y + size / 2, size / 2 + 14, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    } catch (e) {
      // Om bilden inte kan laddas, fortsätt utan den.
    }

    ctx.font = "700 40px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#2c2320";
    ctx.fillText("Min matchning:", W / 2, 1060);

    ctx.font = "800 90px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#c96b1c";
    ctx.fillText(top.name, W / 2, 1170);

    ctx.font = "800 130px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#2c2320";
    ctx.fillText(`${top.percent}%`, W / 2, 1330);

    ctx.font = "400 36px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#5a4c44";
    wrapText(ctx, top.tagline, W / 2, 1420, 820, 46);

    ctx.font = "500 34px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#2c2320";
    ctx.fillText("Gör testet du också 👉", W / 2, 1780);

    return canvas;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let offsetY = y;
    words.forEach((word, i) => {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, offsetY);
        line = word + " ";
        offsetY += lineHeight;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line.trim(), x, offsetY);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function handleShare() {
    const top = JSON.parse(els.shareBtn.dataset.top || "{}");
    if (!top.name) return;

    els.shareBtn.disabled = true;
    els.shareBtn.textContent = "Skapar bild…";

    await drawShareCard(top);
    const blob = await canvasToBlob(els.shareCanvas);
    const file = new File([blob], "valkompass-resultat.png", { type: "image/png" });

    els.shareBtn.disabled = false;
    els.shareBtn.textContent = "Dela resultat";

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Valkompassen – Wermlands Mejeri",
          text: `Jag matchar ${top.percent}% med ${top.name}! Testa du också.`
        });
        return;
      } catch (e) {
        // Användaren avbröt delningen, eller share stöds inte fullt ut – fall tillbaka på nedladdning.
      }
    }

    downloadBlob(blob);
  }

  function downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "valkompass-resultat.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function handleDownload() {
    const top = JSON.parse(els.shareBtn.dataset.top || "{}");
    if (!top.name) return;

    els.downloadBtn.disabled = true;
    await drawShareCard(top);
    const blob = await canvasToBlob(els.shareCanvas);
    downloadBlob(blob);
    els.downloadBtn.disabled = false;
  }

  els.startBtn.addEventListener("click", startQuiz);
  els.restartBtn.addEventListener("click", () => showScreen("start"));
  els.shareBtn.addEventListener("click", handleShare);
  els.downloadBtn.addEventListener("click", handleDownload);

  showScreen("start");
})();
