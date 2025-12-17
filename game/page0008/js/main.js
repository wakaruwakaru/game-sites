const slots = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3")
];

const symbols = ["🍎", "🍌", "🍇", "🍒", "🍊", "7"];
let slotTimers = [];
let isSpinning = [false, false, false];

/* ====== スタート ====== */
function startSlot() {
    document.getElementById("result").textContent = "";

    slots.forEach(slot => {
        slot.classList.remove("win");
    });

    for (let i = 0; i < slots.length; i++) {
        if (!isSpinning[i]) {
            isSpinning[i] = true;
            slotTimers[i] = setInterval(() => {
                slots[i].textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
        }
    }
}

/* ====== ストップ ====== */
function stopSlot(reelIndex) {
    if (isSpinning[reelIndex]) {
        clearInterval(slotTimers[reelIndex]);
        isSpinning[reelIndex] = false;

        /* 停止エフェクト */
        slots[reelIndex].classList.add("flash");
        setTimeout(() => slots[reelIndex].classList.remove("flash"), 350);
    }

    if (!isSpinning.includes(true)) {
        checkResult();
    }
}

/* ====== 結果判定 ====== */
function checkResult() {
    const result = slots.map(s => s.textContent);

    if (result[0] === result[1] && result[1] === result[2]) {
        document.getElementById("result").textContent = "✨ 大当たり！ ✨";

        /* 大当たりエフェクト */
        slots.forEach(s => s.classList.add("win"));

    } else {
        document.getElementById("result").textContent = "残念…";
    }
}

document.getElementById("startButton").addEventListener("click", startSlot);
document.getElementById("stopButton1").addEventListener("click", () => stopSlot(0));
document.getElementById("stopButton2").addEventListener("click", () => stopSlot(1));
document.getElementById("stopButton3").addEventListener("click", () => stopSlot(2));
