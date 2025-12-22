        const urlParams = new URLSearchParams(location.search);
        const token1 = urlParams.get("key1");
        localStorage.setItem("requestPage1", "");
        var token3 = localStorage.getItem("account1");
        localStorage.setItem("account1", "");
        if((token1 !== localStorage.getItem("key1")) || (token3 == "") || (token3 == null)){
            localStorage.setItem("key1", "unauthorized");
            location.href = "/game-sites/";
        }else{
            localStorage.setItem("key1", "");
            setInterval(() => {
                sendToGAS(token3, "", "top");
            }, 5000);
        }

    /* ======== Google Apps Script Web App URL ======== */
    const WEB_APP_URL =
      "https://script.google.com/macros/s/AKfycbyU69VodYxnQJxMI4BhpCnVyvSlFcdM54XFnio5y8A02Uf_P__36zrWbpwih_Wc3szYHw/exec";
    /* ======== GASに送信する処理 ======== */
    async function sendToGAS(User, text, status){
      const payload = {
        user: User,
        message: text,
        status
      };
      try {
        await fetch(WEB_APP_URL, {
          method: "POST",
          mode: "no-cors",   // ← GAS が CORS 許可してないため必要
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error("送信エラー:", e);
      }
    }


    const linkList = document.getElementById("linkList");
    linkList.addEventListener("click", (e) => {
      const item = e.target.closest(".link-item");
      if (!item) return;
      const link = item.dataset.link;
      const key1 = crypto.randomUUID(); // 共通処理
      localStorage.setItem("key1", key1);
      localStorage.setItem("account1", token3);
      location.href = `/game-sites/${link}?key1=${key1}`;
    });


        function jumpPage(link){
            const key1 = crypto.randomUUID();
            localStorage.setItem("key1", key1);
            localStorage.setItem("account1", token3);
            if(link == ''){
                sendToGAS(token3, "", "idle");
            }
            location.href = "/game-sites/" + link + "?key1=" + key1;
        }
