      document.getElementById("copyBtn").addEventListener("click", async () => {
        try {
          const target = document.getElementById("articleArea");
          // 🎚️ 高画質スケール倍率（2～5で調整可能）
          const scale = 3;
          // 📸 高解像度スクショ生成
          const canvas = await html2canvas(target, {
          scale: scale,
          useCORS: true,          // 外部画像対策
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
          backgroundColor: null   // 背景透過（必要なければ削ってOK）
        });
        // 🔄 PNG Blob に変換
        const blob = await new Promise(resolve =>
          canvas.toBlob(resolve, "image/png")
        );
        // 📋 高画質画像をクリップボードにコピー
        await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob
        })
      ]);
      /*alert("スクショ画像をコピーしました！\nクリップボードからペーストできます");*/
      showToast("記事をコピーしました");
    } catch (err) {
      console.error(err);
      /*alert("コピーに失敗しました\n対応していないブラウザの可能性があります");*/
      showToast("記事のコピーができませんでした");
    }
  });

      function showToast(msg = "コピーしました！"){
        const toast = document.getElementById("toast");
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 2500); // 2.5秒で消える
      }
