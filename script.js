const chat = document.getElementById("chat");
const destinationEl = document.getElementById("destination");
const purposeEl = document.getElementById("purpose");
const daysEl = document.getElementById("days");
const sendBtn = document.getElementById("send");
const resetBtn = document.getElementById("reset");

function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function addMessage(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${role === "me" ? "You" : "Bot"} · ${nowTime()}`;

  if (role === "me") {
    wrap.appendChild(meta);
    wrap.appendChild(bubble);
  } else {
    wrap.appendChild(bubble);
    wrap.appendChild(meta);
  }

  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

function planTemplates(dest, purpose, days) {
  const p = {
    sightseeing: "観光",
    food: "グルメ",
    nature: "自然",
    budget: "節約",
  }[purpose] ?? "観光";

  const n = Number(days);

  // 目的別の「軸」
  const focus =
    purpose === "food" ? "食べ歩きとローカル店" :
    purpose === "nature" ? "公園・景勝地・散歩" :
    purpose === "budget" ? "無料スポットと移動最適化" :
    "定番スポットと街歩き";

  // 日数でプランの密度を変える（ざっくり）
  const dayBlocks = [];
  for (let i = 1; i <= n; i++) {
    if (i === 1) dayBlocks.push(`Day${i}: 到着→中心街散策→名所を2〜3個→夜は${p}メイン`);
    else if (i === n) dayBlocks.push(`Day${i}: 朝ゆっくり→お土産→帰路（時間があれば軽い寄り道）`);
    else dayBlocks.push(`Day${i}: ${focus}の日（午前/午後/夜でテーマ分け）`);
  }

  // 行き先が有名なものだけ少しだけ具体化（任意）
  const extras = [];
  const dLower = dest.toLowerCase();

  if (dLower.includes("zagreb") || dest.includes("ザグレブ")) {
    extras.push("※例：旧市街→大聖堂周辺→カフェ→市場（Dolac）みたいに組むと回りやすい");
  } else if (dLower.includes("tokyo") || dest.includes("東京")) {
    extras.push("※例：浅草/上野/渋谷などエリアを日ごとに分けると移動が楽");
  } else if (dLower.includes("fukuoka") || dest.includes("福岡")) {
    extras.push("※例：天神/博多/大濠公園でエリア分け＋屋台は夜に固定が強い");
  }

  return [
    `了解！「${dest}」で${n}日・目的「${p}」のプラン案を作ったよ。\n`,
    ...dayBlocks.map(s => `・${s}`),
    "",
    "コツ：移動を減らすために「1日1エリア」を意識すると満足度が上がる。",
    ...extras,
    "",
    "追加で「予算」「季節」「同行者（1人/友達/家族）」が分かれば、もっと刺さるプランに調整できるよ。"
  ].join("\n");
}

function handleSend() {
  const dest = destinationEl.value.trim();
  const purpose = purposeEl.value;
  const days = daysEl.value;

  if (!dest) {
    addMessage("bot", "行き先が空だよ！例：Zagreb / 福岡 / Seoul みたいに入れてね。");
    destinationEl.focus();
    return;
  }

  addMessage("me", `行き先：${dest}\n目的：${purposeEl.options[purposeEl.selectedIndex].text}\n日数：${days}日`);
  const reply = planTemplates(dest, purpose, days);

  // ボットっぽさ（少し待って返す）
  sendBtn.disabled = true;
  setTimeout(() => {
    addMessage("bot", reply);
    sendBtn.disabled = false;
  }, 450);
}

function init() {
  addMessage("bot", "こんにちは！行き先・目的・日数を入れて「プランを提案」を押してね。");
}

sendBtn.addEventListener("click", handleSend);
resetBtn.addEventListener("click", () => {
  chat.innerHTML = "";
  destinationEl.value = "";
  purposeEl.value = "sightseeing";
  daysEl.value = "3";
  init();
});

destinationEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});

init();
