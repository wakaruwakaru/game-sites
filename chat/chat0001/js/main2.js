const panel = document.getElementById("mediaPanel");
function toggleMediaPanel(){
  panel.classList.toggle("show");
}

// パネル外クリックで閉じる（最小侵襲）
document.addEventListener("click", (e) => {
  // パネルが閉じているなら何もしない
  if (!panel.classList.contains("show")) return;
  // パネル内クリックなら無視
  if (panel.contains(e.target)) return;
  // ＋ボタン自身なら無視
  if (e.target.closest(".icon-left")) return;
  // それ以外 → 閉じる
  panel.classList.remove("show");
});


const tabs = document.querySelectorAll(".media-header .tab");
const mediaContent = document.getElementById("mediaContent");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target; // gif / stamp / emoji
    // ① タブの active 切り替え
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    // ② mediaContent のモード切り替え
    mediaContent.dataset.mode = target;
    // ③ 表示内容切り替え（仮）
    updateMediaContent(target);
  });
});
mediaContent.addEventListener("click", (e) => {
  const item = e.target.closest(".media-item");
  if (!item) return;
  const type = item.dataset.type;
  const id = item.dataset.id;

  const text2 = text_trim(id, type);
  sendToGAS(token3, text2, "chat");
  panel.classList.remove("show");
});

function updateMediaContent(type){
  mediaContent.innerHTML = ""; //初期化
  if(type == "emoji"){
    renderEmojiList();
  }else if(type == "stamp"){
    renderImgList("stamp", "genshin", 1, 9, "png");
    renderImgList("stamp", "other", 1, 17, "png");
  }else if(type == "gif"){
    renderImgList("gif", "genshin", 1, 8, "gif");
    renderImgList("gif", "starrail", 1, 5, "gif");
    renderImgList("gif", "jojo", 1, 4, "gif");
    renderImgList("gif", "other", 1, 6, "gif");
  }
}

const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
const emoji_list = [...segmenter.segment(
  "😀😃😄😁😆😅🤣😂🙂🙃😉😉😊😇🥰😍🤩😘😗😚😙🥲😋😛😜🤪😝🤑🤗🤭🫢🫣🤫🤔🫡" +
  "🤐🤨😐😑😶🫥😶‍🌫️😶‍🌫️😏😒🙄😬😮‍💨🤥🫨🙂‍↔️🙂‍↕️😌😔😪🤤😴🫩😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯" +
  "😕🫤😟🙁😮😯😲😳🥺🥹😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱" +
  "🤠🥳🥸😎🤓🧐😤😡😠🤬😈👿💀🤡👹👺👻👽👾🤖" +
  "💌💘💝💖💗💓💞💕💟💔❤️‍🔥❤️‍🩹💯💢💥💫💦💨🕳️💣💬👁‍🗨🗨️🗯️💭💤" +
  "👥🫂👤🗣️👣🫆🧠🫀🫁🩸🦠🦷🦴👀👁️👄🫦👅👃👂🦻🦶🦵🦿🦾💪👏👍👎🫶🙌👐🤲🤜🤛✊👊🫳🫴🫱🫲🫸🫷👋🤚🖐️✋🖖🤟🤘✌️🤞🫰🤙🤌🤏👌🫵👉👈💅🙏🤳✍️🖕👇👆☝️🤝" +
  "🙇🙋💁🙆🙅🤷🤦🙍🙎🧏💆💇🧖🛀🛌🧘🧍🤸🧎🧑‍🦼🧑‍🦽🧑‍🦯🚶🏃⛹️🤾🚴🚵🧗🏋️🤼🤹🏌️🏇🤺⛷️🏂🪂🏄🚣🏊🤽🧜🧚🧞🧝🧙🧛🧟🧌🦸🦹🥷🧑‍🎄👼💂🫅🤵👰🧑‍🚀👷👮🕵️🧑‍✈️🧑‍🔬🧑‍⚕️🧑‍🔧🧑‍🏭🧑‍🚒🧑‍🌾🧑‍🏫🧑‍🎓🧑‍💼🧑‍⚖️🧑‍💻🧑‍🎤🧑‍🎨🧑‍🍳👳🧕👲👶🧒🧑🧓🧑‍🦳🧑‍🦰👱🧑‍🦱🧑‍🦲🧔🕴️💃🕺👯🧑‍🤝‍🧑👭👬👫💑👩‍❤️‍👨👨‍❤️‍👨👩‍❤️‍👩🫄🤱🧑‍🍼" +
  "💐🌹🥀🌺🌷🪷🌸💮🏵️🪻🌻🌼🍂🍁🍄🌾🌱🌿🍃☘️🍀🪴🌵🌴🪾🌳🌲🪵🪹🪺🪨⛰️🏔️❄️☃️⛄🌡️🔥🌋🏜️🏞️🌅🌄🏝️🏖️🌈🫧🌊🌬️🌀🌪️⚡☔💧☁️🌨️🌧️🌩️⛈️🌦️🌥️⛅🌤️☀️🌞🌝🌚🌜🌛🌙⭐🌟✨🕳️🪐🌍🌎🌏🌫️🌠🌌☄️🌑🌒🌓🌔🌕🌖🌗🌘🦁🐯😺😸😹😻😼😽🙀😿😾🐵🙈🙉🙊🐱🐶🐺🐻🐻‍❄️🐨🐼🐹🐭🐰🦊🦝🐮🐷🐽🐗🦓🦄🐴🫎🐲🦎🐉🦖🦕🐢🐊🐍🐸🐇🐁🐀🐈🐈‍⬛🐩🐕🦮🐕‍🦺🐖🐎🫏🐄🐂🐃🦬🐏🐑🐐🦌🦙🦥🦘🐘🦣🦏🦛🦒🐆🐅🐒🦍🦧🐪🐫🐿️🦫🦨🦡🦔🦦🦇🪽🪶🐦🐦‍⬛🐓🐔🐣🐤🐥🦅🦉🦜🕊️🦤🦢🦆🪿🦩🦚🐦‍🔥🦃🐧🦭🦈🐬🐋🐳🐟🐠🐡🦐🦞🦀🦑🐙🪼🦪🪸🦂🕷️🕸️🐚🐌🐜🦗🪲🦟🪳🪰🐝🐞🦋🐛🪱🐾" +
  "🍓🍒🍎🍅🌶️🍉🍑🍊🥕🥭🍍🍌🌽🍋🍋‍🟩🍈🍐🫛🥬🫑🍏🥝🥑🫒🥦🥒🫐🍇🍆🍠🫜🥥🥔🍄‍🟫🧅🫚🧄🫘🌰🥜🍞🫓🥐🥖🥯🧇🥞🍳🥚🧀🥓🥩🍗🍖🍔🌭🥪🥨🍟🍕🫔🌮🌯🥙🧆🥘🍝🥫🫕🥣🥗🍲🍛🍜🦪🦞🍣🍤🥡🍚🍱🥟🍢🍙🍘🍥🍡🥠🥮🍧🍨🍦🥧🍰🍮🎂🧁🍭🍬🍫🍩🍪🍯🧂🧈🍿🧊🫙🥤🧋🧃🥛🍼🍵☕🫖🧉🍺🍻🥂🍾🍷🥃🫗🍸🍹🍶🥢🍴🥄🔪🍽️" +
  "🚧🚨⛽🛢️🧭🛞🛟⚓🚏🚇🚥🚦🛴🦽🦼🩼🚲🛵🏍️🚙🚗🛻🚐🚚🚛🚜🏎️🚒🚑🚓🚕🛺🚌🚈🚝🚅🚄🚂🚃🚋🚎🚞🚊🚉🚍🚔🚘🚖🚆🚢🛳️🛥️🚤⛴️⛵🛶🚟🚠🚡🚁🛸🚀✈️🛫🛬🛩️🛝🎢🎡🎠🎪🗼🗽🗿🗻🏛️💈⛲⛩️🕍🕌🕋🛕⛪💒🏩🏯🏰🏗️🏢🏭🏬🏪🏟️🏦🏫🏨🏣🏤🏥🏚️🏠🏡🏘️🛖⛺🏕️⛱️🏙️🌆🌇🌃🌉🌁🛤️🛣️🗾🗺️💺🧳" +
  "🎉🎊🎈🎂🎀🎁🎇🎆🧨🧧🪔🪅🪩🎐🎏🎎🎑🎍🎋🎄🎃🎗️🥇🥈🥉🏅🎖️🏆📢⚽⚾🥎🏀🏐🏈🏉🥅🎾🏸🥍🏏🏑🏒🥌🛷🎿⛸️🛼🩰🛹⛳🎯🏹🥏🪃🪁🎣🤿🩱🎽🥋🥊🎱🏓🎳♟️🪀🧩🎮🕹️👾🔫🎲🎰🎴🀄🃏🪄🎩📷📸🖼️🎨🫟🖌️🖍️🪡🧵🧶🎹🎷🎺🎸🪕🎻🪉🪘🥁🪇🪈🪗🎤🎧🎚️🎛️🎙️📻📺📼📹📽️🎥🎞️🎬🎭🎫🎟️" +
  "📱☎️📞📟📠🔌🔋🪫🖲️💽💾💿📀🖥️💻⌨️🖨️🖱️🪙💸💵💴💶💷💳💰💎🧾🧮⚖️🛒🛍️🕯️💡🔦🏮🧱🪟🪞🚪🪑🛏️🛋️🚿🛁🚽🧻🪠🧸🪆🧷🪢🧹🧴🧽🧼🪥🪒🪮🧺🧦🧤🧣👖👕🎽👚👔👗👘🥻🩱👙🩳🩲🧥🥼🦺⛑️🪖🎓🎩👒🧢👑💍💄🪭🎒👝👛👜💼🧳☂️🌂🥾👢🩴👠👟👞🥿👡🦯🕶️👓🥽⚗️🧫🧪🌡️💉💊🩹🩺🩻🧬🔭🔬📡🛰️🧯🪓🪜🪣🪝🧲🧰🗜️🔩🪛🪚🔧🔨🛠️⚒️⛏️🪏⚙️⛓️‍💥🔗⛓️📎🖇️✂️📏📐🖌️🖍️🖊️🖋️✒️✏️📝🗒️📄📃📑📋🗃️🗄️📒📔📕📓📗📘📙📚📖🔖📂📁🗂️📊📈📉📇🪪📌📍🗑️📰🗞️🏷️📦📤📥📨📩✉️💌📧📫📪📬📭📮🗳️⌚🕰️⌛⏳⏲️⏰⏱️🕛🕧🕐🕜🕑🕝🕒🕞🕓🕟🕔🕠🕕🕡🕖🕢🕗🕣🕘🕤🕙🕥🕚🕦📅📆🗓️🪧🛎️🔔📯📢📣🔈🔉🔊🔍🔎🔮🧿🪬📿🏺⚱️⚰️🪦🚬💣🪤📜⚔️🗡️🛡️🗝️🔑🔐🔏🔒🔓" +
  "🔴🟠🟡🟢🔵🟣🟤⚫⚪🟥🟧🟨🟩🟦🟪🟫⬛⬜❤️🧡💛💚💙💜🤎🖤🤍🩷🩵🩶♥️♦️♣️♠️♈♉♊♋♌♍♎♏♐♑♒♓⛎♀️♂️⚧️💭🗯️💬🗨️❕❔❗❓⁉️‼️⭕❌🚫🚳🚭🚯🚱🚷📵🔞🔕🔇🅰️🆎🅱️🅾️🆑🆘🛑⛔📛♨️🔻🔺🉐㊙️㊗️🈴🈵🈹🈲🉑🈶🈚🈸🈺🈷️✴️🔶🔸🔆🔅🆚🎦📶🔁🔂🔀▶️⏩⏭️⏯️◀️⏪⏮️🔼⏫🔽⏬⏸️⏹️⏺️⏏️📴🛜📳📲☢️☣️⚠️🚸⚜️🔱〽️🔰✳️❇️♻️💱💲💹🈯❎✅✔️☑️⬆️↗️➡️↘️⬇️↙️⬅️↖️↕️↔️↩️↪️⤴️⤵️🔃🔄🔙🔛🔝🔚🔜🆕🆓🆙🆗🆒🆖ℹ️🅿️🈁🈂️🈳🔣🔤🔠🔡🔢#️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🌐💠🔷🔹🏧Ⓜ️🚾🚻🚹🚺♿🚼🛗🚮🚰🛂🛃🛄🛅💟⚛️🛐🕉️☸️☮️☯️☪️🪯✝️☦️✡️🔯🕎♾️🆔🧑‍🧑‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧒🧑‍🧒‍🧒⚕️🎼🎵🎶✖️➕➖➗🟰➰➿〰️©️®️™️🔘🔳◼️◾▪️🔲◻️◽▫️👁️‍🗨️"
)].map(s => s.segment);

function renderEmojiList(){
//mediaContent.innerHTML = "";
  for(let i = 0; i < emoji_list.length; i++){
    const item = document.createElement("div");
    item.className = "media-item";
    item.dataset.type = "emoji";
    item.dataset.id = String(i + 1); // idは1始まり
    item.textContent = emoji_list[i];
    mediaContent.appendChild(item);
  }
}
renderEmojiList();

//画像系描画  (画像タイプ, 画像ジャンル, 開始コード(1), 終始コード, ファイル拡張子)
function renderImgList(type, genre, start, end, file){
//mediaContent.innerHTML = "";
  for(let i = (start - 1); i < end; i++){
    const item = document.createElement("div");
    item.className = "media-item";
    item.dataset.type = type;
    item.dataset.id = genre + "/" + String(i + 1);
    const img = document.createElement("img");
    img.src = `/game-sites/chat/${type}/${genre}/${i + 1}.${file}`;
    img.loading = "lazy";      // パフォーマンス向上
    img.alt = `${type}-${genre}-${i + 1}`;

    item.appendChild(img);
    mediaContent.appendChild(item);
  }
}


    /* ======== Google Apps Script Web App URL ======== */
    const WEB_APP_URL =
      "https://script.google.com/macros/s/AKfycbxzPIpMXRgQ5QuKM_hwIQ815at4Ml6Vvqhx_zabeDNGupPwsTvWWP3jpOXLnxbeGSIMDQ/exec";

    // アカウントID → アイコンURL
    const userIcons = {
      default:      "/game-sites/chat/chatIcons/default-0001.png",
      wakaruwakaru: "/game-sites/chat/chatIcons/wakaruwakaru-0001.png",
      dabada:       "/game-sites/chat/chatIcons/dabada-0001.png",
      173:          "/game-sites/chat/chatIcons/173-0001.png",
      RTX5090rairai:"/game-sites/chat/chatIcons/rairai-0001.png"
    };

    /* ======== メッセージ送信 ======== */
    async function send() {
      const box = document.getElementById("textBox1");
      const text = box.value.trim();
      if (!text) return;
      
      scrollToBottom();
      // 入力欄リセット
      box.value = "";
      box.focus();

      const text2 = text_trim(text, "message");
      sendToGAS(token3, text2, "chat"); // GAS へ送信
    }

    /* ============チャットログインログ=========== */
    async function send_login() {
      const text2 = text_trim("", "login");
      sendToGAS(token3, text2, "chat"); // GAS へ送信
    }
    
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
        // no-cors のためレスポンスは読めない（仕様）
      } catch (e) {
        console.error("送信エラー:", e);
      }
    }


/* ======== メッセージ追加（受信側） ======== */
function addMessage_received(user, type, time, value){
  const iconURL = userIcons[user] || userIcons["default"];
  const msg = document.createElement("div");
  msg.className = "message received";

  // --- アイコン ---
  const icon = document.createElement("div");
  icon.className = "user-icon";
  icon.style.backgroundImage = `url('${iconURL}')`;
  // --- 本体 ---
  const content = document.createElement("div");
  content.className = "message-content";
  // --- 中身 ---
  const body = createMessageBody(type, value);
  if(body) content.appendChild(body);
  // --- 時刻 ---
  const ts = document.createElement("span");
  ts.className = "timestamp";
  ts.textContent = time;

  content.appendChild(ts);
  msg.append(icon, content);
  document.getElementById("message1").appendChild(msg);
}

/* ======== メッセージ追加（送信側） ======== */
function addMessage_sent(type, time, value, rawTime){
  const msg = document.createElement("div");
  msg.className = "message sent";

  // メッセージの時刻を保持（既読判定用）
  msg.dataset.time = rawTime;
  // --- 本体 ---
  const content = document.createElement("div");
  content.className = "message-content";
  // --- 中身 ---
  const body = createMessageBody(type, value);
  if(body) content.appendChild(body);
  // --- 時間 ---
  const ts = document.createElement("span");
  ts.className = "timestamp";
  ts.textContent = time;
  // --- 既読 ---
  const read = document.createElement("span");
  read.className = "read-status";
  read.textContent = "既読 0";

  content.appendChild(body);
  content.appendChild(ts);
  content.appendChild(read);
  msg.appendChild(content);

  message1.appendChild(msg);
}

function createMessageBody(type, value){
  switch(type){
    case "message":{
      const p = document.createElement("p");
      p.textContent = value;
      return p;
    }
    case "emoji":{
      const p = document.createElement("p");
      p.textContent = emoji_list[Number(value) - 1];
      p.className = "emoji";
      return p;
    }
    case "stamp":{
      const img = document.createElement("img");
      img.src = "/game-sites/chat/stamp/" + value + ".png";
      img.loading = "lazy";
    //img.className = "media-img";
      return img;
    }
    case "gif":{
      const img = document.createElement("img");
      img.src = "/game-sites/chat/gif/" + value + ".gif";
      img.loading = "lazy";
    //img.className = "media-img";
      return img;
    }

    default:
      console.warn("未知のメッセージタイプ:", type);
      return null;
  }
}


/*=============時間ピル追加==============*/
function addDatePill(text){
  // ラッパー（中央寄せ）
  const wrapper = document.createElement("div");
  wrapper.className = "center-set";
  // ピル本体（見た目）
  const pill = document.createElement("div");
  pill.className = "chat-date-pill";
  pill.textContent = text;
  // wrapper の中に pill を入れる
  wrapper.appendChild(pill);
  // message1 に挿入
  document.getElementById("message1").appendChild(wrapper);
}

    /* ======== 自動スクロール ======== */
    function scrollToBottom(){
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }

    /* ======== エンター送信 ======== */
    function enterSend(e){
      if(e.isComposing) return;
      if(e.key === "Enter") send();
    }
    
    function text_trim(text1, text2){
      return `<type[${text2}]acco[${token3}]time[${new Date()}]val1[${text1}]>`;
    }

const box = document.getElementById("textBox1");
box.addEventListener("keydown", (e) => {  // キー入力をブロック
  if(["<", ">", "[", "]"].includes(e.key)){
    e.preventDefault();
  }
});
box.addEventListener("input", () => {  // まとめて除去
  box.value = box.value.replace(/[<>\[\]]/g, "");
});


function splitLogs(text){
  return text.match(/<[^>]*>/g) || [];
}

function parseLog(log){
  const result = {};
  const inside = log.slice(1, -1);
  const parts = inside.split("]");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (part === "") continue;

    const keyValue = part.split("[");
    const key = keyValue[0];
    const value = keyValue[1];

    result[key] = value;
  }
  return result;
}

function toHHMM(timeString) {
  const d = new Date(timeString); // 文字列 → Date に変換
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function toYYYYMMDD(dateString) {
  const d = new Date(dateString);
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day   = String(d.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

function getScrollPercentage(){
    const currentScroll = window.scrollY;                      // A. 現在のスクロール位置（上端からの距離）
    const fullHeight = document.documentElement.scrollHeight;  // B. ページのコンテンツ全体の高さ
    const viewportHeight = window.innerHeight;                 // C. ブラウザのビューポート（表示領域）の高さ
    // ----------------------------------------------------
    // 2. スクロール可能な最大の距離を計算   ページ全長から表示領域の分を引く
    const maxScrollDistance = fullHeight - viewportHeight;
    // 最大距離が0の場合は、スクロールできない（ページが短い）ため0%を返す
    if (maxScrollDistance === 0) {
        return 0;
    }
    // ----------------------------------------------------
    // 3. 相対値（%）を計算し、小数点以下を丸める
    const scrollPercentage = (currentScroll / maxScrollDistance) * 100;
    // 0〜100の間に収まるように調整（念のため）
    return Math.min(100, Math.max(0, scrollPercentage));
}
    
function autoScrollValue(){
    const currentScroll = window.scrollY;
    const fullHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const ScrollDistance = (fullHeight - viewportHeight) - currentScroll;
    if(100 < ScrollDistance){
      return 0;
    }else{
      return 1;
    }
}

const msg1 = document.getElementById("new-msg");
function new_msg(text){
  msg1.textContent = text;
  msg1.classList.add("show");
  /* 1.5秒後にフェードアウト
  setTimeout(() => {
    msg1.classList.remove("show");
  }, 1500);
  */
}

function diffSeconds(get_old_date) {
  const oldTime = new Date(get_old_date).getTime();  // 過去の時刻（ミリ秒）
  const nowTime = Date.now();                    // 現在の時刻（ミリ秒）
  const diffMs = nowTime - oldTime;              // ミリ秒差
  return Math.floor(diffMs / 1000);              // 秒に変換
}
    
var old_content = 0;
var new_content = 0;
var old_mess_date = "";
var new_mess_date = "";
var new_message = 0;
var renew_time = 0;
async function page_update(){
  const res = await fetch(WEB_APP_URL);
  const data = await res.json();
  const text1 = data.content;

  // ① 文字列をログごとに配列へ
  const logs = splitLogs(text1);

  // ② それぞれのログをパース → 多次元配列へ
  const message2 = logs.map(log => {
    const p = parseLog(log);
    return [ p.type, p.acco, p.time, p.val1 ];
  });

  // ③ 出力
  renew_time = new Date();
  old_content = new_content;
  new_content = message2.length;
  if(old_content != new_content){
    const auto_scroll = autoScrollValue();
    for(let i = old_content; i < message2.length; i++){
      if((message2[i][0] == "message") || (message2[i][0] == "emoji") || (message2[i][0] == "stamp") || (message2[i][0] == "gif")){
        old_mess_date = new_mess_date;
        new_mess_date = toYYYYMMDD(message2[i][2]);
        if(old_mess_date != new_mess_date){
          addDatePill(new_mess_date);
        }
        if(message2[i][1] == token3){
          /*
          const msgTime = new Date(message2[i][2]).getTime();
          const readCount = getReadCountExcludingMe(msgTime);
          console.log("既読", readCount, "人");
          */
          addMessage_sent(message2[i][0], toHHMM(message2[i][2]), message2[i][3], message2[i][2]); //type time value rawTime
        }else{
          addMessage_received(message2[i][1], message2[i][0], toHHMM(message2[i][2]), message2[i][3]); //user type time value
          if((!auto_scroll) && (!new_message)){
            new_message = 1;
            new_msg("新規メッセージ");
          }
        }
      }
    }
    if(auto_scroll){
      scrollToBottom();
    }
  }
document.querySelectorAll(".message.sent").forEach(msg => {
  const raw = msg.dataset.time;
  if(!raw) return;

  const msgTime = new Date(raw).getTime();
  const count = getReadCountExcludingMe(msgTime);

  const badge = msg.querySelector(".read-status");
  if(badge){
    badge.textContent = count > 0 ? `既読 ${count}` : "";
  }
});
}

const bottomBtn = document.getElementById("bottomBtn");
let ticking = false;
window.addEventListener("scroll", () => {
  if(!ticking){
    window.requestAnimationFrame(() => {
      if((autoScrollValue()) && (new_message)){
        msg1.classList.remove("show");
        new_message = 0;
      }
      if(autoScrollValue()){
        bottomBtn.classList.add("hide"); // 隠す
      }else{
        bottomBtn.classList.remove("hide"); // 表示
      }
      ticking = false;
    });
    ticking = true;
  }
});

    
var timer1 = null;
var update_rate = 1000;
function event1() {
  page_update();
}
timer1 = setInterval(event1, update_rate);
function rate_change(){
  if(update_rate === 1000) {
    document.querySelector(".icon-right").style.backgroundColor = "#7dd6ff";
    update_rate = 5000;
  }else{
    document.querySelector(".icon-right").style.backgroundColor = "#000000";
    update_rate = 1000;
  }
  clearInterval(timer1);
  timer1 = setInterval(event1, update_rate);
}

var timer2 = null;
function event2(){
  if(renew_time != 0){
    if(diffSeconds(renew_time) < 60){
      document.getElementById("last-change-time").innerHTML = "最終更新: " + diffSeconds(renew_time) + "秒前";
    }else{
      document.getElementById("last-change-time").innerHTML = "最終更新: " + toHHMM(renew_time);
    }
  }
}timer2 = setInterval(event2, 200);

setInterval(() => {
  sendToGAS(token3, "", "chat");
  fetchLastLoginData();
}, 5000);

// ユーザーごとの状態を保持する多次元構造
let userPresenceMap = {};
async function fetchLastLoginData(){
  try{
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();
    if(data.status !== "ok") return;
    parsePresenceData(data.users);
  }catch(err){
    console.error("fetch error", err);
  }
}

function parsePresenceData(users){
  const now = Date.now();
  userPresenceMap = {};
  for(const username in users){
    const u = users[username];
    const chatSeen = u.lastSeenByStatus?.chat || 0;
    userPresenceMap[username] = {
      name: username,
      status: u.status,
      lastSeen: u.lastSeen,
      chatSeen: chatSeen,       // ← 追加（既読用）
      isOnline: (now - u.lastSeen) < 30000
    };
  }
  renderPresencePanel();
}

function getPresenceArray(){
  return Object.values(userPresenceMap);
}

const presencePanel = document.getElementById("presencePanel");
function renderPresencePanel(){
  presencePanel.innerHTML = "";
  const users = getSortedPresenceArray();
  for (const u of users) {
    // アイコン未定義のユーザーは描画しない
    if (!userIcons[u.name]) continue;
    const icon = document.createElement("div");
    icon.className = "presence-user";
    icon.style.backgroundImage =
      `url('${userIcons[u.name]}')`;
    icon.dataset.user = u.name;
    icon.addEventListener("click", onUserIconClick);
    const status = document.createElement("div");
    status.className = "presence-status " + getStatusClass(u);
    icon.appendChild(status);
    presencePanel.appendChild(icon);
  }
}


function getStatusClass(u){
  if(!u.isOnline) return "status-offline";
  switch(u.status){
    case "chat":   return "status-chat";
    case "page":   return "status-play";
    case "topic":  return "status-online";
    case "top":    return "status-online";
    case "info":   return "status-online";
    case "online": return "status-online";
    case "idle":   return "status-idle";
    default:       return "status-online";
  }
}

function getSortedPresenceArray(){
  return Object.values(userPresenceMap).sort((a, b) => {
    // ① オンライン優先
    if (a.isOnline !== b.isOnline) {
      return b.isOnline - a.isOnline;
    }
    // ② status 優先度
    const statusPriority = {
      chat: 5,
      page: 4,
      topic: 3,
      top: 3,
      info: 3,
      online: 2,
      idle: 1,
      offline: 0
    };
    const sa = statusPriority[a.status] ?? 0;
    const sb = statusPriority[b.status] ?? 0;
    if (sa !== sb) {
      return sb - sa;
    }
    // ③ 最終アクティブが新しい順
    return b.lastSeen - a.lastSeen;
  });
}


const statusMessageMap = {
  chat:    "チャット中",
  page:    "ゲーム中",
  topic:   "オンライン",
  top:     "オンライン",
  info:    "オンライン",
  online:  "オンライン",
  idle:    "離席中",
  offline: "オフライン"
};
//プロフィールクリックイベント
function onUserIconClick(e){
  e.stopPropagation(); // パネル外クリックと競合させない
  const username = e.currentTarget.dataset.user;
  const userData = userPresenceMap[username];
  if(!userData) return;
  openProfileModal(username, userData);
}

const profileModal = document.getElementById("profileModal");
function openProfileModal(username, u){
  document.getElementById("profileIcon").style.backgroundImage =
    `url('${userIcons[username] || userIcons.default}')`;
  document.getElementById("profileName").textContent = username;
  const statusKey = u.isOnline ? u.status : "offline";
  document.getElementById("profileStatus").textContent = statusMessageMap[statusKey] || "不明な状態";
//document.getElementById("profileLastSeen").textContent = "Last seen: " + new Date(u.lastSeen).toLocaleString();
  profileModal.classList.add("show");
}

function closeProfileModal(){
  profileModal.classList.remove("show");
}

profileModal.addEventListener("click", e => {
  if(e.target === profileModal){
    closeProfileModal();
  }
});

function getReadUsersForMessage(msgTime){
  const readers = [];
  for(const username in userPresenceMap){
    const u = userPresenceMap[username];
    if(!u.chatSeen) continue; // 一度もchatを開いてない
    if(msgTime <= u.chatSeen){
      readers.push(username);
    }
  }
  return readers;
}


function getReadCountExcludingMe(msgTime){
  const readers = getReadUsersForMessage(msgTime);
  return readers.filter(u => u !== token3).length;
}


  const urlParams = new URLSearchParams(location.search);
  const token1 = urlParams.get("key1");
  const token3 = localStorage.getItem("account1");
  localStorage.setItem("account1", "");
  if((token1 !== localStorage.getItem("key1")) || (token3 == null)){
    localStorage.setItem("key1", "unauthorized");
    localStorage.setItem("requestPage1", "chat/chat0001/chat0001-3");
    location.href = "/game-sites/";
  }else{
    localStorage.setItem("key1", "");
    localStorage.setItem("requestPage1", "");
    send_login();
  }

  function reload(){
    const key1 = crypto.randomUUID();
    localStorage.setItem("key1", key1);
    localStorage.setItem("account1", token3);
    location.href = "/game-sites/chat/chat0001/chat0001-3?key1=" + key1;
  }
  function backPage(){
    const key1 = crypto.randomUUID();
    localStorage.setItem("key1", key1);
    localStorage.setItem("account1", token3);
    location.href = "/game-sites/top/top0001/top0001?key1=" + key1;
  }
