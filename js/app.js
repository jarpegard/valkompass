(function () {
  "use strict";

  const MAX_PERCENT = 97;
  const BOOSTED_RANGE = [72, MAX_PERCENT];
  const NORMAL_RANGE = [5, 90];

  const state = {
    currentQuestion: 0,
    boostedIds: new Set()
  };

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
    state.boostedIds = new Set();
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
      const isPlainText = typeof option === "string";
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = isPlainText ? option : option.text;
      btn.addEventListener("click", () => selectAnswer(isPlainText ? null : option.boost));
      li.appendChild(btn);
      els.optionsList.appendChild(li);
    });
  }

  function selectAnswer(boost) {
    if (boost) {
      boost.forEach((id) => state.boostedIds.add(id));
    }

    if (state.currentQuestion < QUESTIONS.length - 1) {
      state.currentQuestion += 1;
      renderQuestion();
    } else {
      els.progressBar.style.width = "100%";
      finishQuiz();
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const MILK_IDS = ["lattmjolk", "mellanmjolk", "standardmjolk"];
  const MIDDLE_RANK = 3; // 0-indexad, dvs plats 4 av 7 – "mitten"
  const BOTTOM_RANK = 6; // sista platsen – "minst"

  // Resultatet är till största delen slumpmässigt (boostade produkter får ett
  // högt slumptal, se randomInt ovan), men formen på listan följer alltid
  // dessa regler:
  // 1. Grädde eller en mjölk toppar alltid – aldrig filmjölk eller yoghurt.
  // 2. En mjölk hamnar alltid någonstans i mitten, och en mjölk hamnar alltid
  //    sist.
  // 3. Om grädde inte toppar ska grädde ändå hamna topp-3.
  // 4. Om standardmjölk toppar ska lättmjölk vara den som hamnar sist (då
  //    blir mellanmjölk per automatik den som hamnar i mitten).
  // Ingen produkt kan någonsin landa på exakt 100% (MAX_PERCENT).
  function computeResults() {
    const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
    const allIds = PRODUCTS.map((p) => p.id);

    const basePercent = {};
    allIds.forEach((id) => {
      const range = state.boostedIds.has(id) ? BOOSTED_RANGE : NORMAL_RANGE;
      basePercent[id] = randomInt(range[0], range[1]);
    });

    // Rang 0 (top) går till vem som helst av grädde/mjölkarna som råkar ha
    // högst slumptal – boostade svar (färgfrågan, jordgubbsalternativet)
    // väger in här precis som förut, de får bara aldrig konkurrens av
    // filmjölk/yoghurt om förstaplatsen.
    const topCandidates = ["gradde", ...MILK_IDS];
    const topper = topCandidates.reduce((best, id) =>
      basePercent[id] > basePercent[best] ? id : best
    );

    const rankToId = {};
    rankToId[0] = topper;

    if (topper === "standardmjolk") {
      rankToId[MIDDLE_RANK] = "mellanmjolk";
      rankToId[BOTTOM_RANK] = "lattmjolk";
    } else if (MILK_IDS.includes(topper)) {
      const [middleMilk, bottomMilk] = shuffle(MILK_IDS.filter((id) => id !== topper));
      rankToId[MIDDLE_RANK] = middleMilk;
      rankToId[BOTTOM_RANK] = bottomMilk;
    } else {
      // Grädde toppar – två av de tre mjölkarna täcker mitten/botten, den
      // tredje är fri och hamnar bland de obundna platserna nedan.
      const [middleMilk, bottomMilk] = shuffle(MILK_IDS);
      rankToId[MIDDLE_RANK] = middleMilk;
      rankToId[BOTTOM_RANK] = bottomMilk;
    }

    if (topper !== "gradde") {
      // Grädde toppade inte – då måste grädde ändå in topp-3 (plats 2 eller 3).
      const graddeRank = Math.random() < 0.5 ? 1 : 2;
      rankToId[graddeRank] = "gradde";
    }

    const usedIds = new Set(Object.values(rankToId));
    const remainingIds = shuffle(allIds.filter((id) => !usedIds.has(id))).sort(
      (a, b) => basePercent[b] - basePercent[a]
    );
    const remainingRanks = [1, 2, 3, 4, 5, 6].filter((r) => !(r in rankToId));
    remainingRanks.forEach((rank, i) => {
      rankToId[rank] = remainingIds[i];
    });

    const sortedPercents = allIds
      .map((id) => basePercent[id])
      .sort((a, b) => b - a);

    return sortedPercents.map((percent, rank) => ({
      product: byId[rankToId[rank]],
      percent
    }));
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
      li.style.setProperty("--accent", r.product.color);

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
      tagline: results[0].product.tagline,
      color: results[0].product.color
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

  function drawImageContain(ctx, img, x, y, w, h, padding) {
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const scale = Math.min(innerW / img.width, innerH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  async function drawShareCard(top) {
    const canvas = els.shareCanvas;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    await Promise.all([
      document.fonts.load("400 60px 'League Gothic'"),
      document.fonts.load("400 30px 'Courier New'")
    ]);

    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#fff6d9");
    gradient.addColorStop(1, "#cfe4ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.fillStyle = "#2c2320";
    ctx.font = "400 56px 'League Gothic', 'Arial Narrow', sans-serif";
    ctx.fillText("VALKOMPASSEN", W / 2, 175);
    ctx.font = "400 30px 'Courier New', Courier, monospace";
    ctx.fillText("Wermlands Mejeri", W / 2, 228);

    const cardW = 480;
    const cardH = 660;
    const cardX = (W - cardW) / 2;
    const cardY = 300;
    const frame = 16;

    ctx.save();
    ctx.shadowColor = "rgba(44, 35, 32, 0.25)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 14;
    roundRectPath(ctx, cardX - frame, cardY - frame, cardW + frame * 2, cardH + frame * 2, 32);
    ctx.fillStyle = top.color || "#201a17";
    ctx.fill();
    ctx.restore();

    try {
      const img = await loadImage(top.image);
      roundRectPath(ctx, cardX, cardY, cardW, cardH, 22);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.save();
      roundRectPath(ctx, cardX, cardY, cardW, cardH, 22);
      ctx.clip();
      drawImageContain(ctx, img, cardX, cardY, cardW, cardH, 24);
      ctx.restore();
    } catch (e) {
      // Om bilden inte kan laddas, fortsätt utan den.
    }

    ctx.font = "400 34px 'Courier New', Courier, monospace";
    ctx.fillStyle = "#2c2320";
    ctx.fillText("Min matchning:", W / 2, 1060);

    ctx.font = "400 120px 'League Gothic', 'Arial Narrow', sans-serif";
    ctx.fillStyle = top.color || "#201a17";
    ctx.fillText(top.name.toUpperCase(), W / 2, 1180);

    ctx.font = "400 160px 'League Gothic', 'Arial Narrow', sans-serif";
    ctx.fillStyle = "#2c2320";
    ctx.fillText(`${top.percent}%`, W / 2, 1340);

    ctx.font = "400 32px 'Courier New', Courier, monospace";
    ctx.fillStyle = "#5a4c44";
    wrapText(ctx, top.tagline, W / 2, 1420, 820, 42);

    ctx.font = "400 30px 'Courier New', Courier, monospace";
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
