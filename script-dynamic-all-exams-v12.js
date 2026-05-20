const questions = [];

const sitePasswordHash = "69ba727f4ea30163a7d6b2a9045da29cdfd1671ec6cb0f8375bdd645ea572518";
const hanVietSourceUrl = "https://dahlia.github.io/unihan-json/12.1.0/kVietnamese.json";
let hanVietMap = {};

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function unlockSite() {
  document.body.classList.remove("locked");
  sessionStorage.setItem("tiengNhatVaKeToanUnlocked", "1");
}

function updateExamCountdown() {
  const value = document.querySelector("#examCountdownValue");
  const label = document.querySelector("#examCountdownLabel");
  if (!value || !label) return;
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const examDate = new Date(2026, 6, 5);
  const daysLeft = Math.ceil((examDate - localToday) / 86400000);

  if (daysLeft > 0) {
    value.textContent = String(daysLeft);
    label.textContent = "ngày tới JLPT 5/7";
    return;
  }

  if (daysLeft === 0) {
    value.textContent = "Hôm nay";
    label.textContent = "thi JLPT 5/7";
    return;
  }

  value.textContent = "Đã qua";
  label.textContent = "JLPT 5/7/2026";
}

function setupAuthGate() {
  const form = document.querySelector("#authForm");
  const input = document.querySelector("#sitePassword");
  const error = document.querySelector("#authError");

  if (sessionStorage.getItem("tiengNhatVaKeToanUnlocked") === "1") {
    unlockSite();
    return;
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const typedHash = await sha256Hex(input.value.trim());
    if (typedHash === sitePasswordHash) {
      unlockSite();
      input.value = "";
      error.hidden = true;
      return;
    }

    error.hidden = false;
    input.select();
  });
}

setupAuthGate();
updateExamCountdown();

function q(type, label, prompt, options, answer, explanation, passageText = "", htmlPrompt = "", meta = {}) {
  return {
    type,
    label,
    prompt,
    htmlPrompt,
    options,
    answer,
    explanation,
    passage: passageText,
    folder: type.startsWith("exam-") || type.startsWith("boki-") ? type : "",
    skill: skillFromLabel(label),
    ...meta,
  };
}

function skillFromLabel(label) {
  if (label.includes("Từ vựng")) return "vocab";
  if (label.includes("Ngữ pháp")) return "grammar";
  if (label.includes("Đọc hiểu")) return "reading";
  return "";
}


const examDataVersion = 5;
const remoteExams = [
  { path: "exam-202512.json", id: "exam-2025-12", title: "2025 tháng 12" },
  { path: "exam-202507.json", id: "exam-2025-07", title: "2025 tháng 7" },
  { path: "exam-202412.json", id: "exam-2024-12", title: "2024 tháng 12" },
  { path: "exam-202407.json", id: "exam-2024-07", title: "2024 tháng 7" },
  { path: "exam-202312.json", id: "exam-2023-12", title: "2023 tháng 12" },
  { path: "exam-202307.json", id: "exam-2023-07", title: "2023 tháng 7" },
  { path: "exam-202212.json", id: "exam-2022-12", title: "2022 tháng 12" },
  { path: "exam-202207.json", id: "exam-2022-07", title: "2022 tháng 7" },
  { path: "exam-202112.json", id: "exam-2021-12", title: "2021 tháng 12" },
  { path: "exam-202107.json", id: "exam-2021-07", title: "2021 tháng 7" },
  { path: "exam-202012.json", id: "exam-2020-12", title: "2020 tháng 12" },
  { path: "exam-201912.json", id: "exam-2019-12", title: "2019 tháng 12" },
  { path: "exam-201907.json", id: "exam-2019-07", title: "2019 tháng 7" },
  { path: "exam-201812.json", id: "exam-2018-12", title: "2018 tháng 12" },
  { path: "exam-201807.json", id: "exam-2018-07", title: "2018 tháng 7" },
  { path: "exam-201712.json", id: "exam-2017-12", title: "2017 tháng 12" },
  { path: "exam-201707.json", id: "exam-2017-07", title: "2017 tháng 7" },
  { path: "exam-201612.json", id: "exam-2016-12", title: "2016 tháng 12" },
  { path: "exam-201607.json", id: "exam-2016-07", title: "2016 tháng 7" },
  { path: "exam-201512.json", id: "exam-2015-12", title: "2015 tháng 12" },
  { path: "exam-201507.json", id: "exam-2015-07", title: "2015 tháng 7" },
  { path: "exam-201412.json", id: "exam-2014-12", title: "2014 tháng 12" },
  { path: "exam-201407.json", id: "exam-2014-07", title: "2014 tháng 7" },
  { path: "exam-201312.json", id: "exam-2013-12", title: "2013 tháng 12" },
  { path: "exam-201307.json", id: "exam-2013-07", title: "2013 tháng 7" },
  { path: "exam-201212.json", id: "exam-2012-12", title: "2012 tháng 12" },
  { path: "exam-201207.json", id: "exam-2012-07", title: "2012 tháng 7" },
  { path: "exam-201112.json", id: "exam-2011-12", title: "2011 tháng 12" },
  { path: "exam-201107.json", id: "exam-2011-07", title: "2011 tháng 7" },
  { path: "exam-201012.json", id: "exam-2010-12", title: "2010 tháng 12" },
  { path: "exam-201007.json", id: "exam-2010-07", title: "2010 tháng 7" },
];

const examFolders = [
  { id: "exam-2025-12", title: "2025 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2025-07", title: "2025 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2024-12", title: "2024 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2024-07", title: "2024 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2023-12", title: "2023 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2023-07", title: "2023 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2022-12", title: "2022 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2022-07", title: "2022 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2021-12", title: "2021 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2021-07", title: "2021 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2020-12", title: "2020 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2019-12", title: "2019 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2019-07", title: "2019 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2018-12", title: "2018 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2018-07", title: "2018 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2017-12", title: "2017 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2017-07", title: "2017 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2016-12", title: "2016 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2016-07", title: "2016 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2015-12", title: "2015 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2015-07", title: "2015 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2014-12", title: "2014 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2014-07", title: "2014 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2013-12", title: "2013 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2013-07", title: "2013 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2012-12", title: "2012 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2012-07", title: "2012 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2011-12", title: "2011 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2011-07", title: "2011 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2010-12", title: "2010 tháng 12", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
  { id: "exam-2010-07", title: "2010 tháng 7", subtitle: "Đề JLPT N1 - 文字・語彙, 文法, 読解" },
];


const state = {
  index: 0,
  filter: "all",
  answered: Number(localStorage.getItem("n1Answered") || 0),
  correct: Number(localStorage.getItem("n1Correct") || 0),
  streak: Number(localStorage.getItem("n1Streak") || 0),
  selectedByPrompt: JSON.parse(localStorage.getItem("n1Selections") || "{}"),
  loading: true,
  deckType: "vocab",
  deckIndex: 0,
  deckOpen: false,
};

const bokiFolders = [
  {
    id: "boki-3kyu-excel-01",
    title: "Boki 3級 - Excel đề 1",
    subtitle: "問題1: 仕訳15問 / 問題2: 2問 / 問題3: 27問",
  },
];

const bokiOfficialQuestions = [
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-1. 得意先広島株式会社に対する売掛金￥500,000のうち、￥300,000は郵便為替証書で、￥160,000は同社振出の小切手で受け取った。なお、残額￥40,000については、以前に返品を受けていたが未処理であった。", ["答え・解説を見る"], 0, "答え: 借方 現金 460,000 / 借方 売上 40,000 / 貸方 売掛金 500,000。\nGiải thích: 郵便為替証書 và 小切手 người khác phát hành đều xử lý như 現金. Phần返品 chưa xử lý làm giảm 売上, đồng thời xóa toàn bộ 売掛金 500,000."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-2. 福岡株式会社から掛けで仕入れた商品￥170,000のうち、￥40,000分を品違いのため返品した。なお、返品額は掛代金から控除すること。", ["答え・解説を見る"], 0, "答え: 借方 買掛金 40,000 / 貸方 仕入 40,000。\nGiải thích: Trả lại hàng mua chịu thì giảm khoản phải trả 買掛金 và giảm 仕入 theo phương pháp 3 phân pháp."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-3. 電子記録債務￥760,000の支払期日が到来し、普通預金口座より引き落とされた旨の連絡を受けた。", ["答え・解説を見る"], 0, "答え: 借方 電子記録債務 760,000 / 貸方 普通預金 760,000。\nGiải thích: Đến hạn thanh toán 電子記録債務 nên nợ phải trả giảm bên Nợ, tiền gửi ngân hàng giảm bên Có."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-4. 商品￥20,000を売り上げ、代金のうち￥10,000は現金で受け取り、残額は掛けとした取引について、入金伝票を次のように作成したとき、振替伝票に記入される仕訳を答えなさい。なお、３伝票制を採用しており、商品売買の記帳は３分法によっている。", ["答え・解説を見る"], 0, "答え: 借方 売掛金 10,000 / 貸方 売上 10,000。\nGiải thích: 入金伝票 đã ghi phần thu tiền mặt 10,000. 振替伝票 chỉ ghi phần còn lại bán chịu: 売掛金 tăng và 売上 tăng 10,000.", "", '<div>問題1-4. 商品￥20,000を売り上げ、代金のうち￥10,000は現金で受け取り、残額は掛けとした取引について、入金伝票を次のように作成したとき、振替伝票に記入される仕訳を答えなさい。</div><img class="boki-source-image" src="./boki_excel_images/image_00_r7_c2.png" alt="入金伝票">'),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-5. ×1年４月１日に利率年0.02％、利息は満期日（×2年３月31日）に受け取る条件で東西銀行に預け入れた１年ものの定期預金￥5,000,000について、本日、満期となったため、元金と利息の合計を東西銀行の普通預金口座に預け替えた。", ["答え・解説を見る"], 0, "答え: 借方 普通預金 5,001,000 / 貸方 定期預金 5,000,000 / 貸方 受取利息 1,000。\nGiải thích: Lãi = 5,000,000 × 0.02% = 1,000. Đáo hạn nên chuyển cả gốc và lãi sang 普通預金."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-6. 当期に得意先静岡株式会社に商品を売り上げたことで発生した売掛金￥146,000が貸し倒れた。なお、貸倒引当金の残高は￥700,000ある。", ["答え・解説を見る"], 0, "答え: 借方 貸倒損失 146,000 / 貸方 売掛金 146,000。\nGiải thích: Đây là 売掛金 phát sinh trong kỳ hiện tại, nên khi mất khả năng thu hồi thì dùng 貸倒損失, không dùng 貸倒引当金 của kỳ trước."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-7. ７月７日、本年度の雇用保険料（概算）￥123,000を現金で一括納付した。このうち会社負担分は、￥63,000であり、残額は従業員負担分である。従業員負担分は、４〜６月分については過去の給料から月額を差し引いているため、これを充当するが、７月以降の９か月分は会社が概算で立て替えて支払う。", ["答え・解説を見る"], 0, "答え: 借方 法定福利費 63,000 / 借方 預り金 15,000 / 借方 立替金 45,000 / 貸方 現金 123,000。\nGiải thích: Công ty chịu 63,000 là 法定福利費. Phần nhân viên 60,000 chia 12 tháng = 5,000/tháng; 4-6月 đã trừ lương nên xóa 預り金 15,000, 7月以降 9 tháng là công ty tạm ứng hộ 45,000."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-8. 香川株式会社は、先月開催された株主総会で承認されていた株主への配当金￥360,000を当座預金口座から支払った。", ["答え・解説を見る"], 0, "答え: 借方 未払配当金 360,000 / 貸方 当座預金 360,000。\nGiải thích: Cổ tức đã được phê duyệt trước đó nên khi trả tiền thì giảm 未払配当金 và giảm 当座預金."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-9. 関東商工銀行から￥1,200,000を借り入れ、約束手形を振り出した。これにともない借入期間の利息（日割計算）があらかじめ控除された金額が、当座預金口座に振り込まれた。なお、この借入金の借入期間は73日、利率は年３％である。なお、１年は365日とする。", ["答え・解説を見る"], 0, "答え: 借方 当座預金 1,192,800 / 借方 支払利息 7,200 / 貸方 手形借入金 1,200,000。\nGiải thích: Lãi bị trừ trước = 1,200,000 × 3% × 73/365 = 7,200. Số thực nhận vào 当座預金 là 1,192,800; nợ theo giấy hẹn là 手形借入金 1,200,000."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-10. 期首に、前期末に費用勘定から貯蔵品勘定に振り替えた収入印紙￥6,500について、適切な勘定科目に振り戻した。", ["答え・解説を見る"], 0, "答え: 借方 租税公課 6,500 / 貸方 貯蔵品 6,500。\nGiải thích: 収入印紙未使用分 đã chuyển sang 貯蔵品 ở cuối kỳ trước. Đầu kỳ đảo lại về chi phí 租税公課."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-11. 出張から戻った従業員から、旅費交通費として計￥39,000を支払ったとの報告書および領収書を受け取った。なお、従業員が出張へ出発する前に概算払いしていた￥50,000と支出額との差額は現金で受け取った。", ["答え・解説を見る"], 0, "答え: 借方 旅費交通費 39,000 / 借方 現金 11,000 / 貸方 仮払金 50,000。\nGiải thích: Tạm ứng trước là 仮払金. Khi quyết toán, chi phí thực tế 39,000 chuyển sang 旅費交通費, phần thừa 11,000 nhận lại bằng 現金."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-12. 事務所備品（取得日：×2年７月１日、取得原価：￥500,000、残存価額：ゼロ、耐用年数10年）を、×9年度期首に￥150,000で売却し、代金の全額が甲銀行の普通預金口座に振り込まれた。減価償却費は定額法で計算し、記帳は間接法を用いている。なお、決算日は３月31日である。", ["答え・解説を見る"], 0, "答え: 借方 普通預金 150,000 / 借方 減価償却累計額 337,500 / 借方 固定資産売却損 12,500 / 貸方 備品 500,000。\nGiải thích: Khấu hao lũy kế = 500,000/10年 × 6年9か月 = 337,500. Giá trị còn lại 162,500, bán 150,000 nên lỗ 12,500."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-13. 京都株式会社は、事務所として利用する目的でビルの１フロアについて賃借契約を締結した。なお、事務所を借り入れた際に敷金￥300,000、２か月分の家賃￥400,000及び仲介手数料￥150,000を普通預金口座から支払った。", ["答え・解説を見る"], 0, "答え: 借方 差入保証金 300,000 / 借方 支払家賃 400,000 / 借方 支払手数料 150,000 / 貸方 普通預金 850,000。\nGiải thích: 敷金 là tài sản ký quỹ 差入保証金. 家賃 và 仲介手数料 là chi phí, tất cả thanh toán bằng 普通預金."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-14. 決算につき、郵便切手の未使用分￥80,000と収入印紙の未使用分￥20,000を貯蔵品勘定へ振り替えた。", ["答え・解説を見る"], 0, "答え: 借方 貯蔵品 100,000 / 貸方 通信費 80,000 / 貸方 租税公課 20,000。\nGiải thích: Tem bưu chính chưa dùng thường đã ghi 通信費,収入印紙 chưa dùng đã ghi 租税公課. Cuối kỳ chuyển phần chưa dùng sang 貯蔵品."),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 1 仕訳", "問題1-15. 事務作業に使用するため、下記の物品を購入し、物品とともに次の請求書を受け取った。", ["答え・解説を見る"], 0, "答え: 借方 備品 490,000 / 貸方 未払金 490,000。\nGiải thích: 応接用ソファー là 備品. 据付費用 và 送料 là chi phí phụ thuộc để đưa tài sản vào trạng thái sử dụng, nên cộng vào nguyên giá 備品: 480,000 + 3,500 + 6,500 = 490,000. Chưa trả ngay nên ghi 未払金.", "", '<div>問題1-15. 事務作業に使用するため、下記の物品を購入し、物品とともに次の請求書を受け取った。</div><img class="boki-source-image" src="./boki_excel_images/image_01_r44_c1.png" alt="請求書">'),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 2", "問題2-1. 次に示す備品の固定資産台帳により、備品勘定、減価償却累計額勘定と減価償却費勘定の記入を示しなさい。", ["答え・解説を見る"], 0, "答え: 備品勘定は前期繰越 6,037,000、現金 3,156,000、次期繰越 9,193,000。減価償却累計額は前期繰越 1,850,000、減価償却費 1,539,000、次期繰越 3,389,000。減価償却費は借方 1,539,000、損益へ振替 1,539,000。\nGiải thích: 台帳の小計から取得原価合計 9,193,000、期首累計 1,850,000、当期減価償却費 1,539,000 を読み取る。備品Cは期中取得なので備品勘定の借方に追加する。", "ただし、勘定科目等はプルダウンから最も適当と思われるものを選び、選択しなさい。備品は残存価額ゼロの定額法にもとづき減価償却が行われており、減価償却費は月割計算によって決算時に一括計上している。なお、会計期間は×8年4月1日から×9年3月31日までの1年間である。\n\n固定資産台帳［×9年3月31日現在］（単位：円）\n取得年月日 / 名称 / 期末数量 / 耐用年数 / 期首（期中取得）取得原価 / 期首減価償却累計額 / 差引期首（期中取得）帳簿価額 / 当期減価償却費\n×4年9月20日 / A / 1 / 8年 / 2,592,000 / 1,161,000 / 1,431,000 / 324,000\n×7年4月1日 / B / 1 / 5年 / 3,445,000 / 689,000 / 2,756,000 / 689,000\n×8年10月12日 / C / 2 / 3年 / 3,156,000 / 0 / 3,156,000 / 526,000\n小計 /  /  /  / 9,193,000 / 1,850,000 / 7,343,000 / 1,539,000\n\n記入対象: 備品勘定、減価償却累計額勘定、減価償却費勘定。"),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 2", "問題2-2. 次の文章の（①）から（④）にあてはまる最も適切な語句を選択しなさい。", ["答え・解説を見る"], 0, "答え: ① 未払金、② 含める、③ 資本的支出、④ 収益的支出。\nGiải thích: Mua TSCĐ trả sau phát sinh 未払金. Chi phí phụ thuộc để đưa tài sản vào sử dụng được 含める vào nguyên giá. Chi làm tăng giá trị/kéo dài thời gian sử dụng là 資本的支出; chi sửa chữa, bảo trì thông thường là 収益的支出.", "1. 有形固定資産を取得した際に、代金をあとで支払うときに生じる債務のことを（①）という。また有形固定資産の取得代金には、付随費用を（②）。\n\n2. 有形固定資産の価値の増加や使用可能年数が延長されるような支出のことを（③）といい、修繕や保守にかかる支出のことを（④）という。\n\n選択肢: 資本的支出、商品有高帳、未払金、含める、収益的支出、固定資産台帳、売掛金、未収入金、減価償却費、含めない。"),
  q("boki-3kyu-excel-01", "Boki 3級 Excel đề 1 - Mon 3", "問題3. 次の決算整理前残高試算表と決算整理事項等にもとづいて、損益計算書と貸借対照表を完成しなさい。", ["答え・解説を見る"], 0, "答え: 損益計算書: 売上原価 5,759,000、受取手数料 998,000、支払家賃 1,800,000、貸倒引当金繰入 45,000、減価償却費 133,400、支払利息 216,000、法人税等 290,000、当期純利益 1,344,600。\n貸借対照表: 現金 6,750,000、当座預金 6,480,000、受取手形 1,050,000、貸倒引当金 △31,500、売掛金 1,270,000、貸倒引当金 △38,100、商品 1,420,000、前払費用 450,000、未収収益 50,000、建物 4,820,000、建物減価償却累計額 △773,400、備品 200,000、備品減価償却累計額 △199,999、未払費用 144,000、未払法人税等 150,000、繰越利益剰余金 6,463,001。\nGiải thích: Làm theo thứ tự: sửa sai 未収入金/現金, ghi nhận 建物 chưa xử lý, tính 貸倒引当金 3%, đổi 期末商品 sang 商品, tính 減価償却, ghi 未収収益・前払費用・未払費用, rồi tính thuế và lợi nhuận.", "", '<div>問題3. 次の決算整理前残高試算表と決算整理事項等にもとづいて、損益計算書と貸借対照表を完成しなさい。</div><img class="boki-source-image" src="./boki_excel_images/image_02_r194_c1.png" alt="決算整理前残高試算表と決算整理事項">')
];

const bokiMon3PromptImage = '<div>問題3. 次の決算整理前残高試算表と決算整理事項等にもとづいて、損益計算書と貸借対照表を完成しなさい。</div><img class="boki-source-image" src="./boki_excel_images/image_02_r194_c1.png" alt="決算整理前残高試算表と決算整理事項">';

function bokiMon3Fill(section, item, answer, distractors, explanation) {
  return q(
    "boki-3kyu-excel-01",
    `Boki 3級 Excel đề 1 - Mon 3 ${section}`,
    `問題3-${section}. ${item}に入る金額を選びなさい。`,
    [answer, ...distractors],
    0,
    `答え: ${item} ${answer}。\nGiải thích: ${explanation}`,
    "",
    bokiMon3PromptImage
  );
}

const bokiMon3Questions = [
  bokiMon3Fill("損益計算書", "売上原価", "5,759,000", ["5,690,000", "6,500,000", "6,259,000"], "期首商品 679,000 + 仕入 6,500,000 - 期末商品 1,420,000 = 5,759,000."),
  bokiMon3Fill("損益計算書", "受取手数料", "998,000", ["948,000", "898,000", "1,048,000"], "試算表 948,000 に未収分 50,000 を加える。"),
  bokiMon3Fill("損益計算書", "支払家賃", "1,800,000", ["2,250,000", "1,350,000", "450,000"], "翌期分3か月分450,000を前払費用にするため、試算表2,250,000から450,000を差し引く。"),
  bokiMon3Fill("損益計算書", "貸倒引当金繰入", "45,000", ["24,600", "69,600", "20,400"], "売上債権の期末残高に3%を設定し、既存の貸倒引当金との差額を繰り入れる。"),
  bokiMon3Fill("損益計算書", "減価償却費", "133,400", ["199,999", "197,200", "64,800"], "建物は既存分と3月取得分を定額法で計算し、備品は当期の減価償却不要。"),
  bokiMon3Fill("損益計算書", "支払利息", "216,000", ["72,000", "144,000", "288,000"], "試算表の72,000に、8月1日から3月31日までの未払利息144,000を加える。"),
  bokiMon3Fill("損益計算書", "法人税、住民税及び事業税", "290,000", ["150,000", "140,000", "430,000"], "当期税額として算定された290,000を費用にする。仮払分との差額は未払法人税等。"),
  bokiMon3Fill("損益計算書", "当期純利益", "1,344,600", ["1,494,600", "1,794,600", "1,210,200"], "収益合計10,888,000から費用合計9,543,400を差し引く。"),
  bokiMon3Fill("貸借対照表", "現金", "6,750,000", ["7,000,000", "7,250,000", "6,500,000"], "自己振出小切手で回収した分250,000は当座預金で処理すべきため、誤って増やした現金を減らす。"),
  bokiMon3Fill("貸借対照表", "普通預金", "3,990,000", ["6,480,000", "7,850,000", "2,370,000"], "普通預金は決算整理事項の影響を受けないため試算表残高のまま。"),
  bokiMon3Fill("貸借対照表", "当座預金", "6,480,000", ["7,850,000", "8,100,000", "6,230,000"], "自己振出小切手回収で250,000増え、建物購入の小切手振出で1,620,000減る。"),
  bokiMon3Fill("貸借対照表", "受取手形", "1,050,000", ["1,018,500", "1,081,500", "1,270,000"], "受取手形の残高自体は試算表の1,050,000。ここから貸倒引当金を控除表示する。"),
  bokiMon3Fill("貸借対照表", "受取手形に対する貸倒引当金", "31,500", ["38,100", "24,600", "45,000"], "受取手形 1,050,000 × 3% = 31,500。"),
  bokiMon3Fill("貸借対照表", "受取手形の差引額", "1,018,500", ["1,050,000", "1,011,900", "1,231,900"], "受取手形 1,050,000 - 貸倒引当金 31,500 = 1,018,500。"),
  bokiMon3Fill("貸借対照表", "売掛金", "1,270,000", ["1,520,000", "1,231,900", "1,300,000"], "未収入金250,000は当座預金回収なので売掛金ではない。売掛金は試算表残高1,520,000から調整後1,270,000。"),
  bokiMon3Fill("貸借対照表", "売掛金に対する貸倒引当金", "38,100", ["31,500", "45,000", "24,600"], "売掛金 1,270,000 × 3% = 38,100。"),
  bokiMon3Fill("貸借対照表", "売掛金の差引額", "1,231,900", ["1,270,000", "1,018,500", "1,481,900"], "売掛金 1,270,000 - 貸倒引当金 38,100 = 1,231,900。"),
  bokiMon3Fill("貸借対照表", "商品", "1,420,000", ["679,000", "5,759,000", "6,500,000"], "期末棚卸高が貸借対照表の商品になる。"),
  bokiMon3Fill("貸借対照表", "前払費用", "450,000", ["1,800,000", "2,250,000", "0"], "翌期分の家賃3か月分を前払費用に振り替える。"),
  bokiMon3Fill("貸借対照表", "未収収益", "50,000", ["948,000", "998,000", "0"], "手数料の未収分50,000を未収収益として資産計上する。"),
  bokiMon3Fill("貸借対照表", "建物", "4,820,000", ["3,200,000", "1,620,000", "4,046,600"], "試算表の建物3,200,000に、未処理の建物購入1,620,000を加える。"),
  bokiMon3Fill("貸借対照表", "建物減価償却累計額", "773,400", ["640,000", "133,400", "837,200"], "期首累計640,000に当期の建物減価償却費133,400を加える。"),
  bokiMon3Fill("貸借対照表", "建物の差引額", "4,046,600", ["4,820,000", "4,180,000", "3,862,800"], "建物 4,820,000 - 減価償却累計額 773,400 = 4,046,600。"),
  bokiMon3Fill("貸借対照表", "備品の差引額", "1", ["200,000", "0", "199,999"], "備品200,000から備品減価償却累計額199,999を控除する。"),
  bokiMon3Fill("貸借対照表", "未払費用", "144,000", ["72,000", "216,000", "288,000"], "借入金利息の未払分を負債として計上する。"),
  bokiMon3Fill("貸借対照表", "未払法人税等", "150,000", ["290,000", "140,000", "430,000"], "法人税等290,000から仮払法人税等140,000を差し引く。"),
  bokiMon3Fill("貸借対照表", "繰越利益剰余金", "6,463,001", ["5,118,401", "1,344,600", "6,613,001"], "期首の繰越利益剰余金5,118,401に当期純利益1,344,600を加える。")
];

bokiOfficialQuestions.splice(bokiOfficialQuestions.length - 1, 1, ...bokiMon3Questions);

bokiOfficialQuestions.forEach((question, index) => {
  if (question.label.includes("Mon 3")) {
    question.answer = 0;
    return;
  }

  const choices = [
    [
      "借方 現金 460,000 / 借方 売上 40,000 / 貸方 売掛金 500,000",
      "借方 現金 500,000 / 貸方 売掛金 500,000",
      "借方 現金 460,000 / 借方 仕入 40,000 / 貸方 売掛金 500,000",
      "借方 売掛金 500,000 / 貸方 現金 460,000 / 貸方 売上 40,000",
    ],
    [
      "借方 買掛金 40,000 / 貸方 仕入 40,000",
      "借方 仕入 40,000 / 貸方 買掛金 40,000",
      "借方 売上 40,000 / 貸方 売掛金 40,000",
      "借方 買掛金 170,000 / 貸方 仕入 170,000",
    ],
    [
      "借方 電子記録債務 760,000 / 貸方 普通預金 760,000",
      "借方 普通預金 760,000 / 貸方 電子記録債務 760,000",
      "借方 電子記録債権 760,000 / 貸方 普通預金 760,000",
      "借方 買掛金 760,000 / 貸方 当座預金 760,000",
    ],
    [
      "借方 売掛金 10,000 / 貸方 売上 10,000",
      "借方 現金 10,000 / 貸方 売上 10,000",
      "借方 売掛金 20,000 / 貸方 売上 20,000",
      "借方 売上 10,000 / 貸方 売掛金 10,000",
    ],
    [
      "借方 普通預金 5,001,000 / 貸方 定期預金 5,000,000 / 貸方 受取利息 1,000",
      "借方 普通預金 5,000,000 / 貸方 定期預金 5,000,000",
      "借方 定期預金 5,001,000 / 貸方 普通預金 5,000,000 / 貸方 受取利息 1,000",
      "借方 普通預金 5,001,000 / 貸方 定期預金 5,000,000 / 貸方 支払利息 1,000",
    ],
    [
      "借方 貸倒損失 146,000 / 貸方 売掛金 146,000",
      "借方 貸倒引当金 146,000 / 貸方 売掛金 146,000",
      "借方 売掛金 146,000 / 貸方 貸倒損失 146,000",
      "借方 貸倒損失 146,000 / 貸方 買掛金 146,000",
    ],
    [
      "借方 法定福利費 63,000 / 借方 預り金 15,000 / 借方 立替金 45,000 / 貸方 現金 123,000",
      "借方 法定福利費 123,000 / 貸方 現金 123,000",
      "借方 法定福利費 63,000 / 借方 預り金 60,000 / 貸方 現金 123,000",
      "借方 立替金 123,000 / 貸方 現金 123,000",
    ],
    [
      "借方 未払配当金 360,000 / 貸方 当座預金 360,000",
      "借方 繰越利益剰余金 360,000 / 貸方 当座預金 360,000",
      "借方 配当金 360,000 / 貸方 現金 360,000",
      "借方 当座預金 360,000 / 貸方 未払配当金 360,000",
    ],
    [
      "借方 当座預金 1,192,800 / 借方 支払利息 7,200 / 貸方 手形借入金 1,200,000",
      "借方 当座預金 1,200,000 / 貸方 手形借入金 1,200,000",
      "借方 当座預金 1,192,800 / 借方 受取利息 7,200 / 貸方 手形借入金 1,200,000",
      "借方 普通預金 1,192,800 / 借方 支払利息 7,200 / 貸方 借入金 1,200,000",
    ],
    [
      "借方 租税公課 6,500 / 貸方 貯蔵品 6,500",
      "借方 貯蔵品 6,500 / 貸方 租税公課 6,500",
      "借方 通信費 6,500 / 貸方 貯蔵品 6,500",
      "借方 消耗品費 6,500 / 貸方 貯蔵品 6,500",
    ],
    [
      "借方 旅費交通費 39,000 / 借方 現金 11,000 / 貸方 仮払金 50,000",
      "借方 旅費交通費 50,000 / 貸方 仮払金 50,000",
      "借方 仮払金 50,000 / 貸方 旅費交通費 39,000 / 貸方 現金 11,000",
      "借方 旅費交通費 39,000 / 貸方 現金 39,000",
    ],
    [
      "借方 普通預金 150,000 / 借方 減価償却累計額 337,500 / 借方 固定資産売却損 12,500 / 貸方 備品 500,000",
      "借方 普通預金 150,000 / 借方 減価償却累計額 350,000 / 貸方 備品 500,000",
      "借方 普通預金 150,000 / 借方 固定資産売却損 350,000 / 貸方 備品 500,000",
      "借方 普通預金 150,000 / 借方 減価償却累計額 337,500 / 貸方 備品 487,500",
    ],
    [
      "借方 差入保証金 300,000 / 借方 支払家賃 400,000 / 借方 支払手数料 150,000 / 貸方 普通預金 850,000",
      "借方 支払家賃 850,000 / 貸方 普通預金 850,000",
      "借方 差入保証金 300,000 / 借方 前払費用 400,000 / 借方 支払手数料 150,000 / 貸方 普通預金 850,000",
      "借方 敷金 300,000 / 借方 支払家賃 550,000 / 貸方 普通預金 850,000",
    ],
    [
      "借方 貯蔵品 100,000 / 貸方 通信費 80,000 / 貸方 租税公課 20,000",
      "借方 通信費 80,000 / 借方 租税公課 20,000 / 貸方 貯蔵品 100,000",
      "借方 貯蔵品 100,000 / 貸方 消耗品費 100,000",
      "借方 前払費用 100,000 / 貸方 通信費 80,000 / 貸方 租税公課 20,000",
    ],
    [
      "借方 備品 490,000 / 貸方 未払金 490,000",
      "借方 備品 480,000 / 借方 支払手数料 10,000 / 貸方 未払金 490,000",
      "借方 消耗品費 490,000 / 貸方 未払金 490,000",
      "借方 備品 490,000 / 貸方 買掛金 490,000",
    ],
    [
      "備品: 前期繰越 6,037,000・現金 3,156,000・次期繰越 9,193,000 / 減価償却費 1,539,000",
      "備品: 前期繰越 6,037,000・次期繰越 6,037,000 / 減価償却費 1,539,000",
      "備品: 現金 3,156,000・次期繰越 3,156,000 / 減価償却費 1,850,000",
      "備品: 前期繰越 9,193,000・次期繰越 6,037,000 / 減価償却費 3,389,000",
    ],
    [
      "① 未払金、② 含める、③ 資本的支出、④ 収益的支出",
      "① 買掛金、② 含めない、③ 収益的支出、④ 資本的支出",
      "① 未収入金、② 含める、③ 収益的支出、④ 資本的支出",
      "① 未払金、② 含めない、③ 資本的支出、④ 収益的支出",
    ],
    [
      "売上原価 5,759,000 / 支払家賃 1,800,000 / 減価償却費 133,400 / 当期純利益 1,344,600",
      "売上原価 5,759,000 / 支払家賃 1,350,000 / 減価償却費 133,400 / 当期純利益 1,794,600",
      "売上原価 5,690,000 / 支払家賃 1,800,000 / 減価償却費 199,999 / 当期純利益 1,344,600",
      "売上原価 5,759,000 / 支払家賃 1,800,000 / 減価償却費 133,400 / 当期純損失 1,344,600",
    ],
  ][index];

  question.options = choices;
  question.answer = 0;
});

questions.push(...bokiOfficialQuestions);

const questionType = document.querySelector("#questionType");
const questionText = document.querySelector("#questionText");
const questionCount = document.querySelector("#questionCount");
const passage = document.querySelector("#passage");
const answers = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const questionJump = document.querySelector("#questionJump");
const nextButton = document.querySelector("#nextQuestion");
const prevButton = document.querySelector("#prevQuestion");
const backToFoldersButton = document.querySelector("#backToFolders");
const filters = document.querySelectorAll(".filter[data-filter]");
const folderBackFilter = document.querySelector("#folderBackFilter");
const deckGrid = document.querySelector("#deckGrid");
const quizShell = document.querySelector(".quiz-shell");
const appViews = document.querySelectorAll(".app-view");
const navLinks = document.querySelectorAll(".nav a");
const bokiQuestionType = document.querySelector("#bokiQuestionType");
const bokiQuestionText = document.querySelector("#bokiQuestionText");
const bokiQuestionCount = document.querySelector("#bokiQuestionCount");
const bokiPassage = document.querySelector("#bokiPassage");
const bokiAnswers = document.querySelector("#bokiAnswers");
const bokiFeedback = document.querySelector("#bokiFeedback");
const bokiQuestionJump = document.querySelector("#bokiQuestionJump");
const bokiNextButton = document.querySelector("#bokiNextQuestion");
const bokiPrevButton = document.querySelector("#bokiPrevQuestion");
const bokiBackToFoldersButton = document.querySelector("#bokiBackToFolders");

function currentViewFromHash() {
  const view = window.location.hash.replace("#", "");
  return ["practice", "boki", "deck"].includes(view) ? view : "practice";
}

function showAppView(view = currentViewFromHash()) {
  appViews.forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${view}`);
  });

  if (view === "boki" && !state.filter.startsWith("boki-")) {
    state.filter = "boki-all";
    state.index = 0;
    renderBokiQuestion();
  }

  if (view === "practice" && state.filter?.startsWith("boki-")) {
    state.filter = "all";
    state.index = 0;
    renderQuestion();
  }
}

const kanjiTargets = {
  "exam-2025-12": ["頑丈", "潜んで", "行政", "卓越", "芳しくない", "管轄"],
  "exam-2025-07": ["余暇", "鈍い", "検閲", "崇高", "裁く", "胸中"],
  "exam-2024-12": ["絶叫", "背後", "抱負", "侮って", "筋道", "奔放"],
  "exam-2024-07": ["腐敗", "粗い", "粘膜", "寿命", "戒める", "誓約書"],
  "exam-2023-12": ["軌跡", "偏り", "矛盾", "誇張", "賄って", "軽率"],
  "exam-2023-07": ["騒然", "諭した", "秩序", "潜伏", "朗らかな", "振興"],
  "exam-2016-12": ["人脈", "賢い", "顕著", "多岐", "廃れて", "相場"],
  "exam-2015-12": ["興奮", "唱えた", "変遷", "値する", "随時", "励んで"],
};

const n1Vocabulary = [
  ["絶叫", "ぜっきょう", "hét lớn, la thất thanh"],
  ["背後", "はいご", "phía sau, hậu cảnh"],
  ["背景", "はいけい", "bối cảnh, nền tảng phía sau"],
  ["抱負", "ほうふ", "hoài bão, chí hướng"],
  ["意識", "いしき", "ý thức, cảm nhận, nhận biết"],
  ["侮る", "あなどる", "coi thường, xem nhẹ"],
  ["筋道", "すじみち", "trình tự logic, mạch lý lẽ"],
  ["奔放", "ほんぽう", "phóng khoáng, không gò bó"],
  ["適応", "てきおう", "thích nghi"],
  ["掲げる", "かかげる", "đề ra, nêu lên"],
  ["踏襲", "とうしゅう", "kế thừa, noi theo"],
  ["足止め", "あしどめ", "bị giữ lại, bị kẹt không đi tiếp được"],
  ["払拭", "ふっしょく", "xua tan, quét sạch"],
  ["手腕", "しゅわん", "năng lực xử lý, tài xoay xở"],
  ["ロス", "ロス", "mất mát, lãng phí"],
  ["おろそか", "おろそか", "qua loa, lơ là"],
  ["目下", "もっか", "hiện tại, trước mắt"],
  ["請け負う", "うけおう", "nhận làm, đảm nhận"],
  ["進呈", "しんてい", "kính tặng, biếu"],
  ["加工", "かこう", "gia công, chế biến"],
  ["養う", "やしなう", "nuôi dưỡng"],
  ["資質", "ししつ", "tố chất, phẩm chất"],
  ["正当", "せいとう", "chính đáng, hợp lý"],
  ["ありきたり", "ありきたり", "tầm thường, thường thấy"],
  ["間柄", "あいだがら", "mối quan hệ"],
  ["腐敗", "ふはい", "mục nát, thối rữa; tham nhũng"],
  ["粗い", "あらい", "thô, sơ sài"],
  ["粘膜", "ねんまく", "niêm mạc"],
  ["寿命", "じゅみょう", "tuổi thọ"],
  ["戒める", "いましめる", "răn dạy, cảnh báo"],
  ["誓約書", "せいやくしょ", "bản cam kết"],
  ["軌跡", "きせき", "quỹ tích, dấu vết"],
  ["偏り", "かたより", "thiên lệch"],
  ["矛盾", "むじゅん", "mâu thuẫn"],
  ["誇張", "こちょう", "phóng đại"],
  ["賄う", "まかなう", "trang trải, cung cấp"],
  ["軽率", "けいそつ", "khinh suất"],
  ["騒然", "そうぜん", "náo động, ồn ào"],
  ["諭す", "さとす", "khuyên bảo, giảng giải"],
  ["秩序", "ちつじょ", "trật tự"],
  ["潜伏", "せんぷく", "ẩn náu, tiềm phục"],
  ["朗らか", "ほがらか", "vui vẻ, sáng sủa"],
  ["振興", "しんこう", "chấn hưng, thúc đẩy"],
  ["余暇", "よか", "thời gian rảnh"],
  ["鈍い", "にぶい", "chậm, cùn, kém nhạy"],
  ["検閲", "けんえつ", "kiểm duyệt"],
  ["崇高", "すうこう", "cao cả"],
  ["裁く", "さばく", "xét xử, phán xét"],
  ["胸中", "きょうちゅう", "trong lòng, tâm tư"],
  ["躍進", "やくしん", "tiến bộ/vươn lên vượt bậc"],
  ["遂行", "すいこう", "thực hiện đến cùng"],
  ["凝縮", "ぎょうしゅく", "cô đọng, nén lại"],
  ["健やか", "すこやか", "khỏe mạnh"],
  ["中枢", "ちゅうすう", "trung khu, phần cốt lõi"],
  ["否めない", "いなめない", "không thể phủ nhận"],
  ["支障", "ししょう", "trở ngại, ảnh hưởng xấu"],
  ["おびただしい", "おびただしい", "rất nhiều, vô số"],
  ["絶大", "ぜつだい", "rất lớn, tuyệt đại"],
  ["予断", "よだん", "dự đoán chủ quan, đoán trước"],
  ["手際", "てぎわ", "sự khéo léo, cách xử lý nhanh gọn"],
  ["無償", "むしょう", "miễn phí, không thù lao"],
  ["打ち込む", "うちこむ", "chuyên tâm, dồn sức vào"],
  ["率直", "そっちょく", "thẳng thắn"],
  ["お手上げ", "おてあげ", "bó tay, không còn cách nào"],
  ["格段", "かくだん", "vượt bậc, rõ rệt"],
  ["いたって", "いたって", "rất, cực kỳ"],
  ["一律", "いちりつ", "đồng loạt, như nhau"],
  ["心構え", "こころがまえ", "tâm thế, sự chuẩn bị tinh thần"],
  ["損なう", "そこなう", "làm tổn hại, làm hỏng"],
  ["しがみつく", "しがみつく", "bám chặt, níu chặt"],
  ["工面", "くめん", "xoay xở tiền bạc"],
  ["がやがや", "がやがや", "ồn ào bởi nhiều tiếng nói chuyện"],
  ["じわじわ", "じわじわ", "dần dần, từ từ lan ra"],
  ["どろどろ", "どろどろ", "sền sệt, lầy nhầy; rối rắm"],
  ["べたべた", "べたべた", "dính bết; bám dính khó chịu"],
  ["情報通", "じょうほうつう", "người thạo tin"],
  ["占有率", "せんゆうりつ", "tỷ lệ chiếm giữ/thị phần"],
  ["迂闊", "うかつ", "bất cẩn, sơ suất"],
  ["等身大", "とうしんだい", "đúng với con người thật, không phóng đại"],
  ["媒介", "ばいかい", "môi giới, trung gian"],
  ["補助", "ほじょ", "hỗ trợ, trợ cấp"],
  ["申請", "しんせい", "nộp đơn, xin"],
  ["書類", "しょるい", "giấy tờ, hồ sơ"],
  ["締め切り", "しめきり", "hạn chót"],
  ["提出", "ていしゅつ", "nộp, trình"],
  ["責任", "せきにん", "trách nhiệm"],
  ["資源", "しげん", "tài nguyên"],
  ["現状", "げんじょう", "hiện trạng"],
  ["講演", "こうえん", "bài diễn thuyết"],
  ["専門家", "せんもんか", "chuyên gia"],
  ["環境問題", "かんきょうもんだい", "vấn đề môi trường"],
  ["引き換え", "ひきかえ", "đổi lại, đánh đổi"],
  ["限りある", "かぎりある", "có giới hạn"],
  ["失われる", "うしなわれる", "bị mất đi"],
  ["考えさせられる", "かんがえさせられる", "khiến phải suy nghĩ"],
];

if (Array.isArray(window.n1VocabularyExtra)) {
  n1Vocabulary.push(...window.n1VocabularyExtra);
}

const n2Vocabulary = [
  ["把握", "はあく", "nắm bắt, hiểu rõ"],
  ["憤り", "いきどおり", "sự phẫn nộ, tức giận"],
  ["趣旨", "しゅし", "ý chính, mục đích chính"],
  ["日夜", "にちや", "ngày đêm"],
  ["励む", "はげむ", "nỗ lực, chuyên tâm"],
  ["貫く", "つらぬく", "giữ vững, xuyên suốt"],
  ["貧富", "ひんぷ", "giàu nghèo"],
  ["再発", "さいはつ", "tái phát, lặp lại"],
  ["防止", "ぼうし", "phòng tránh, ngăn chặn"],
  ["対策", "たいさく", "biện pháp đối phó"],
  ["培う", "つちかう", "vun đắp, bồi dưỡng"],
  ["築く", "きずく", "xây dựng"],
  ["練る", "ねる", "trau chuốt, lập kỹ"],
  ["磨く", "みがく", "mài giũa, rèn luyện"],
  ["とりわけ", "とりわけ", "đặc biệt là"],
  ["当時", "とうじ", "thời điểm đó"],
  ["転職", "てんしょく", "chuyển việc"],
  ["念頭", "ねんとう", "trong đầu, điều đang nghĩ tới"],
  ["念願", "ねんがん", "ước nguyện lâu nay"],
  ["内心", "ないしん", "trong lòng"],
  ["そわそわ", "そわそわ", "bồn chồn, đứng ngồi không yên"],
  ["人材", "じんざい", "nhân lực, người tài"],
  ["育成", "いくせい", "đào tạo, nuôi dưỡng"],
  ["担う", "になう", "đảm nhiệm, gánh vác"],
  ["披露", "ひろう", "trình diễn, công bố"],
  ["腕前", "うでまえ", "tay nghề, trình độ"],
  ["手間", "てま", "công sức, thời gian bỏ ra"],
  ["発言", "はつげん", "phát biểu"],
  ["議論", "ぎろん", "tranh luận"],
  ["ためらう", "ためらう", "do dự, ngập ngừng"],
  ["案じる", "あんじる", "lo lắng"],
  ["予測", "よそく", "dự đoán"],
  ["外れる", "はずれる", "trật, không đúng"],
  ["人込み", "ひとごみ", "đám đông"],
  ["渋滞", "じゅうたい", "tắc nghẽn"],
  ["暗やみ", "くらやみ", "bóng tối"],
  ["発生", "はっせい", "phát sinh, xảy ra"],
  ["仕組み", "しくみ", "cơ chế, cấu trúc"],
  ["記述", "きじゅつ", "mô tả, ghi chép"],
  ["内容", "ないよう", "nội dung"],
  ["確信", "かくしん", "niềm tin chắc chắn"],
  ["証拠", "しょうこ", "bằng chứng"],
  ["基準", "きじゅん", "tiêu chuẩn, căn cứ"],
  ["方法", "ほうほう", "phương pháp"],
  ["理由", "りゆう", "lý do"],
  ["急がせる", "いそがせる", "hối thúc"],
  ["待たせる", "またせる", "bắt chờ"],
  ["困らせる", "こまらせる", "làm khó xử, gây phiền"],
  ["処置", "しょち", "xử trí, biện pháp xử lý"],
  ["拍子", "ひょうし", "ngay lúc, khoảnh khắc; nhịp"],
  ["口出し", "くちだし", "xen vào, can thiệp bằng lời"],
  ["反論", "はんろん", "phản bác"],
  ["遠慮", "えんりょ", "ngại ngùng, giữ ý"],
  ["私生活", "しせいかつ", "đời sống riêng tư"],
  ["手続き", "てつづき", "thủ tục"],
  ["窓口", "まどぐち", "quầy tiếp nhận"],
  ["当てはめる", "あてはめる", "áp vào, áp dụng vào"],
  ["少数", "しょうすう", "số ít"],
  ["事例", "じれい", "trường hợp, ví dụ"],
  ["一般化", "いっぱんか", "khái quát hóa"],
  ["社会全体", "しゃかいぜんたい", "toàn xã hội"],
  ["習慣", "しゅうかん", "thói quen, tập quán"],
  ["取り入れる", "とりいれる", "đưa vào, áp dụng"],
  ["捜査", "そうさ", "điều tra"],
  ["怠る", "おこたる", "lơ là, bỏ bê"],
  ["危機的", "ききてき", "mang tính khủng hoảng"],
  ["根本的", "こんぽんてき", "căn bản, tận gốc"],
  ["見直し", "みなおし", "xem xét lại"],
  ["不可欠", "ふかけつ", "không thể thiếu"],
  ["状況", "じょうきょう", "tình hình, hoàn cảnh"],
  ["行動", "こうどう", "hành động"],
  ["視線", "しせん", "ánh nhìn, tầm mắt"],
  ["適切", "てきせつ", "phù hợp, thích đáng"],
  ["不適切", "ふてきせつ", "không phù hợp"],
  ["暗黙", "あんもく", "ngầm hiểu, không nói ra"],
  ["公共性", "こうきょうせい", "tính công cộng"],
  ["規範", "きはん", "quy phạm, chuẩn mực"],
  ["認識", "にんしき", "nhận thức"],
  ["導く", "みちびく", "dẫn dắt"],
  ["営み", "いとなみ", "hoạt động sống, sinh hoạt"],
  ["自然", "しぜん", "tự nhiên"],
  ["土地", "とち", "vùng đất, địa phương"],
  ["争う", "あらそう", "tranh giành, tranh chấp"],
  ["仲良く", "なかよく", "hòa thuận"],
  ["必要", "ひつよう", "cần thiết"],
  ["明確", "めいかく", "rõ ràng"],
  ["法律", "ほうりつ", "pháp luật"],
  ["制度", "せいど", "chế độ, hệ thống"],
  ["街角", "まちかど", "góc phố"],
  ["路上", "ろじょう", "trên đường"],
  ["共有", "きょうゆう", "chia sẻ, cùng có chung"],
  ["押し付ける", "おしつける", "áp đặt"],
  ["従う", "したがう", "tuân theo"],
  ["判断", "はんだん", "phán đoán, quyết định"],
  ["無意識", "むいしき", "vô thức"],
  ["眺める", "ながめる", "ngắm nhìn"],
  ["疑問", "ぎもん", "nghi vấn, thắc mắc"],
  ["次第に", "しだいに", "dần dần"],
  ["改めて", "あらためて", "một lần nữa, lại"],
  ["振る舞い", "ふるまい", "cách cư xử, hành vi"],
  ["許す", "ゆるす", "cho phép, tha thứ"],
  ["結果", "けっか", "kết quả"],
  ["取り決める", "とりきめる", "quy định, thỏa thuận"],
  ["繰り返す", "くりかえす", "lặp lại"],
  ["重要", "じゅうよう", "quan trọng"],
  ["施設", "しせつ", "cơ sở, thiết bị"],
  ["在学生", "ざいがくせい", "sinh viên đang học"],
  ["公認", "こうにん", "được công nhận chính thức"],
  ["団体", "だんたい", "đoàn thể, tổ chức"],
  ["営利目的", "えいりもくてき", "mục đích lợi nhuận"],
  ["利用", "りよう", "sử dụng"],
  ["可否", "かひ", "được hay không"],
  ["管理", "かんり", "quản lý"],
  ["委員会", "いいんかい", "ủy ban"],
  ["定員", "ていいん", "sức chứa, số người quy định"],
  ["備え付け", "そなえつけ", "trang bị sẵn"],
  ["借りる", "かりる", "mượn, thuê"],
  ["代表者", "だいひょうしゃ", "người đại diện"],
  ["設備", "せつび", "thiết bị, cơ sở vật chất"],
  ["詳細", "しょうさい", "chi tiết"],
  ["参照", "さんしょう", "tham khảo"],
  ["提出先", "ていしゅつさき", "nơi nộp"],
  ["期限", "きげん", "hạn, thời hạn"],
  ["参加者", "さんかしゃ", "người tham gia"],
  ["見込まれる", "みこまれる", "được dự tính, có khả năng"],
  ["開催", "かいさい", "tổ chức, mở sự kiện"],
  ["備品", "びひん", "trang thiết bị, vật dụng"],
  ["借用", "しゃくよう", "mượn, vay dùng"],
  ["希望", "きぼう", "mong muốn, nguyện vọng"],
  ["予定", "よてい", "dự định, kế hoạch"],
];

const sortedN1Vocabulary = [...n1Vocabulary].sort((a, b) => b[0].length - a[0].length);
const sortedN2Vocabulary = [...n2Vocabulary].sort((a, b) => b[0].length - a[0].length);
const sortedStudyVocabulary = [...n1Vocabulary, ...n2Vocabulary].sort((a, b) => b[0].length - a[0].length);

const supplementalVocabAnswers = [
  ["添付", "てんぷ", "đính kèm, gửi kèm tài liệu"],
  ["対比", "たいひ", "đối chiếu, so sánh tương phản"],
  ["自然に", "しぜんに", "một cách tự nhiên"],
  ["急がせる", "いそがせる", "thúc giục, làm cho vội"],
  ["率直に", "そっちょくに", "thẳng thắn, thật lòng"],
  ["該当", "がいとう", "thuộc diện, tương ứng, phù hợp"],
  ["紛れる", "まぎれる", "lẫn vào, trà trộn; bị phân tán"],
  ["意欲", "いよく", "ý chí, nhiệt tình muốn làm"],
  ["あきらめずに", "あきらめずに", "không bỏ cuộc"],
  ["余裕", "よゆう", "dư dả, thong thả, khoảng trống"],
  ["上品な", "じょうひんな", "thanh lịch, tao nhã"],
  ["怪しい", "あやしい", "đáng ngờ, khả nghi"],
  ["詳細に", "しょうさいに", "một cách chi tiết"],
  ["経緯", "けいい", "quá trình, đầu đuôi sự việc"],
  ["無邪気な", "むじゃきな", "ngây thơ, hồn nhiên"],
  ["重要な", "じゅうような", "quan trọng"],
  ["雑な", "ざつな", "cẩu thả, qua loa"],
  ["能力", "のうりょく", "năng lực"],
  ["無駄にする", "むだにする", "lãng phí"],
  ["いいかげん", "いいかげん", "qua loa, cẩu thả; vừa phải"],
  ["今", "いま", "bây giờ, hiện tại"],
  ["引き受ける", "ひきうける", "nhận làm, đảm nhận"],
  ["差し上げる", "さしあげる", "biếu, tặng; kính ngữ của あげる"],
  ["割り当てる", "わりあてる", "phân bổ, giao phần"],
  ["周到な", "しゅうとうな", "chu đáo, kỹ lưỡng"],
  ["ひとまず", "ひとまず", "tạm thời, trước mắt"],
  ["むしゃくしゃ", "むしゃくしゃ", "bực bội, khó chịu trong lòng"],
  ["密集", "みっしゅう", "tập trung dày đặc"],
  ["発足", "ほっそく", "thành lập, bắt đầu hoạt động"],
  ["にぎわう", "にぎわう", "nhộn nhịp, đông vui"],
  ["満喫", "まんきつ", "tận hưởng trọn vẹn"],
  ["とっくに", "とっくに", "đã từ lâu"],
  ["配布", "はいふ", "phân phát"],
  ["見失う", "みうしなう", "mất dấu, không còn nhìn thấy"],
  ["見込み", "みこみ", "triển vọng, khả năng dự kiến"],
  ["満たない", "みたない", "chưa đạt tới, chưa đủ"],
  ["広大", "こうだい", "rộng lớn, bao la"],
  ["仕業", "しわざ", "hành động gây ra, việc làm"],
  ["無造作", "むぞうさ", "tùy tiện, không cầu kỳ"],
  ["総じて", "そうじて", "nhìn chung, nói chung"],
  ["優位", "ゆうい", "ưu thế"],
  ["かばう", "かばう", "che chở, bênh vực"],
  ["加味", "かみ", "tính thêm, đưa thêm vào cân nhắc"],
  ["気配", "けはい", "dấu hiệu, động tĩnh"],
  ["合致", "がっち", "phù hợp, trùng khớp"],
  ["煩雑", "はんざつ", "rườm rà, phức tạp"],
  ["打開", "だかい", "khai thông, tháo gỡ"],
  ["はがす", "はがす", "bóc, gỡ ra"],
  ["抱え込む", "かかえこむ", "ôm hết vào mình, giữ trong lòng"],
  ["裏腹", "うらはら", "trái ngược"],
  ["耐えがたい", "たえがたい", "khó chịu đựng"],
  ["携わる", "たずさわる", "tham gia, làm liên quan đến"],
  ["復旧", "ふっきゅう", "khôi phục"],
  ["人手", "ひとで", "nhân lực, người làm"],
  ["今更", "いまさら", "đến bây giờ mới, giờ thì đã muộn"],
  ["くまなく", "くまなく", "khắp nơi, kỹ lưỡng không sót"],
  ["安静", "あんせい", "nghỉ ngơi yên tĩnh"],
  ["統合", "とうごう", "hợp nhất, tích hợp"],
  ["辞任", "じにん", "từ chức"],
  ["帯びる", "おびる", "mang, nhuốm, có sắc thái"],
  ["思い詰める", "おもいつめる", "nghĩ quẩn, day dứt sâu"],
  ["もはや", "もはや", "đã không còn, giờ thì"],
  ["はなはだしい", "はなはだしい", "rất lớn, nghiêm trọng"],
  ["規制", "きせい", "quy chế, hạn chế"],
  ["入手", "にゅうしゅ", "có được, thu được"],
  ["退く", "しりぞく", "rút lui, rời khỏi chức vụ"],
  ["閑静", "かんせい", "yên tĩnh"],
  ["たやすい", "たやすい", "dễ dàng"],
  ["察する", "さっする", "đoán biết, cảm thông"],
  ["内訳", "うちわけ", "chi tiết cấu thành"],
  ["食い違う", "くいちがう", "khác nhau, mâu thuẫn"],
  ["過密", "かみつ", "quá dày đặc"],
  ["昇進", "しょうしん", "thăng chức"],
  ["滅びる", "ほろびる", "diệt vong, suy tàn"],
  ["提起", "ていき", "nêu ra, đặt vấn đề"],
  ["重複", "ちょうふく", "trùng lặp"],
  ["真っ先", "まっさき", "đầu tiên, trước hết"],
  ["緊密", "きんみつ", "mật thiết, chặt chẽ"],
  ["遂げる", "とげる", "đạt được, hoàn thành"],
  ["うなだれる", "うなだれる", "cúi gằm, rũ xuống"],
  ["巧み", "たくみ", "khéo léo, tài tình"],
  ["配属", "はいぞく", "phân công, điều về bộ phận"],
  ["心当たり", "こころあたり", "manh mối, điều chợt nghĩ ra"],
  ["しぶとい", "しぶとい", "dai dẳng, lì lợm"],
  ["備え付ける", "そなえつける", "trang bị sẵn"],
  ["基調", "きちょう", "tông chủ đạo, nền tảng"],
  ["かさばる", "かさばる", "cồng kềnh"],
  ["簡素", "かんそ", "đơn giản, giản dị"],
  ["解明", "かいめい", "làm sáng tỏ"],
  ["ほほえましい", "ほほえましい", "đáng mỉm cười, dễ thương"],
  ["目安", "めやす", "tiêu chuẩn tham khảo, mục tiêu"],
  ["様相", "ようそう", "diện mạo, tình hình"],
  ["交える", "まじえる", "xen vào, pha lẫn"],
  ["ひたむき", "ひたむき", "chuyên tâm, hết lòng"],
  ["失脚", "しっきゃく", "mất chức, thất thế"],
  ["実に", "じつに", "thật là, quả thực"],
  ["絶滅", "ぜつめつ", "tuyệt chủng"],
  ["露骨", "ろこつ", "lộ liễu, trắng trợn"],
  ["交付", "こうふ", "cấp phát"],
  ["かたくな", "かたくな", "bướng bỉnh, cố chấp"],
  ["なつく", "なつく", "quấn, thân quen"],
  ["均等", "きんとう", "đồng đều"],
  ["リタイア", "リタイア", "bỏ cuộc, rút lui"],
  ["押収", "おうしゅう", "tịch thu"],
  ["本場", "ほんば", "quê hương chính gốc, nơi nổi tiếng nhất"],
  ["結末", "けつまつ", "kết cục"],
  ["そそる", "そそる", "kích thích, gợi lên"],
  ["要請", "ようせい", "yêu cầu, đề nghị chính thức"],
  ["ぎこちない", "ぎこちない", "vụng về, gượng gạo"],
  ["断じて", "だんじて", "tuyệt đối, nhất quyết"],
  ["出荷", "しゅっか", "xuất hàng"],
  ["譲る", "ゆずる", "nhường, chuyển nhượng"],
  ["底力", "そこぢから", "nội lực tiềm ẩn"],
  ["手痛い", "ていたい", "đau đớn, nặng nề"],
  ["誘致", "ゆうち", "thu hút, mời gọi đặt cơ sở"],
  ["さえる", "さえる", "tỉnh táo, sáng rõ"],
  ["もろい", "もろい", "giòn, yếu, dễ vỡ"],
  ["解約", "かいやく", "hủy hợp đồng"],
  ["特産", "とくさん", "đặc sản"],
  ["問い詰める", "といつめる", "gặng hỏi, truy hỏi"],
  ["デマ", "デマ", "tin đồn thất thiệt"],
  ["コンスタント", "コンスタント", "đều đặn, ổn định"],
  ["抜き打ち", "ぬきうち", "đột xuất, không báo trước"],
  ["かすれる", "かすれる", "khàn, nhòe, mờ"],
  ["緻密", "ちみつ", "tỉ mỉ, chặt chẽ"],
  ["保護", "ほご", "bảo vệ, che chở"],
  ["本筋", "ほんすじ", "mạch chính, cốt truyện chính"],
  ["伴奏", "ばんそう", "đệm nhạc"],
  ["推理", "すいり", "suy luận"],
  ["極めて", "きわめて", "cực kỳ, vô cùng"],
  ["練る", "ねる", "trau chuốt, gọt giũa; xây dựng kỹ"],
  ["締める", "しめる", "thắt, buộc; siết lại"],
  ["円滑", "えんかつ", "trôi chảy, suôn sẻ"],
  ["結束", "けっそく", "đoàn kết, gắn bó"],
  ["まばら", "まばら", "thưa thớt, rải rác"],
  ["丹念", "たんねん", "tỉ mỉ, cẩn thận"],
  ["捗る", "はかどる", "tiến triển thuận lợi"],
  ["見合わせる", "みあわせる", "trì hoãn, tạm hoãn"],
  ["やむをえず", "やむをえず", "không còn cách nào khác, bất đắc dĩ"],
  ["調達", "ちょうたつ", "điều phối, cung ứng, huy động"],
  ["細心", "さいしん", "cẩn thận, tỉ mỉ"],
  ["意地", "いじ", "tâm địa, tính khí; sự cố chấp"],
  ["目先", "めさき", "trước mắt, lợi ích trước mắt"],
  ["見落とす", "みおとす", "bỏ sót, nhìn sót"],
  ["利益", "りえき", "lợi ích, lợi nhuận"],
  ["逃れる", "のがれる", "thoát khỏi, tránh khỏi"],
  ["考慮", "こうりょ", "xem xét, cân nhắc"],
  ["遮る", "さえぎる", "chặn, che, cản ngang"],
  ["根拠", "こんきょ", "căn cứ, cơ sở"],
  ["肝心", "かんじん", "quan trọng, cốt yếu"],
  ["ほこりまみれ", "ほこりまみれ", "phủ đầy bụi"],
  ["弾む", "はずむ", "hào hứng, sôi nổi; nảy lên"],
  ["実情", "じつじょう", "tình hình thực tế"],
  ["逸材", "いつざい", "nhân tài xuất chúng"],
  ["画期的", "かっきてき", "đột phá, mang tính bước ngoặt"],
  ["もくろむ", "もくろむ", "dự tính, âm thầm lên kế hoạch"],
  ["手がかり", "てがかり", "manh mối, gợi ý"],
  ["にわかに", "にわかに", "đột ngột, ngay lập tức"],
  ["重宝", "ちょうほう", "quý giá, hữu ích, tiện lợi"],
  ["シビア", "シビア", "khắt khe, nghiêm ngặt"],
  ["連携", "れんけい", "hợp tác, phối hợp"],
  ["不服", "ふふく", "không hài lòng, bất mãn"],
  ["かなう", "かなう", "đạt được, trở thành hiện thực"],
  ["目覚ましい", "めざましい", "nổi bật, đáng chú ý"],
  ["ほどける", "ほどける", "tháo ra, bung ra"],
  ["互角", "ごかく", "ngang sức, ngang tài ngang sức"],
  ["リード", "リード", "dẫn trước, dẫn đầu; 1点リードする = dẫn trước 1 điểm; vai trò dẫn dắt"],
  ["人脈", "じんみゃく", "mạng lưới quan hệ, mối quan hệ xã hội"],
  ["賢い", "かしこい", "thông minh, khôn ngoan"],
  ["顕著", "けんちょ", "rõ rệt, nổi bật, dễ thấy"],
  ["多岐", "たき", "nhiều mặt, nhiều phương diện"],
  ["廃れて", "すたれて", "bị mai một, trở nên lỗi thời"],
  ["廃れる", "すたれる", "mai một, lỗi thời, không còn thịnh hành"],
  ["相場", "そうば", "giá thị trường, mức giá chung"],
  ["要望", "ようぼう", "yêu cầu, nguyện vọng, điều mong muốn được đáp ứng"],
  ["運用", "うんよう", "vận dụng, vận hành; 運用する = đưa hệ thống/quy tắc/tiền vốn vào sử dụng thực tế"],
  ["迫力", "はくりょく", "sức mạnh gây ấn tượng, độ cuốn hút mạnh; 迫力がある = rất ấn tượng, có lực"],
  ["目まぐるしい", "めまぐるしい", "thay đổi nhanh đến chóng mặt, dồn dập"],
  ["改修", "かいしゅう", "sửa chữa, cải tạo công trình/hệ thống cho tốt hơn"],
  ["手厚い", "てあつい", "chu đáo, đầy đủ, tận tình; 手厚い支援 = hỗ trợ chu đáo"],
  ["デマ", "デマ", "tin đồn thất thiệt, tin giả"],
  ["そそる", "そそる", "kích thích, gợi lên cảm giác/hứng thú; 食欲をそそる = gợi cảm giác thèm ăn"],
  ["望ましい", "のぞましい", "đáng mong muốn, nên có, phù hợp"],
  ["秘める", "ひめる", "ẩn giấu, chứa đựng bên trong; 可能性を秘める = chứa tiềm năng"],
  ["素早い", "すばやい", "nhanh nhẹn, mau lẹ"],
  ["なつく", "なつく", "quen thân, quấn quýt; 子ども/動物が人になつく = trẻ/con vật quen và thân với ai"],
  ["もはや", "もはや", "đã đến mức không còn..., giờ thì đã...; もはや手遅れ = giờ đã quá muộn"],
  ["作動", "さどう", "sự hoạt động/vận hành của máy móc; 作動する = máy chạy, thiết bị hoạt động"],
  ["乗り出す", "のりだす", "bắt tay vào, tham gia tích cực; thân người nhô ra phía trước"],
  ["面識", "めんしき", "quen biết qua gặp mặt; 面識がある = có quen/gặp qua"],
  ["拠点", "きょてん", "căn cứ, điểm đặt hoạt động; 活動の拠点 = cơ sở hoạt động"],
  ["軌道", "きどう", "quỹ đạo, đường ray; 軌道に乗る = đi vào ổn định/đúng hướng"],
  ["人一倍", "ひといちばい", "hơn người khác, đặc biệt nhiều; 人一倍努力する = nỗ lực hơn người"],
  ["はがす", "はがす", "bóc, gỡ, lột ra; シールをはがす = bóc nhãn dán"],
  ["かばう", "かばう", "che chở, bênh vực, bảo vệ ai khỏi bị trách/phạt"],
  ["免除", "めんじょ", "miễn trừ, miễn phải làm/nộp; 授業料を免除する = miễn học phí"],
  ["有数", "ゆうすう", "hàng đầu, có số lượng/địa vị nổi bật; 世界有数の都市 = một thành phố hàng đầu thế giới"],
  ["ゆとり", "ゆとり", "sự dư dả, khoảng thoải mái về thời gian/tiền bạc/tâm lý"],
  ["質素", "しっそ", "giản dị, mộc mạc, không xa hoa"],
  ["赴任", "ふにん", "nhận nhiệm sở, đi đến nơi được điều động làm việc"],
  ["差し上げました", "さしあげました", "đã biếu/tặng/đưa cho; kính ngữ của あげました"],
  ["すべて", "すべて", "tất cả, toàn bộ"],
  ["になう", "になう", "gánh vác, đảm nhận vai trò/trách nhiệm"],
  ["わざと", "わざと", "cố ý, có chủ đích"],
  ["ヒント", "ヒント", "gợi ý, manh mối"],
  ["やはり", "やはり", "quả nhiên, đúng như nghĩ; vẫn là"],
  ["ただで", "ただで", "miễn phí, không mất tiền"],
  ["しくみ", "しくみ", "cơ chế, cấu trúc vận hành"],
  ["繁盛", "はんじょう", "buôn bán phát đạt, thịnh vượng"],
  ["くじける", "くじける", "nản lòng, nhụt chí, gục tinh thần"],
  ["侮って", "あなどって", "coi thường, xem nhẹ"],
  ["諭した", "さとした", "đã khuyên bảo, giảng giải nhẹ nhàng"],
  ["練って", "ねって", "trau chuốt, xây dựng kỹ, cân nhắc kỹ"],
  ["鈍って", "にぶって", "trở nên kém đi, suy giảm, cùn đi"],
  ["鈍る", "にぶる", "trở nên kém đi, cùn đi"],
  ["漠然", "ばくぜん", "mơ hồ, không rõ ràng"],
  ["閲覧", "えつらん", "xem, đọc, truy cập xem tài liệu"],
  ["群衆", "ぐんしゅう", "đám đông, quần chúng"],
  ["覆す", "くつがえす", "lật ngược, đảo ngược, bác bỏ"],
  ["心地よい", "ここちよい", "dễ chịu, thoải mái"],
  ["枠", "わく", "khung, phạm vi, giới hạn"],
  ["網羅", "もうら", "bao quát toàn bộ, liệt kê đầy đủ"],
  ["名誉", "めいよ", "danh dự, vinh dự"],
  ["費やした", "ついやした", "đã tiêu tốn, bỏ ra thời gian/công sức"],
  ["費やす", "ついやす", "tiêu tốn, bỏ ra thời gian/công sức"],
  ["由緒", "ゆいしょ", "lai lịch, nguồn gốc lâu đời"],
  ["巧妙", "こうみょう", "khéo léo, tinh vi"],
  ["憩い", "いこい", "sự nghỉ ngơi, thư giãn"],
  ["需要", "じゅよう", "nhu cầu"],
  ["跡地", "あとち", "khu đất sau khi công trình bị dỡ bỏ, nền cũ"],
  ["貫いた", "つらぬいた", "đã giữ vững, xuyên suốt, thực hiện đến cùng"],
  ["貫く", "つらぬく", "giữ vững, xuyên suốt, thực hiện đến cùng"],
  ["概略", "がいりゃく", "khái lược, tóm tắt đại ý"],
  ["臨みたい", "のぞみたい", "muốn tham gia, muốn đối mặt/đón nhận"],
  ["督促", "とくそく", "đôn đốc, nhắc thúc giục"],
  ["漂い", "ただよい", "lan tỏa, phảng phất, trôi nổi"],
  ["漂う", "ただよう", "lan tỏa, phảng phất, trôi nổi"],
  ["厳正", "げんせい", "nghiêm chính, công bằng nghiêm ngặt"],
  ["拒んで", "こばんで", "từ chối, khước từ, ngăn lại"],
  ["拒む", "こばむ", "từ chối, khước từ, ngăn lại"],
  ["慕われる", "したわれる", "được yêu mến, được ngưỡng mộ"],
  ["破損", "はそん", "hư hỏng, bị phá hỏng"],
  ["承諾", "しょうだく", "đồng ý, chấp thuận"],
  ["淡い", "あわい", "nhạt, thoang thoảng, mờ nhẹ"],
  ["樹木", "じゅもく", "cây cối"],
  ["蓄えて", "たくわえて", "tích trữ, để dành"],
  ["蓄える", "たくわえる", "tích trữ, để dành"],
  ["陳列", "ちんれつ", "trưng bày"],
  ["華やか", "はなやか", "rực rỡ, lộng lẫy"],
  ["偏って", "かたよって", "thiên lệch, nghiêng về một phía"],
  ["潤す", "うるおす", "làm ẩm, làm phong phú, đem lợi ích"],
  ["殺菌", "さっきん", "diệt khuẩn"],
  ["託された", "たくされた", "được giao phó, được ủy thác"],
  ["託す", "たくす", "giao phó, ủy thác"],
  ["傾斜", "けいしゃ", "độ nghiêng, sự nghiêng dốc"],
  ["阻まれて", "はばまれて", "bị cản trở, bị ngăn lại"],
  ["阻む", "はばむ", "cản trở, ngăn lại"],
  ["暴露", "ばくろ", "phơi bày, tiết lộ"],
  ["開拓", "かいたく", "khai phá, mở ra lĩnh vực mới"],
  ["復興", "ふっこう", "phục hưng, khôi phục"],
  ["了承", "りょうしょう", "hiểu và chấp thuận"],
  ["指図", "さしず", "chỉ thị, sai bảo"],
  ["巡り", "めぐり", "xoay quanh, liên quan đến"],
  ["偽り", "いつわり", "giả dối, không thật"],
  ["嫌悪感", "けんおかん", "cảm giác ghét, ác cảm"],
  ["自粛", "じしゅく", "tự kiềm chế, tự hạn chế"],
  ["戒めたい", "いましめたい", "muốn răn dạy, muốn cảnh báo"],
  ["丘陵", "きゅうりょう", "đồi núi thấp, gò đồi"],
  ["豪快", "ごうかい", "mạnh mẽ, phóng khoáng, sảng khoái"],
  ["募って", "つのって", "ngày càng mạnh hơn; kêu gọi, chiêu mộ"],
  ["募る", "つのる", "ngày càng mạnh hơn; kêu gọi, chiêu mộ"],
  ["膨大", "ぼうだい", "khổng lồ, rất lớn"],
  ["滞って", "とどこおって", "bị đình trệ, bị chậm lại"],
  ["滞る", "とどこおる", "đình trệ, chậm lại"],
  ["驚嘆", "きょうたん", "kinh ngạc, thán phục"],
  ["猛烈", "もうれつ", "dữ dội, mãnh liệt"],
  ["克服", "こくふく", "khắc phục, vượt qua"],
  ["崩れやすい", "くずれやすい", "dễ sụp, dễ vỡ, dễ mất cân bằng"],
  ["繁殖", "はんしょく", "sinh sôi, sinh sản"],
  ["履歴", "りれき", "lịch sử, lý lịch, lịch sử thao tác"],
  ["映える", "はえる", "nổi bật, trông đẹp lên"],
  ["砕けて", "くだけて", "vỡ ra; trở nên thân mật, dễ hiểu"],
  ["砕ける", "くだける", "vỡ ra; trở nên thân mật, dễ hiểu"],
  ["執着", "しゅうちゃく", "chấp niệm, bám chặt, cố chấp"],
  ["潔い", "いさぎよい", "dứt khoát, thẳng thắn, không luyến tiếc"],
  ["干渉", "かんしょう", "can thiệp"],
  ["粘って", "ねばって", "kiên trì, bám trụ"],
  ["粘る", "ねばる", "kiên trì, bám trụ"],
  ["遺憾", "いかん", "đáng tiếc, lấy làm tiếc"],
  ["閉鎖", "へいさ", "đóng cửa, phong tỏa"],
  ["心遣い", "こころづかい", "sự quan tâm, chu đáo"],
  ["憤った", "いきどおった", "tức giận, phẫn nộ"],
  ["憤る", "いきどおる", "tức giận, phẫn nộ"],
  ["治癒", "ちゆ", "chữa lành, khỏi bệnh"],
  ["尊い", "とうとい", "quý giá, đáng kính"],
  ["慰めて", "なぐさめて", "an ủi, vỗ về"],
  ["慰める", "なぐさめる", "an ủi, vỗ về"],
  ["緊迫", "きんぱく", "căng thẳng, khẩn trương"],
  ["勇敢", "ゆうかん", "dũng cảm"],
  ["忠告", "ちゅうこく", "lời khuyên, lời cảnh báo"],
  ["慕って", "したって", "yêu mến, ngưỡng mộ"],
  ["慕う", "したう", "yêu mến, ngưỡng mộ"],
  ["施錠", "せじょう", "khóa cửa"],
  ["監督", "かんとく", "giám sát, đạo diễn, huấn luyện viên"],
  ["派生", "はせい", "phát sinh, bắt nguồn"],
  ["透けて", "すけて", "nhìn xuyên qua, lộ ra"],
  ["透ける", "すける", "nhìn xuyên qua, lộ ra"],
  ["恩恵", "おんけい", "ân huệ, lợi ích được hưởng"],
  ["臨む", "のぞむ", "tham gia, đối mặt, bước vào"],
  ["如実に", "にょじつに", "một cách rõ ràng, đúng như thực tế"],
  ["釈明", "しゃくめい", "giải thích, biện minh"],
  ["克明", "こくめい", "tỉ mỉ, chi tiết, rõ ràng"],
  ["改革", "かいかく", "cải cách, đổi mới"],
  ["愚か", "おろか", "ngu ngốc, dại dột"],
  ["緩和", "かんわ", "làm dịu, nới lỏng, giảm bớt"],
  ["趣旨が", "しゅし", "ý chính, mục đích chính"],
  ["趣旨", "しゅし", "ý chính, mục đích chính"],
  ["画一的", "かくいつてき", "đồng loạt, rập khuôn, thiếu khác biệt"],
  ["鑑定", "かんてい", "giám định, thẩm định"],
  ["怠った", "おこたった", "đã lơ là, sao nhãng"],
  ["怠る", "おこたる", "lơ là, sao nhãng"],
  ["回顧", "かいこ", "hồi tưởng, nhìn lại quá khứ"],
  ["忍耐", "にんたい", "sự nhẫn nại, chịu đựng"],
  ["債務", "さいむ", "nghĩa vụ nợ, khoản nợ phải trả"],
  ["促した", "うながした", "đã thúc giục, khuyến khích"],
  ["促す", "うながす", "thúc giục, khuyến khích"],
  ["措置", "そち", "biện pháp xử lý"],
  ["錯覚", "さっかく", "ảo giác, sự hiểu nhầm do cảm giác sai"],
  ["枯渇", "こかつ", "cạn kiệt"],
  ["沈下", "ちんか", "sụt lún, chìm xuống"],
  ["頑丈", "がんじょう", "chắc chắn, bền chắc"], ["潜んで", "ひそんで", "ẩn nấp, tiềm ẩn"], ["潜む", "ひそむ", "ẩn nấp, tiềm ẩn"], ["行政", "ぎょうせい", "hành chính"], ["卓越", "たくえつ", "vượt trội, xuất sắc"], ["芳しくない", "かんばしくない", "không tốt, không khả quan"], ["管轄", "かんかつ", "thẩm quyền quản lý, phạm vi quản hạt"],
  ["興奮", "こうふん", "phấn khích, hưng phấn"], ["唱えた", "となえた", "đã đề xướng, nêu ra"], ["唱える", "となえる", "đề xướng, nêu ra"], ["変遷", "へんせん", "sự biến đổi, thay đổi theo thời gian"], ["値する", "あたいする", "xứng đáng, đáng được"], ["随時", "ずいじ", "bất cứ lúc nào, tùy thời điểm"], ["励んで", "はげんで", "nỗ lực, chuyên tâm"], ["励む", "はげむ", "nỗ lực, chuyên tâm"],
  ["適応", "てきおう", "thích nghi"], ["掲げて", "かかげて", "đề ra, giương lên"], ["踏襲", "とうしゅう", "kế thừa, đi theo đường lối cũ"], ["足止め", "あしどめ", "bị kẹt lại, bị giữ chân"], ["へとへと", "へとへと", "kiệt sức"], ["払拭", "ふっしょく", "xóa tan, quét sạch"], ["とっさに", "とっさに", "ngay lập tức, theo phản xạ"],
  ["根底", "こんてい", "nền tảng, gốc rễ"], ["返上", "へんじょう", "trả lại; hy sinh/nghỉ mà vẫn làm"], ["取り次いで", "とりついで", "chuyển máy, nối liên lạc"], ["交錯", "こうさく", "đan xen, lẫn lộn"], ["難航", "なんこう", "gặp khó khăn, tiến triển trắc trở"], ["がやがや", "がやがや", "ồn ào tiếng người nói"], ["足手まとい", "あしでまとい", "vướng chân, gánh nặng cho người khác"],
  ["自立", "じりつ", "tự lập"], ["還元", "かんげん", "hoàn lại, trả lại lợi ích"], ["どんより", "どんより", "âm u, nặng nề"], ["ネック", "ネック", "điểm nghẽn, trở ngại"], ["発散", "はっさん", "giải tỏa, phát tán"], ["まぎらわしい", "まぎらわしい", "dễ nhầm lẫn"], ["行き届いて", "いきとどいて", "chu đáo, kỹ lưỡng đến từng chỗ"],
  ["腐敗", "ふはい", "thối rữa; mục nát"], ["粗い", "あらい", "thô, không mịn"], ["粘膜", "ねんまく", "niêm mạc"], ["寿命", "じゅみょう", "tuổi thọ"], ["戒める", "いましめる", "răn dạy, cảnh cáo"], ["誓約書", "せいやくしょ", "bản cam kết"],
  ["フォロー", "フォロー", "hỗ trợ, đỡ lời"], ["念願", "ねんがん", "ước nguyện từ lâu"], ["本音", "ほんね", "lòng thật, ý nghĩ thật"], ["やんわり", "やんわり", "nhẹ nhàng, mềm mỏng"], ["当", "とう", "này, hiện tại, thuộc về chúng tôi"], ["綿密な", "めんみつな", "tỉ mỉ, kỹ lưỡng"],
  ["委託", "いたく", "ủy thác"], ["清々しい", "すがすがしい", "sảng khoái"], ["工面", "くめん", "xoay xở tiền bạc"], ["ぞんざい", "ぞんざい", "cẩu thả, thô lỗ"], ["うなだれて", "うなだれて", "cúi gằm đầu"], ["打撃", "だげき", "đòn giáng, thiệt hại lớn"],
  ["風潮", "ふうちょう", "xu hướng xã hội"], ["もたらす", "もたらす", "mang lại, gây ra"], ["撤回", "てっかい", "rút lại, thu hồi"], ["補填", "ほてん", "bù đắp, bù lỗ"], ["コンスタントに", "コンスタントに", "đều đặn, ổn định"], ["ずばり", "ずばり", "thẳng thừng, trúng ngay trọng tâm"],
  ["維持", "いじ", "duy trì"], ["普及", "ふきゅう", "phổ biến, lan rộng"], ["紛らわしい", "まぎらわしい", "dễ nhầm"], ["兆し", "きざし", "dấu hiệu, điềm báo"], ["収容", "しゅうよう", "chứa, tiếp nhận"], ["冴える", "さえる", "tỉnh táo, sắc bén"], ["痛烈", "つうれつ", "gay gắt, mạnh mẽ"], ["完結", "かんけつ", "kết thúc trọn vẹn"], ["脆い", "もろい", "dễ vỡ, yếu"],
  ["根こそぎ", "ねこそぎ", "toàn bộ, sạch không còn gì"], ["没頭", "ぼっとう", "chìm đắm, tập trung hoàn toàn"], ["締結", "ていけつ", "ký kết"], ["懸念", "けねん", "lo ngại"], ["やつれて", "やつれて", "tiều tụy"], ["奮闘", "ふんとう", "nỗ lực chiến đấu"], ["不慮", "ふりょ", "bất ngờ, ngoài ý muốn"],
  ["一任", "いちにん", "ủy thác toàn quyền"], ["却下", "きゃっか", "bác bỏ, không chấp nhận"], ["可決", "かけつ", "thông qua"], ["保留", "ほりゅう", "bảo lưu, để lại chưa quyết"], ["円滑に", "えんかつに", "trôi chảy, suôn sẻ"], ["堅実な", "けんじつな", "vững chắc, thận trọng"], ["多角的な", "たかくてきな", "đa góc độ"], ["精力的に", "せいりょくてきに", "một cách năng nổ"],
  ["程遠い", "ほどとおい", "còn xa mới đạt tới"],
  ["まろやか", "まろやか", "dịu, êm, tròn vị"],
  ["脱却", "だっきゃく", "thoát khỏi, thoát ly"],
  ["使いこなす", "つかいこなす", "sử dụng thành thạo"],
  ["合意", "ごうい", "đồng thuận"], ["基盤", "きばん", "nền tảng"], ["支障", "ししょう", "trở ngại"], ["教訓", "きょうくん", "bài học"], ["打診", "だしん", "thăm dò ý kiến"], ["手配", "てはい", "sắp xếp, chuẩn bị"], ["発覚", "はっかく", "bị phát giác"], ["究明", "きゅうめい", "làm rõ, truy cứu"], ["表明", "ひょうめい", "bày tỏ, công bố"], ["言及", "げんきゅう", "đề cập"],
  ["急遽", "きゅうきょ", "gấp, đột ngột"], ["頻繁に", "ひんぱんに", "thường xuyên"], ["愛着", "あいちゃく", "sự gắn bó"], ["逸材", "いつざい", "nhân tài hiếm có"], ["強硬に", "きょうこうに", "cứng rắn"], ["忠実に", "ちゅうじつに", "trung thành, sát với"], ["熟知", "じゅくち", "biết rõ"], ["無謀", "むぼう", "liều lĩnh"], ["気がかり", "きがかり", "điều lo lắng"], ["見返り", "みかえり", "đổi lại, sự đáp lại"],
  ["逸脱", "いつだつ", "đi chệch, lệch khỏi"], ["障る", "さわる", "gây ảnh hưởng xấu"], ["駆使", "くし", "vận dụng thành thạo"], ["駆けつけた", "かけつけた", "chạy vội tới"], ["見かけた", "みかけた", "nhìn thấy thoáng qua"], ["報じた", "ほうじた", "đưa tin"], ["催されて", "もよおされて", "được tổ chức"], ["施されて", "ほどこされて", "được thực hiện/áp dụng"], ["立て替えて", "たてかえて", "trả thay trước"], ["食い込んだ", "くいこんだ", "ăn sâu vào, chen vào"],
  ["がらりと", "がらりと", "thay đổi hẳn"], ["ぎくしゃく", "ぎくしゃく", "gượng gạo, không trôi chảy"], ["くよくよ", "くよくよ", "lo nghĩ mãi"], ["じめじめ", "じめじめ", "ẩm ướt; u ám"], ["すべすべ", "すべすべ", "trơn láng"], ["すんなり", "すんなり", "suôn sẻ, dễ dàng"], ["ずっしりと", "ずっしりと", "nặng trĩu"], ["せかせかと", "せかせかと", "vội vàng, hấp tấp"], ["そわそわ", "そわそわ", "bồn chồn"], ["てきぱきと", "てきぱきと", "nhanh nhẹn, gọn gàng"], ["てっきり", "てっきり", "cứ đinh ninh là"], ["とりわけ", "とりわけ", "đặc biệt là"], ["むしょうに", "むしょうに", "vô cùng, không hiểu sao rất"], ["めきめき", "めきめき", "tiến bộ nhanh chóng"]
];

const supplementalVocabAnswerDetails = [
  ["快挙", "かいきょ", "thành tích lớn, chiến công đáng khen"], ["助長", "じょちょう", "làm tăng thêm, thúc đẩy theo chiều xấu"], ["結成", "けっせい", "thành lập, lập thành nhóm"], ["つくづく", "つくづく", "thấm thía, thật sự cảm thấy sâu sắc"], ["ほぐれて", "ほぐれて", "được thả lỏng, bớt căng thẳng"], ["すくって", "すくって", "múc lên, vốc lên bằng tay"], ["ピント", "ピント", "tiêu điểm, độ nét của ảnh"], ["軽快", "けいかい", "nhẹ nhàng, vui tươi, nhanh nhẹn"], ["サイクル", "サイクル", "chu trình, vòng lặp"], ["仲裁", "ちゅうさい", "trọng tài, hòa giải"], ["しわざ", "しわざ", "việc làm, trò gây ra"], ["かみ合わなくて", "かみあわなくて", "không ăn khớp, không khớp ý nhau"], ["存続", "そんぞく", "tiếp tục tồn tại, duy trì"], ["派", "は", "phe, nhóm theo quan điểm"], ["風習", "ふうしゅう", "phong tục, tập quán"], ["もどかしかった", "もどかしかった", "sốt ruột, bực vì không như ý"], ["こじれて", "こじれて", "trở nên rắc rối, xấu đi"], ["旺盛", "おうせい", "mạnh mẽ, dồi dào"], ["余波", "よは", "dư âm, ảnh hưởng lan sau sự việc"], ["目先", "めさき", "trước mắt, lợi ích ngắn hạn"], ["になう", "になう", "gánh vác, đảm nhận"], ["クレーム", "クレーム", "khiếu nại, phàn nàn"], ["みっちり", "みっちり", "dày đặc, kỹ lưỡng, không hở thời gian"], ["撤去", "てっきょ", "dỡ bỏ, loại bỏ"], ["あやぶまれて", "あやぶまれて", "bị lo ngại, bị nghi ngờ khó thành"], ["危ぶまれて", "あやぶまれて", "bị lo ngại, bị cho là có nguy cơ"], ["歴然", "れきぜん", "rõ ràng, hiển nhiên"], ["ここちよく", "ここちよく", "dễ chịu, thoải mái"], ["従事", "じゅうじ", "làm việc trong, tham gia công việc"], ["にじんで", "にじんで", "bị nhòe, thấm loang ra"], ["レイアウト", "レイアウト", "bố cục, cách sắp xếp trang"], ["起用", "きよう", "bổ nhiệm, chọn dùng người"], ["盛大に", "せいだいに", "một cách long trọng, quy mô lớn"], ["在庫", "ざいこ", "hàng tồn kho"], ["リスク", "リスク", "rủi ro"], ["なだめられて", "なだめられて", "được dỗ dành, được làm dịu lại"], ["シェア", "シェア", "thị phần, phần chia sẻ"], ["経歴", "けいれき", "lý lịch nghề nghiệp, quá trình làm việc"], ["はじく", "はじく", "đẩy bật ra, không thấm"], ["いとも", "いとも", "rất, vô cùng; thường đi với dễ dàng"], ["一環", "いっかん", "một phần trong toàn thể/chuỗi hoạt động"], ["よみがえって", "よみがえって", "sống lại, hiện về trong ký ức"], ["たたえた", "たたえた", "ca ngợi, tán dương"], ["非", "ひ", "lỗi, điều sai trái"], ["予断", "よだん", "sự phán đoán trước, kết luận vội"], ["絶大", "ぜつだい", "rất lớn, tuyệt đại"], ["腕前", "うでまえ", "tay nghề, trình độ kỹ năng"], ["おおらか", "おおらか", "rộng lượng, thoải mái, không câu nệ"], ["センス", "センス", "gu, cảm quan thẩm mỹ"], ["ストック", "ストック", "dự trữ, hàng/tư liệu để sẵn"], ["まちまち", "まちまち", "khác nhau, không thống nhất"], ["リストアップ", "リストアップ", "liệt kê thành danh sách"], ["人出", "ひとで", "lượng người ra đường/tham gia"], ["妥協", "だきょう", "thỏa hiệp"], ["並行", "へいこう", "song song, diễn ra đồng thời"], ["修復", "しゅうふく", "khôi phục, sửa chữa lại"], ["尽くす", "つくす", "làm hết sức, tận lực"], ["たどり", "たどり", "lần theo, đi theo dấu vết"], ["メディア", "メディア", "truyền thông, phương tiện thông tin"], ["強制", "きょうせい", "ép buộc, cưỡng chế"], ["荷", "に", "gánh nặng, hành lý"], ["本音", "ほんね", "lòng thật, suy nghĩ thật"], ["本⾳", "ほんね", "lòng thật, suy nghĩ thật"], ["おびただしい", "おびただしい", "rất nhiều, vô số"], ["実情", "じつじょう", "tình hình thực tế"], ["幅広い", "はばひろい", "rộng, đa dạng"], ["一掃", "いっそう", "quét sạch, xóa sạch"], ["遮断", "しゃだん", "cắt đứt, chặn lại"], ["練った", "ねった", "đã trau chuốt, đã xây dựng kỹ"], ["弾む", "はずむ", "sôi nổi, nảy lên"], ["直面", "ちょくめん", "đối mặt trực tiếp"], ["ノルマ", "ノルマ", "chỉ tiêu, định mức phải hoàn thành"], ["及ぼす", "およぼす", "gây ra, ảnh hưởng tới"], ["センサー", "センサー", "cảm biến"], ["異色", "いしょく", "độc đáo, khác thường"], ["強み", "つよみ", "điểm mạnh"], ["取り戻した", "とりもどした", "lấy lại, khôi phục lại"], ["まみれ", "まみれ", "dính đầy, phủ đầy"], ["ノウハウ", "ノウハウ", "bí quyết, kỹ thuật thực tế"], ["禁物", "きんもつ", "điều cấm kỵ, thứ nên tránh"], ["流出", "りゅうしゅつ", "rò rỉ, chảy/lan ra ngoài"], ["キャリア", "キャリア", "sự nghiệp, kinh nghiệm nghề nghiệp"], ["解除", "かいじょ", "hủy bỏ, gỡ bỏ"], ["壮大な", "そうだいな", "hùng vĩ, quy mô lớn"], ["しいて", "しいて", "cố tình, nếu buộc phải nói/chọn"], ["保護", "ほご", "bảo vệ"], ["食い止める", "くいとめる", "ngăn chặn, chặn đứng"], ["寄与", "きよ", "đóng góp, góp phần"], ["切り出す", "きりだす", "mở lời, đưa chuyện ra nói"], ["上", "うえ", "về mặt, trên phương diện"], ["会心", "かいしん", "đắc ý, hài lòng vì làm rất tốt"], ["大筋", "おおすじ", "đại ý, đường hướng chính"], ["不備", "ふび", "thiếu sót, không đầy đủ"], ["和らいで", "やわらいで", "dịu đi, giảm bớt"], ["ウエイト", "ウエイト", "trọng lượng; mức độ quan trọng"], ["うずうず", "うずうず", "nôn nóng, háo hức không yên"], ["心細い", "こころぼそい", "lo lắng, bất an vì thiếu chỗ dựa"], ["ニュアンス", "ニュアンス", "sắc thái nghĩa"], ["ひしひしと", "ひしひしと", "cảm nhận sâu sắc, thấm thía"], ["もっぱら", "もっぱら", "chủ yếu, chuyên vào"], ["抜粋", "ばっすい", "trích đoạn, trích lược"], ["猛", "もう", "mãnh liệt, dữ dội"], ["揺らぎ", "ゆらぎ", "sự dao động, lung lay"], ["染みて", "しみて", "thấm vào"], ["ためらって", "ためらって", "do dự, ngập ngừng"], ["へとへとに", "へとへとに", "kiệt sức"], ["すさまじい", "すさまじい", "dữ dội, khủng khiếp"], ["ハードル", "ハードル", "rào cản, trở ngại"], ["起伏", "きふく", "thăng trầm, lên xuống"], ["駆使", "くし", "vận dụng thành thạo"]
  , ["推移", "すいい", "sự biến đổi, diễn biến theo thời gian"], ["稼働", "かどう", "vận hành, hoạt động máy móc"], ["言い張って", "いいはって", "khăng khăng nói, một mực quả quyết"], ["版", "はん", "bản in, phiên bản"], ["結束", "けっそく", "sự đoàn kết, gắn bó"], ["合併", "がっぺい", "sáp nhập, hợp nhất"], ["手先", "てさき", "đầu ngón tay; sự khéo tay"], ["ごまかして", "ごまかして", "gian lận, nói dối/che giấu sự thật"], ["加筆", "かひつ", "viết thêm, bổ sung nội dung"], ["ブランク", "ブランク", "khoảng trống, thời gian gián đoạn"], ["うすうす", "うすうす", "lờ mờ, mang máng"], ["脳裏", "のうり", "trong đầu, trong tâm trí"], ["始めて", "はじめて", "bắt đầu"], ["傾向", "けいこう", "xu hướng, khuynh hướng"], ["特別によい", "とくべつによい", "đặc biệt tốt"], ["からかって", "からかって", "trêu chọc"], ["不思議そうな", "ふしぎそうな", "có vẻ nghi hoặc/khó hiểu"], ["すべて", "すべて", "tất cả, toàn bộ"], ["先方への返答を保留した。", "せんぽうへのへんとうをほりゅうした", "đã tạm hoãn câu trả lời cho phía đối tác"], ["混雑の緩和が期待される。", "こんざつのかんわがきたいされる", "được kỳ vọng giảm bớt ùn tắc/đông đúc"], ["まだ目標には程遠い。", "まだもくひょうにはほどとおい", "còn xa mới đạt mục tiêu"], ["砂糖を入れたらまろやかな味になった。", "さとうをいれたらまろやかなあじになった", "thêm đường vào thì vị trở nên dịu/tròn"], ["古い体制から脱却する。", "ふるいたいせいからだっきゃくする", "thoát khỏi cơ chế cũ"], ["機材を使いこなしていた。", "きざいをつかいこなしていた", "đã sử dụng thành thạo thiết bị"]
];

supplementalVocabAnswers.push(...supplementalVocabAnswerDetails);

const supplementalSynonymAnswerMeanings = [
  ["慣れて", "なれて", "quen, đã quen"],
  ["競争して", "きょうそうして", "cạnh tranh, ganh đua"],
  ["うれしい知らせ", "うれしいしらせ", "tin vui"],
  ["面倒な", "めんどうな", "phiền phức, rắc rối"],
  ["皮肉", "ひにく", "mỉa mai, châm biếm"],
  ["少なかった", "すくなかった", "ít, không nhiều"],
  ["曇っていて暗かった", "くもっていてくらかった", "trời âm u và tối"],
  ["順調に進んでいる", "じゅんちょうにすすんでいる", "đang tiến triển thuận lợi"],
  ["中止する", "ちゅうしする", "hủy, dừng lại giữa chừng"],
  ["今までになく新しい", "いままでになくあたらしい", "mới mẻ chưa từng có trước đây"],
  ["計画して", "けいかくして", "lên kế hoạch"],
  ["便利で役に立っている", "べんりでやくにたっている", "tiện lợi và có ích"],
  ["厳しい", "きびしい", "nghiêm khắc, khắc nghiệt"],
  ["平凡な", "へいぼんな", "bình thường, không có gì đặc biệt"],
  ["できる限り", "できるかぎり", "hết mức có thể"],
  ["意外につまらない", "いがいにつまらない", "bất ngờ là chán, không thú vị như nghĩ"],
  ["刺激を受けて", "しげきをうけて", "được kích thích, được truyền cảm hứng"],
  ["規模", "きぼ", "quy mô"],
  ["何度も", "なんども", "nhiều lần"],
  ["相手", "あいて", "đối phương, người/cái ở phía bên kia"],
  ["悪く言われる", "わるくいわれる", "bị nói xấu, bị chê bai"],
  ["面倒だ", "めんどうだ", "phiền phức, rắc rối"],
  ["事前に", "じぜんに", "trước, từ trước"],
  ["ほかと比べて特に良かった", "ほかとくらべてとくによかった", "đặc biệt tốt hơn so với những cái khác"],
  ["支援", "しえん", "hỗ trợ, viện trợ"],
  ["とても驚いた", "とてもおどろいた", "rất ngạc nhiên"],
  ["熱心に取り組んでいる", "ねっしんにとりくんでいる", "đang nỗ lực làm một cách nhiệt tình"],
  ["大幅に", "おおはばに", "rất nhiều, trên diện rộng"],
  ["非常に", "ひじょうに", "rất, cực kỳ"],
  ["心配", "しんぱい", "lo lắng"],
  ["不注意な", "ふちゅういな", "bất cẩn, thiếu chú ý"],
  ["思い返して", "おもいかえして", "nghĩ lại, nhớ lại"],
  ["分担", "ぶんたん", "phân chia đảm nhiệm"],
  ["完成したら", "かんせいしたら", "khi hoàn thành"],
  ["大体同じだ", "だいたいおなじだ", "gần như giống nhau"],
  ["苦情", "くじょう", "khiếu nại, phàn nàn"],
  ["勘違いする", "かんちがいする", "hiểu nhầm"],
  ["一度に大勢来た", "いちどにおおぜいきた", "nhiều người đến cùng một lúc"],
  ["言い訳して", "いいわけして", "bào chữa, viện cớ"],
  ["慌てずに", "あわてずに", "không hoảng, bình tĩnh"],
  ["突然", "とつぜん", "đột nhiên"],
  ["大げさに", "おおげさに", "phóng đại, làm quá lên"],
  ["明白に 1)", "めいはくに", "một cách rõ ràng"],
  ["何とか", "なんとか", "bằng cách nào đó, xoay xở"],
  ["小さな", "ちいさな", "nhỏ"],
  ["困って", "こまって", "gặp khó khăn, bối rối"],
  ["以前から", "いぜんから", "từ trước"],
  ["謝った", "あやまった", "đã xin lỗi"],
  ["怖がって", "こわがって", "sợ hãi"],
  ["あきらめずに。", "あきらめずに", "không bỏ cuộc"],
  ["細かく丁寧に", "こまかくていねいに", "tỉ mỉ và cẩn thận"],
  ["悪いところ", "わるいところ", "điểm xấu, khuyết điểm"],
  ["怒ったような顔をしていた", "おこったようなかおをしていた", "trông có vẻ tức giận"],
  ["問い合わせた", "といあわせた", "đã hỏi, đã liên hệ để hỏi"],
  ["決意", "けつい", "quyết tâm"],
  ["競い合って", "きそいあって", "cạnh tranh, thi đua với nhau"],
  ["頑固な", "がんこな", "bướng bỉnh, cố chấp"],
  ["できるだけ早く", "できるだけはやく", "càng sớm càng tốt"],
  ["短い", "みじかい", "ngắn"],
  ["失敗して", "しっぱいして", "thất bại, làm hỏng"],
  ["薄く切って", "うすくきって", "cắt mỏng"],
  ["一人一人に", "ひとりひとりに", "cho từng người một"],
  ["詳しく丁寧に", "くわしくていねいに", "chi tiết và cẩn thận"],
  ["なかなか返事をしようとしなかった", "なかなかへんじをしようとしなかった", "mãi không chịu trả lời"],
  ["小型の", "こがたの", "cỡ nhỏ, loại nhỏ"],
  ["小さな声で言う", "ちいさなこえでいう", "nói nhỏ"],
  ["疲れて", "つかれて", "mệt"],
  ["完了する", "かんりょうする", "hoàn tất"],
  ["珍しい", "めずらしい", "hiếm, lạ"],
  ["熱中した", "ねっちゅうした", "say mê, mải mê"],
  ["検討", "けんとう", "xem xét, cân nhắc"],
  ["じっと見た", "じっとみた", "nhìn chăm chú"],
  ["想像の", "そうぞうの", "thuộc tưởng tượng"],
  ["愚痴を言っている", "ぐちをいっている", "đang than vãn, càu nhàu"],
  ["口数が少ない", "くちかずがすくない", "ít nói"],
  ["混乱した", "こんらんした", "bối rối, rối loạn"],
  ["遅くなりそうだ", "おそくなりそうだ", "có vẻ sẽ muộn"],
  ["大して", "たいして", "không mấy, không đáng kể"],
  ["規模1)", "きぼ", "quy mô"],
  ["貢献", "こうけん", "đóng góp, cống hiến"],
  ["危険", "きけん", "nguy hiểm"],
  ["非常に素晴らしいとほめた", "ひじょうにすばらしいとほめた", "khen là vô cùng tuyệt vời"],
  ["選挙に出る", "せんきょにでる", "ra tranh cử"],
  ["刺激されて", "しげきされて", "bị kích thích, được khơi gợi"],
  ["自由な", "じゆうな", "tự do, thoải mái"],
  ["早く正確に", "はやくせいかくに", "nhanh và chính xác"],
  ["用意した", "よういした", "đã chuẩn bị"],
  ["場所", "ばしょ", "địa điểm, nơi chốn"],
  ["差がない", "さがない", "không có khác biệt"],
  ["批判", "ひはん", "phê phán, chỉ trích"],
  ["やせ衰えて", "やせおとろえて", "gầy yếu, tiều tụy"],
  ["必死に頑張って", "ひっしにがんばって", "cố gắng hết sức"],
  ["思いがけない", "おもいがけない", "không ngờ tới, bất ngờ"],
  ["熱中して", "ねっちゅうして", "say mê, mải mê"],
  ["順調に進みました", "じゅんちょうにすすみました", "đã tiến triển thuận lợi"],
  ["我慢", "がまん", "chịu đựng, nhẫn nhịn"],
  ["慣習", "かんしゅう", "tập quán, thông lệ"],
  ["任せる", "まかせる", "giao phó, để cho ai làm"],
  ["爽やかな", "さわやかな", "sảng khoái, tươi mát"],
  ["用意する", "よういする", "chuẩn bị"],
  ["下を向いて", "したをむいて", "cúi xuống, nhìn xuống"],
  ["苦難", "くなん", "khổ nạn, gian khổ"],
  ["慌てる", "あわてる", "hoảng, vội vàng cuống lên"],
  ["自分で買う", "じぶんでかう", "tự mình mua"],
  ["だらしない", "だらしない", "luộm thuộm, bê bối, không chỉnh tề"],
  ["じっくりと", "じっくりと", "kỹ lưỡng, cẩn thận, thong thả xem xét"],
  ["しかたなく", "しかたなく", "miễn cưỡng, không còn cách nào khác"],
  ["ヒント", "ヒント", "gợi ý, manh mối"],
  ["すぐには", "すぐには", "ngay lập tức thì không"],
  ["はっきりしている", "はっきりしている", "rõ ràng, minh bạch"],
  ["がっかりした", "がっかりした", "thất vọng, hụt hẫng"],
  ["さわやかな", "さわやかな", "sảng khoái, tươi mát"],
  ["シンプルな", "シンプルな", "đơn giản"],
  ["こっそり", "こっそり", "lén lút, âm thầm"],
  ["あきらめた", "あきらめた", "đã từ bỏ"],
  ["しばらくは", "しばらくは", "trong một thời gian, tạm thời"],
  ["これまでの", "これまでの", "từ trước đến nay"],
  ["だいたい", "だいたい", "đại khái, gần như, nhìn chung"],
  ["しくみ", "しくみ", "cơ chế, cấu trúc, cách vận hành"],
  ["ただで", "ただで", "miễn phí, không mất tiền"],
  ["どうしようもない", "どうしようもない", "không thể làm gì được, hết cách"],
  ["やはり", "やはり", "quả nhiên, vẫn là, đúng như nghĩ"],
  ["アドバイス", "アドバイス", "lời khuyên, góp ý"],
  ["プライド", "プライド", "lòng tự trọng, niềm kiêu hãnh"],
  ["わざと", "わざと", "cố ý"],
  ["ほっとした", "ほっとした", "nhẹ nhõm, yên tâm"],
  ["なんとなく", "なんとなく", "không rõ vì sao, cảm giác là"],
  ["わずかに", "わずかに", "chỉ một chút, hơi"],
  ["とりけした", "とりけした", "đã hủy bỏ"],
  ["ぼんやりしていた", "ぼんやりしていた", "lơ đãng, mơ hồ, không rõ ràng"],
  ["じゃまする", "じゃまする", "cản trở, làm phiền"],
  ["はっきり", "はっきり", "rõ ràng, dứt khoát"],
  ["できるだけ", "できるだけ", "hết mức có thể"],
  ["つながり", "つながり", "mối liên hệ, sự kết nối"],
  ["ゆっくりして", "ゆっくりして", "thư thả, nghỉ ngơi thong thả"],
  ["あいまい", "あいまい", "mơ hồ, không rõ ràng"],
  ["いくつか", "いくつか", "một vài, một số"],
  ["おだやか", "おだやか", "ôn hòa, bình lặng"],
  ["ダメージ", "ダメージ", "thiệt hại, tổn hại"],
  ["おおげさに", "おおげさに", "phóng đại, làm quá lên"],
  ["しばらく", "しばらく", "một lúc, một thời gian"]
];

supplementalVocabAnswers.push(...supplementalSynonymAnswerMeanings);

const grammarPatterns = [
  ["だけ", "chỉ/đến mức; trong mẫu 「Vるだけ無駄」 nghĩa là làm cũng vô ích"],
  ["を受けて", "chịu tác động từ, dựa trên bối cảnh/sự kiện trước đó"],
  ["なり", "vừa mới... thì ngay lập tức..."],
  ["恐れがある以上", "vì có nguy cơ/khả năng xảy ra nên không thể không xử lý"],
  ["ほどの", "đến mức, tới mức"],
  ["ところだが", "đang muốn/đáng lẽ muốn... nhưng"],
  ["とは", "thể hiện sự ngạc nhiên: thật không ngờ là..."],
  ["という", "nghe nói/là rằng; dùng để dẫn thông tin"],
  ["があってはならない", "không được phép có/chuyện đó không được xảy ra"],
  ["なんかでいいんですか", "người như tôi/em có ổn không; cách nói khiêm nhường"],
  ["かつ", "hơn nữa, đồng thời; nối hai trạng thái/cách làm cùng đúng"],
  ["極まりない", "cực kỳ, hết sức; thường dùng với đánh giá tiêu cực"],
  ["ように思われる", "có vẻ như, được cảm thấy là"],
  ["とあっては", "nếu đã là/vì là tình huống đặc biệt như vậy thì"],
  ["言わせると", "theo cách nói/nhìn nhận của ai đó"],
  ["かと思いきや", "cứ tưởng là... nhưng trái lại/bất ngờ là..."],
  ["ものなら", "nếu có thể...; thường nói điều khó thực hiện"],
  ["ことには", "nếu không... thì; điều kiện tiên quyết"],
  ["を最後に", "kể từ/lấy lần đó làm lần cuối"],
  ["を皮切りに", "mở đầu bằng..., bắt đầu từ..."],
  ["に沿って", "theo, dựa theo"],
  ["浴びようとも", "dù có bị hứng chịu/nhận... đi nữa"],
  ["あったらあったで", "nếu có thì lại phát sinh chuyện theo kiểu có"],
  ["知らされておらず", "không được thông báo nên..."],
  ["としか言いようがない", "chỉ có thể nói là..."],
  ["わけではない", "không hẳn là, không có nghĩa là"],
  ["ずにはいられない", "không thể không..., buộc phải... do cảm xúc"],
  ["次第", "ngay sau khi..."],
  ["にわたって", "trải suốt/phạm vi kéo dài qua..."],
  ["をめぐって", "xoay quanh vấn đề..."],
  ["反面", "mặt khác, trái lại ở một khía cạnh"],
  ["によって", "do, bởi; tùy theo"],
  ["それどころか", "không những không vậy, trái lại còn..."],
  ["それにもかかわらず", "mặc dù vậy, tuy thế mà"],
  ["かのように", "như thể là..."],
  ["だって", "ngay cả..., đến cả...; dùng để nêu ví dụ nhấn mạnh"],
  ["でさえ", "ngay cả, đến cả"],
  ["といっても", "nói là... nhưng thực ra/nhưng cũng chỉ..."],
  ["くらいなら", "nếu phải... thì thà... còn hơn"],
];

const supplementalPhraseMeanings = {
  "受け入れられは": "trong mẫu 「Vられはしない」, nhấn mạnh phủ định: tuyệt đối không thể được chấp nhận",
  "いっさい": "hoàn toàn, tuyệt nhiên; thường đi với phủ định",
  "おわび申し上げます": "xin thành thật cáo lỗi; cách nói khiêm nhường trang trọng",
  "じゃないか": "chẳng phải là... sao; dùng để xác nhận hoặc nhấn mạnh",
  "刺されでもしたら": "nếu lỡ bị đốt/chích thì; 「でも」 nêu ví dụ xấu giả định",
  "べきではないのでしょうか": "chẳng phải là không nên... hay sao; nêu ý kiến phản biện",
  "させられた": "bị bắt phải làm; thể sai khiến bị động",
  "のではないか": "có lẽ là, chẳng phải là... sao",
  "お出しする以上": "một khi đã đưa ra; 「以上」 = đã... thì phải",
  "ばかばかしく思えるくらい": "đến mức thấy thật ngớ ngẩn",
  "ゆえに": "vì, bởi vì; văn viết trang trọng",
  "お聞かせ願えますか": "xin vui lòng cho tôi được nghe; cách nhờ vả lịch sự",
  "受け入れがたいのではないか": "có lẽ khó chấp nhận",
  "続けていってほしいものです": "mong là sẽ tiếp tục làm như vậy",
  "いたしかねます": "khó có thể làm được; cách từ chối khiêm nhường",
  "別れさせられそうになる": "suýt bị ép phải chia tay",
  "やってください": "hãy làm giúp/ hãy làm đi",
  "上がり": "dạng liên dụng nối câu của 上がる",
  "帰るべく": "để về; 「べく」 = nhằm mục đích",
  "雨だろうと雪だろうと": "dù là mưa hay tuyết thì cũng",
  "雤だろうと雪だろうと": "dù là mưa hay tuyết thì cũng",
  "を思って": "nghĩ đến, vì nghĩ cho",
  "疑いようがないものの": "dù không có cách nào nghi ngờ, tuy chắc chắn là",
  "間に合いそうになかったら": "nếu có vẻ sẽ không kịp",
  "といいましょうか": "có thể nói là..., phải gọi là...",
  "だけでも": "chỉ riêng... thôi cũng",
  "はたして": "quả thật, liệu có thực sự",
  "取っといて": "khẩu ngữ của 取っておいて = cứ giữ lại trước",
  "ご覧になった上で": "sau khi quý vị xem; 「上で」 = sau khi làm rồi",
  "夢を夢で": "giữ giấc mơ chỉ là giấc mơ",
  "やるとするか": "giả sử là làm thì...",
  "思わせてくれた": "đã khiến tôi nghĩ/cảm thấy",
  "危険": "nguy hiểm",
  "といったらない": "không gì... bằng; cực kỳ",
  "働ける": "có thể làm việc",
  "それを": "ấy vậy mà, thế mà",
  "わかんないんだもん": "vì không hiểu mà; khẩu ngữ có sắc thái phân trần",
  "どうやら": "có vẻ như, xem ra",
  "着られなくはなかった": "không phải là không mặc được; có thể mặc nhưng...",
  "入るか入らないか": "vừa mới vào hay chưa kịp vào thì",
  "悔やまれてならない": "không sao ngừng hối tiếc được",
  "まるで": "hoàn toàn như, cứ như",
  "見ていなければ": "nếu không xem/không nhìn",
  "思い出される": "tự nhiên nhớ lại",
  "出てからでは": "nếu đợi đến sau khi ra rồi thì",
  "頼んじゃわないか": "sao không nhờ luôn đi; khẩu ngữ rủ rê",
  "大人は大人で": "người lớn thì cũng có cái của người lớn",
  "でいいから": "chỉ cần... là được",
  "といえるだろうか": "liệu có thể nói là... hay không",
  "果たして": "quả thật, liệu thực sự",
  "しようと": "dù có định làm; trong mẫu nhượng bộ/ý chí",
  "するもしないも": "làm hay không làm đều",
  "作ってみせる": "sẽ làm cho xem",
  "つかもうとしたものの": "dù đã định nắm lấy nhưng",
  "読み": "dạng liên dụng nối câu của 読む",
  "もっとも": "tuy nhiên; nói thêm điều chỉnh",
  "知られては": "nếu bị biết thì",
  "なんら": "hoàn toàn; thường đi với phủ định",
  "ことは否めない": "không thể phủ nhận rằng",
  "行くんなら": "nếu đi thì; khẩu ngữ của 行くのなら",
  "咲かせた": "đã làm nở rộ",
  "願います": "xin, mong",
  "までも": "đến cả, thậm chí",
  "食べるんじゃなかった": "lẽ ra không nên ăn",
  "守るべく、": "để bảo vệ",
  "のをいいことに": "lợi dụng việc...",
  "させられるところだった": "suýt bị bắt phải làm",
  "そう": "nghe nói là / có vẻ là; tùy ngữ cảnh",
  "言うべきところを": "đáng lẽ phải nói... vậy mà",
  "文句のつけようがないだけに": "chính vì hoàn hảo đến mức không chê vào đâu được",
  "きたんじゃなかった": "đã chẳng phải là đã đến sao",
  "ならないともかぎらない": "không phải là không thể trở thành; vẫn có khả năng",
  "それが": "thế mà, vậy mà",
  "ないくせに": "mặc dù không... mà lại",
  "対戦している": "đang thi đấu với nhau",
  "あがります": "xin làm/ xin dâng; cách nói khiêm nhường tùy ngữ cảnh",
  "楽しむどころではなかった": "không còn tâm trí đâu mà tận hưởng",
  "ならまだしも": "nếu là... thì còn được, đằng này...",
  "落とそうとするあまり": "vì quá cố muốn hạ xuống/làm rơi nên",
  "はどうあれ": "dù... thế nào đi nữa",
  "言っといて": "khẩu ngữ của 言っておいて = nói trước đi",
  "と相まって": "kết hợp với, cộng hưởng với",
  "立ち上がれそうにないぐらい": "đến mức có vẻ không đứng dậy nổi",
  "書くんだっけ": "đã viết thế nào ấy nhỉ",
  "いつか": "một ngày nào đó",
  "場合を除いて": "trừ trường hợp",
  "入れっぱなしだった": "đã để nguyên trong đó suốt",
  "からしか": "chỉ từ... mà thôi",
  "真剣": "nghiêm túc",
  "するうちに": "trong khi làm thì dần dần",
  "できずにいたところ": "đang trong lúc vẫn chưa làm được thì",
  "歩けなくもない": "không phải là không đi bộ được",
  "読めるんだもん": "vì đọc được mà; khẩu ngữ phân trần",
  "あっての": "nhờ có... thì mới có ý nghĩa/tồn tại",
  "読み返しては": "cứ đọc lại rồi lại...",
  "といたしましては": "về phía... mà nói; cách nói khiêm nhường trang trọng",
  "買ったはいいが": "mua thì đã mua rồi nhưng",
  "不快な思いをした": "đã có cảm giác khó chịu",
  "なくしては": "nếu không có... thì không thể",
  "とするには": "để coi là..., nếu muốn xem là...",
  "遊んでいた": "đã chơi, đang chơi",
  "３) は": "mẫu 「Vます＋はする」 = có làm/có thể làm, nhưng phía sau nêu hạn chế",
  "お越しになる際は": "khi quý vị đến, khi tới nơi tư vấn",
  "なるかどうかはともかく": "chưa bàn là có thành hay không, tạm gác chuyện có trở thành hay không",
  "かのごとく": "như thể là, cứ như là",
  "始末だった": "kết cục là, rốt cuộc rơi vào tình trạng",
  "だけのことだ": "chỉ đơn giản là vậy thôi",
  "悩まされることはない": "sẽ không còn bị làm phiền/khổ sở vì",
  "強まる見込みです": "dự kiến sẽ mạnh lên",
  "知りたがるものです": "thường muốn biết, hay muốn hỏi",
  "緊張するんだから": "vì ngay cả người lớn cũng căng thẳng",
  "行動なのだ": "là hành động như vậy",
  "評判も良くなった": "đánh giá/danh tiếng cũng tốt lên",
  "睡眠の質があるなんて": "rằng có thứ gọi là chất lượng giấc ngủ",
  "扱える人材の確保やコスト面での難しさから": "do khó khăn về bảo đảm nhân sự có thể xử lý và về mặt chi phí",
  "話すことで": "bằng việc nói ra, nhờ nói chuyện",
  "会ってこそ": "chỉ khi gặp trực tiếp thì mới",
  "思い出してください": "hãy nhớ lại",
  "小説でもあるまい": "đâu phải tiểu thuyết, không phải chuyện như trong tiểu thuyết",
  "褒めたり叱ったりする": "khen rồi mắng, vừa khen vừa mắng tùy lúc",
  "否定できなくなる": "trở nên không thể phủ nhận",
  "たしかに": "đúng là, quả thật",
  "そのためだ": "là vì lý do đó",
  "使者のようでもある": "cũng giống như một sứ giả",
  "日もあれば": "có ngày thì..., cũng có ngày...",
  "思えないほどの": "đến mức không thể nghĩ là",
  "自分は花粉症だという": "rằng bản thân bị dị ứng phấn hoa",
  "思える道を": "con đường mà mình có thể nghĩ là",
  "か否か": "có hay không",
  "30年前までは": "cho đến 30 năm trước",
  "環境があれば": "nếu có môi trường/điều kiện",
  "迷うほど": "đến mức phân vân, khó phân biệt",
  "うそになるが": "nói vậy thì thành nói dối, không phải thật lòng",
  "わたしにとって": "đối với tôi",
  "もしかしたら": "biết đâu, có lẽ",
  "生まれるからだが": "là vì nó sinh ra/phát sinh",
  "ものか": "làm sao mà..., nhất định không",
  "書けてるじゃない": "viết được khá tốt đấy chứ",
  "とかで": "hình như vì..., nghe nói là do...",
  "にもなっておらず": "không hề thành/đạt tới mức",
  "来たり来なかったり": "lúc đến lúc không",
  "入らなきゃいけないってわけじゃない": "không có nghĩa là bắt buộc phải tham gia",
  "診察できる": "có thể khám/chẩn đoán",
  "がちな": "có xu hướng hay..., dễ...",
  "そうではなく": "không phải vậy mà là",
  "私としては": "về phía tôi, theo tôi",
  "まず": "trước hết",
  "別の": "khác, một cái khác",
  "いれば": "nếu có/ở đó thì",
  "わかってくるはずだ": "chắc sẽ dần hiểu ra",
  "など": "như là, chẳng hạn",
  "なかなか": "khá, tương đối; mãi mà không",
  "見逃す": "bỏ lỡ, không xem được",
  "聞こうにも": "dù muốn hỏi cũng không thể",
  "任されるまでになったが": "đã đến mức được giao phó, nhưng",
  "やってみなきゃ": "nếu không thử làm thì",
  "答えておけばいいんだよ": "cứ trả lời sẵn như vậy là được",
  "失わせてしまうおそれがある": "có nguy cơ làm mất đi",
  "鶴が": "con hạc là chủ thể của hành động",
  "わけにもいかず": "không thể cứ để vậy/không làm vậy được",
  "日本の将来を見据えながら": "vừa nhìn tới tương lai của Nhật Bản",
  "初めて": "lần đầu tiên, chỉ khi... mới",
  "それは": "điều đó thì",
  "見つけられなかった": "đã không thể tìm thấy",
  "一方で": "mặt khác",
  "その時のことである": "đó là chuyện vào lúc ấy",
  "こうした": "những điều như vậy, kiểu này",
  "と引きかえに": "đổi lại, đánh đổi với",
  "なにも": "không cần phải..., đâu nhất thiết",
  "探すったって": "nói là tìm nhưng...",
  "そうかと思えば": "vừa tưởng như vậy thì lại...",
  "くれればよかったのに": "giá mà đã làm cho tôi thì tốt",
  "買えずにいた": "đã không mua được, cứ trong trạng thái chưa mua được",
  "聞こえはいいがに": "nghe thì hay đấy nhưng",
  "新人に務まるのかと": "liệu người mới có đảm đương được không",
  "進めた": "đã tiến hành, đã thúc đẩy",
  "における": "ở, trong phạm vi",
  "消すように": "như để xóa đi",
};

const n1GrammarPatterns = Array.isArray(window.n1GrammarExtra) ? window.n1GrammarExtra : [];
grammarPatterns.push(...n1GrammarPatterns);
const sortedN1GrammarPatterns = [...n1GrammarPatterns].sort((a, b) => String(b[0]).length - String(a[0]).length);

function labelFor(title, questionNumber) {
  if (questionNumber <= 25) return `${title} - Từ vựng`;
  if (questionNumber <= 40) return `${title} - Ngữ pháp`;
  if (questionNumber <= 44) return `${title} - Ngữ pháp đoạn văn`;
  return `${title} - Đọc hiểu`;
}

function n1EntriesForText(text, maxItems = 6) {
  const source = String(text || "");
  const found = [];
  sortedN1Vocabulary.forEach(([word, reading, meaning]) => {
    if (found.length >= maxItems) return;
    if (!isUsefulStudyEntry(word, reading, meaning)) return;
    if (source.includes(word) && !found.some((item) => item.word === word)) {
      found.push({ word, reading, meaning });
    }
  });
  return found;
}

function isUsefulStudyEntry(word, reading, meaning) {
  const source = String(word || "");
  const readingText = String(reading || "");
  const note = String(meaning || "");
  if (!source || !note) return false;
  if (note.includes("⇔") || note.includes("đáp án đúng trong câu này") || note.includes("cách đọc trong câu là")) return false;
  if (["かない", "ュー"].includes(source)) return false;
  return true;
}

function highlightedTargetFromHtml(htmlPrompt) {
  if (!htmlPrompt) return "";
  const match = htmlPrompt.match(/<span class="kanji-target">([^<]+)<\/span>/);
  return match ? match[1] : "";
}

function n2EntriesForText(text, maxItems = 6) {
  const source = String(text || "");
  const found = [];
  sortedN2Vocabulary.forEach(([word, reading, meaning]) => {
    if (found.length >= maxItems) return;
    if (source.includes(word) && !found.some((item) => item.word === word)) {
      found.push({ word, reading, meaning });
    }
  });
  return found;
}

function fallbackN1EntryForQuestion(question) {
  const number = questionNumber(question);
  if (number < 1 || number > 25) return null;

  const target = question.targetWord || highlightedTargetFromHtml(question.htmlPrompt) || targetFromQuestionText(question);
  if (!target) return null;

  const known = studyEntriesForText(target, 1)[0];
  const correct = question.options[question.answer] || "";
  let reading = known?.reading || "";
  let meaning = known?.meaning || "";

  if (number <= 6) {
    if (!meaning) return null;
    reading = known?.reading || correct || reading;
  } else if (number <= 13) {
    reading = reading || target;
    meaning = meaning || `từ đúng trong ngữ cảnh là ${correct}`;
  } else if (number <= 19) {
    reading = reading || target;
    meaning = meaning || `gần nghĩa với ${correct}`;
  } else {
    reading = reading || target;
    meaning = meaning || `cách dùng đúng: ${correct}`;
  }

  return { word: target, reading, meaning };
}

function studyEntriesForText(text, maxItems = 1) {
  const source = String(text || "");
  const found = [];
  sortedStudyVocabulary.forEach(([word, reading, meaning]) => {
    if (found.length >= maxItems) return;
    if (!isUsefulStudyEntry(word, reading, meaning)) return;
    if (source.includes(word) && !found.some((item) => item.word === word)) {
      found.push({ word, reading, meaning });
    }
  });
  return found;
}

function entryForExactTerm(term) {
  const source = normalizeLookupTerm(term);
  return supplementalVocabAnswers.find(([word]) => normalizeLookupTerm(word) === source) || sortedStudyVocabulary.find(([word]) => normalizeLookupTerm(word) === source);
}

function vocabAnswerForms(term) {
  const source = normalizeLookupTerm(term);
  const forms = new Set([source]);
  [
    [/に$/, ""],
    [/な$/, ""],
    [/と$/, ""],
    [/して$/, ""],
    [/されて$/, ""],
    [/られて$/, ""],
    [/れて$/, "れる"],
    [/って$/, "う"],
    [/んで$/, "む"],
    [/いで$/, "ぐ"],
    [/して$/, "する"],
    [/した$/, "する"],
    [/た$/, "る"],
    [/て$/, "る"],
  ].forEach(([pattern, replacement]) => {
    if (pattern.test(source)) forms.add(source.replace(pattern, replacement));
  });
  return [...forms].filter(Boolean);
}

function normalizeLookupTerm(term) {
  return String(term || "")
    .normalize("NFKC")
    .trim()
    .replace(/^\d+\s*/, "");
}

function lookupVocabAnswer(term) {
  for (const form of vocabAnswerForms(term)) {
    const entry = entryForExactTerm(form) || sortedStudyVocabulary.find(([word]) => word === form);
    if (entry && isUsefulStudyEntry(entry[0], entry[1], entry[2])) return { word: term, base: entry[0], reading: entry[1], meaning: entry[2] };
  }
  return null;
}

function cleanMeaningText(meaning) {
  return String(meaning || "")
    .replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/u, "")
    .replace(/\s+[①②③④⑤⑥⑦⑧⑨⑩]\s*/gu, "; ")
    .trim();
}

function hanVietForText(text) {
  const kanji = [...String(text || "")].filter((char) => /[\u3400-\u9fff]/u.test(char));
  if (!kanji.length) return "";
  const readings = kanji.map((char) => {
    const value = hanVietMap[char];
    if (Array.isArray(value)) return value[0] || "";
    return String(value || "").split(/[,\s]+/)[0];
  });
  return readings.filter(Boolean).join(" ");
}

function vocabNoteText(word, reading, meaning) {
  const hanViet = hanVietForText(word);
  const pronunciation = hanViet ? `${reading}, ${hanViet}` : reading;
  return `${word}（${pronunciation}）= ${cleanMeaningText(meaning)}`;
}

function termMeaning(term) {
  const entry = lookupVocabAnswer(term);
  return entry ? vocabNoteText(entry.word, entry.reading, entry.meaning) : `「${term}」`;
}

function answerMeaningLine(term) {
  const entry = lookupVocabAnswer(term);
  if (!entry) return `Đáp án đúng: 「${term}」. Chưa có nghĩa tiếng Việt trong từ điển, cần bổ sung.`;
  const baseNote = entry.base !== term ? `, gốc: ${entry.base}` : "";
  const hanViet = hanVietForText(entry.base);
  const pronunciation = [entry.reading && entry.reading !== term && entry.reading !== entry.base ? entry.reading : "", hanViet].filter(Boolean).join(", ");
  const readingNote = pronunciation ? `（${pronunciation}）` : "";
  return `Đáp án đúng: 「${term}」${readingNote} = ${cleanMeaningText(entry.meaning)}${baseNote}.`;
}

function optionMeanings(item) {
  const notes = (item.options || [])
    .map((option) => entryForExactTerm(option))
    .filter(Boolean)
    .map(([word, reading, meaning]) => vocabNoteText(word, reading, meaning));
  return notes.length >= 2 ? ` Các lựa chọn cần phân biệt: ${notes.join("; ")}.` : "";
}

function grammarMeaning(pattern) {
  const source = String(pattern || "");
  const found = grammarPatterns.find((entry) => grammarKeys(entry).some((key) => source.includes(key) || key.includes(source)));
  return found ? `Mẫu ngữ pháp 「${pattern}」 = ${found[1]}.` : "";
}

function grammarAnswerLine(pattern) {
  const source = String(pattern || "");
  const found = grammarPatterns.find((entry) => grammarKeys(entry).some((key) => source.includes(key) || key.includes(source)));
  if (found) {
    return `Đáp án ngữ pháp: 「${pattern}」. Mẫu 「${found[0]}」 nghĩa là: ${found[1]}.`;
  }
  const phraseMeaning = phraseMeaningFallback(pattern);
  return phraseMeaning ? `Đáp án ngữ pháp/cụm đúng: 「${pattern}」 = ${phraseMeaning}.` : "";
}

function phraseMeaningFallback(pattern) {
  const source = String(pattern || "").trim().replace(/[。、「」]/g, "");
  const direct = supplementalPhraseMeanings[source];
  if (direct) return direct;
  if (source.includes("くらいなら") || source.includes("ぐらいなら")) return "nếu phải... thì thà... còn hơn";
  if (source.includes("かもしれない")) return "có lẽ, có thể";
  if (source.includes("ようとはしない") || source.includes("ようとはしなかった")) return "không hề định/không chịu làm";
  if (source.includes("だろうが") && source.includes("だろうが")) return "dù là... hay là... thì cũng";
  if (source.includes("なくて済") || source.includes("ずに済")) return "khỏi phải, không cần phải";
  if (source.includes("わけがない")) return "không thể nào";
  if (source.includes("までもない")) return "không đến mức phải, không cần phải";
  if (source.includes("わけにはいか")) return "không thể làm vậy được vì hoàn cảnh/đạo lý";
  if (source.includes("ことはないにしても")) return "dù chưa đến mức... nhưng";
  if (source.includes("にすぎ")) return "chỉ là, không hơn gì";
  if (source.includes("に越したことは")) return "không gì tốt hơn là";
  if (source.includes("ものか")) return "làm sao có chuyện...; phủ định mạnh";
  if (source.includes("ものなら")) return "nếu có thể";
  if (source.includes("べく")) return "để, nhằm mục đích";
  if (source.includes("ものを")) return "giá mà... thì đã; vậy mà";
  if (source.includes("ものだ")) return "vốn là, thường là";
  if (source.includes("ものではない")) return "không nên";
  if (source.includes("ばかりいても始まらない")) return "cứ chỉ... mãi thì cũng chẳng giải quyết được gì";
  if (source.includes("ばかりもいられない")) return "không thể cứ chỉ... mãi được";
  if (source.includes("に決まっている")) return "chắc chắn là";
  if (source.includes("に違いない")) return "chắc chắn là";
  if (source.includes("ともいうべき")) return "có thể gọi là";
  if (source.includes("といったところ")) return "cỡ khoảng, chừng";
  if (source.includes("といっても過言ではない")) return "nói là... cũng không quá lời";
  if (source.includes("しかない")) return "chỉ còn cách";
  if (source.includes("あるまい")) return "chắc là không, hẳn là không";
  if (source.includes("っこない")) return "không đời nào, không thể nào";
  if (source.includes("かねない")) return "có thể dẫn đến kết quả xấu";
  if (source.includes("おそれがある")) return "có nguy cơ";
  if (source.includes("つつある")) return "đang dần";
  if (source.includes("次第では")) return "tùy tình hình mà";
  if (source.includes("に先立ち")) return "trước khi, trước thềm";
  if (source.includes("を機に")) return "nhân dịp, lấy đó làm bước ngoặt";
  if (source.includes("をもって")) return "lấy mốc đó, kể từ/đến thời điểm đó";
  if (source.includes("を最後に")) return "lấy đó làm lần cuối";
  if (source.includes("にともない") || source.includes("に伴い")) return "cùng với, kéo theo";
  if (source.includes("と引きかえに") || source.includes("と引き換えに")) return "đổi lại, đánh đổi bằng";
  if (source.includes("がゆえ")) return "chính vì";
  if (source.includes("よそに")) return "bất chấp, mặc cho";
  if (source.includes("ならでは")) return "đặc trưng chỉ có ở";
  if (source.includes("においてさえ")) return "ngay cả ở/trong";
  if (source.includes("末に")) return "sau khi trải qua";
  if (source.includes("を受けて")) return "nhận, chịu tác động từ";
  if (source.includes("をめぐって")) return "xoay quanh";
  if (source.includes("によって")) return "do, bởi; tùy theo";
  if (source.includes("反面")) return "mặt khác, trái lại";
  if (source.includes("につけ")) return "mỗi khi";
  if (source.includes("にしてみれば")) return "đứng từ phía... mà nói";
  if (source.includes("にしては")) return "so với... thì";
  if (source.includes("において")) return "ở, trong phạm vi";
  if (source.includes("に沿って")) return "theo, dọc theo";
  if (source.includes("とあって")) return "vì là hoàn cảnh đặc biệt nên";
  if (source.includes("とあっては")) return "nếu đã là tình huống như vậy thì";
  if (source.includes("ことから")) return "từ việc... nên";
  if (source.includes("ことには")) return "nếu không... thì";
  if (source.includes("ことか")) return "biết bao, biết chừng nào";
  if (source.includes("限り")) return "chừng nào còn, trong phạm vi";
  if (source.includes("ほど")) return "đến mức";
  if (source.includes("など")) return "như là, những thứ như";
  if (source.includes("まま")) return "giữ nguyên trạng thái";
  if (source.includes("として")) return "với tư cách là, như là";
  if (source.includes("はず")) return "lẽ ra, chắc là";
  if (source.includes("つもり")) return "định là, cứ tưởng là";
  if (source.includes("ように")) return "để, sao cho; như là";
  if (source.includes("ようだ")) return "có vẻ như";
  if (source.includes("に見える") || source.includes("見え")) return "trông có vẻ";
  if (source.includes("に思われる") || source.includes("思われる")) return "được cho là, có vẻ";
  if (source.includes("存じ")) return "khiêm nhường ngữ của 思う/知る";
  if (source.includes("まいり")) return "khiêm nhường ngữ của 行く/来る";
  if (source.includes("いただ")) return "khiêm nhường/kính ngữ liên quan đến nhận hoặc nhờ làm";
  if (source.includes("なさ")) return "kính ngữ của する";
  if (source.includes("おっしゃ")) return "kính ngữ của 言う";
  if (source.includes("おいで")) return "kính ngữ của 行く/来る/いる";
  if (source.includes("頂戴")) return "khiêm nhường ngữ của もらう/nhận";
  if (source.includes("みたいなところがある")) return "có điểm/phần hơi giống như, có xu hướng giống như";
  if (source.includes("わけにはいか")) return "không thể làm vậy được vì hoàn cảnh/đạo lý không cho phép";
  if (source.includes("わけじゃない") || source.includes("わけではない")) return "không có nghĩa là, không hẳn là";
  if (source.includes("とは限らない")) return "không nhất thiết là, chưa chắc là";
  if (source.includes("に違いない")) return "chắc chắn là, hẳn là";
  if (source.includes("にすぎ")) return "chỉ là, không hơn gì";
  if (source.includes("に越したことはない")) return "không gì tốt hơn là";
  if (source.includes("にしては")) return "so với/tính theo... thì";
  if (source.includes("にとって")) return "đối với";
  if (source.includes("における") || source.includes("において")) return "ở/trong phạm vi";
  if (source.includes("にともない") || source.includes("に伴い")) return "cùng với, kéo theo";
  if (source.includes("に先立ち")) return "trước khi, trước thềm";
  if (source.includes("を機に")) return "nhân dịp, lấy đó làm bước ngoặt";
  if (source.includes("をもって")) return "lấy mốc đó, kể từ/đến thời điểm đó";
  if (source.includes("をも")) return "ngay cả, đến cả";
  if (source.includes("を控えて")) return "trước thềm, sắp đến";
  if (source.includes("ものだ")) return "thường là, vốn là; cũng dùng để hồi tưởng";
  if (source.includes("ものではない") || source.includes("ものじゃない")) return "không nên, không phải chuyện nên làm";
  if (source.includes("ものなら")) return "nếu có thể, nếu mà";
  if (source.includes("ものを")) return "giá mà... thì đã; vậy mà";
  if (source.includes("ことはない")) return "không cần phải, không có chuyện";
  if (source.includes("ことだ")) return "chỉ là việc/điều đó thôi";
  if (source.includes("ことになる")) return "dẫn đến việc, thành ra";
  if (source.includes("ことから")) return "vì, từ việc";
  if (source.includes("ことには")) return "nếu không... thì";
  if (source.includes("ほど")) return "đến mức";
  if (source.includes("ばかりに")) return "chỉ vì... mà dẫn tới kết quả xấu";
  if (source.includes("ばかり")) return "chỉ/toàn là; đang ở trạng thái chờ";
  if (source.includes("ながら")) return "vừa... vừa...; dù là... nhưng";
  if (source.includes("つもり")) return "cứ tưởng/định là";
  if (source.includes("まま")) return "giữ nguyên trạng thái";
  if (source.includes("として")) return "với tư cách là, như là";
  if (source.includes("というわけ")) return "nghĩa là, vì vậy mà";
  if (source.includes("という")) return "rằng, gọi là";
  if (source.includes("とはいえ")) return "dù nói vậy, tuy nhiên";
  if (source.includes("といっても")) return "nói là... nhưng thực ra";
  if (source.includes("とすれば")) return "nếu giả sử là";
  if (source.includes("かと思いきや") || source.includes("思いきや")) return "cứ tưởng... nhưng bất ngờ là";
  if (source.includes("か否か")) return "có hay không";
  if (source.includes("かどうか")) return "có hay không";
  if (source.includes("からには") || source.includes("からして")) return "một khi đã/vì đã";
  if (source.includes("がゆえ")) return "chính vì";
  if (source.includes("こそ")) return "chính vì/chính là; nhấn mạnh";
  if (source.includes("さえ")) return "ngay cả";
  if (source.includes("すら")) return "ngay cả";
  if (source.includes("しかない")) return "chỉ còn cách";
  if (source.includes("ずにはいられない")) return "không thể không";
  if (source.includes("ずに済む") || source.includes("なくて済む")) return "khỏi phải, không cần phải";
  if (source.includes("たがる")) return "có vẻ muốn, hay muốn";
  if (source.includes("たとん") || source.includes("とたん")) return "ngay khi... thì";
  if (source.includes("てこそ")) return "chỉ sau khi/làm... thì mới";
  if (source.includes("てはいられない")) return "không thể cứ... được";
  if (source.includes("ても始まらない")) return "có... cũng chẳng giải quyết được gì";
  if (source.includes("てもらう")) return "được ai đó làm cho";
  if (source.includes("ても")) return "dù có... thì";
  if (source.includes("ないだろう")) return "có lẽ không";
  if (source.includes("ないで")) return "không làm..., mà";
  if (source.includes("ならでは")) return "đặc trưng riêng của, chỉ có ở";
  if (source.includes("ともなれば")) return "một khi đã đến mức/là";
  if (source.includes("どころではない")) return "không còn tâm trí/không phải lúc để";
  if (source.includes("ように")) return "để, sao cho; như là";
  if (source.includes("ようだ")) return "có vẻ như";
  if (source.includes("はず")) return "lẽ ra, chắc là";
  if (source.includes("おそれがある")) return "có nguy cơ";
  if (source.includes("見込み")) return "dự kiến, có khả năng";
  return "";
}

function grammarOptionNotes(item) {
  const correctText = item.options?.[Number(item.correctAnswer) - 1] || "";
  const notes = (item.options || [])
    .filter((option) => option !== correctText)
    .map((option) => {
      const found = grammarPatterns.find((entry) => grammarKeys(entry).some((key) => String(option).includes(key) || key.includes(String(option))));
      return found ? `「${option}」= ${found[1]}` : "";
    })
    .filter(Boolean);
  return notes.length >= 2 ? ` Phân biệt nhanh với lựa chọn sai: ${notes.join("; ")}.` : "";
}

function grammarKeys(entry) {
  const [pattern, , aliases = []] = entry;
  return [pattern, ...aliases]
    .map((key) => String(key || "").replace(/[〜~]/g, "").trim())
    .filter((key) => key.length >= 2 && !["こと", "もの", "ところ", "だけ", "とは", "なり"].includes(key));
}

function n1GrammarEntriesForText(text, maxItems = 5) {
  const source = String(text || "").replace(/[〜~]/g, "");
  const found = [];
  sortedN1GrammarPatterns.forEach((entry) => {
    if (found.length >= maxItems) return;
    const [pattern, meaning] = entry;
    if (found.some((item) => item.pattern === pattern)) return;
    if (grammarKeys(entry).some((key) => source.includes(key))) {
      if (found.some((item) => String(item.pattern).replace(/[〜~]/g, "").includes(String(pattern).replace(/[〜~]/g, "")))) return;
      found.push({ pattern, meaning });
    }
  });
  return found;
}

function vocabularyUsageExplanation(target, correctText = "") {
  const targetNote = target ? `${termMeaning(target)}.` : "";
  const usageNote = usageExplanationForTarget(target, correctText);
  return `${targetNote}${usageNote ? ` ${usageNote}` : ""}`.trim();
}

function usageExplanationForTarget(target, correctText) {
  const source = String(correctText || "");
  const notes = {
    "かすれる": "Dùng tự nhiên với 「声」 để nói giọng bị khàn/mờ đi.",
    "運用": "Dùng tự nhiên với tiền vốn, quỹ, hệ thống: 「資金を運用する」 = vận dụng/quản lý vốn.",
    "抜き打ち": "Thường dùng trong 「抜き打ちで実施する」 = tiến hành đột xuất, không báo trước.",
    "緻密": "Thường bổ nghĩa cho sự quan sát, kế hoạch, công việc tỉ mỉ: 「緻密な観察」.",
    "迫力": "Dùng khi nói cảm giác mạnh, ấn tượng áp đảo: 「迫力がある」.",
    "目まぐるしい": "Dùng cho sự thay đổi diễn ra nhanh liên tiếp: 「目まぐるしく入れ替わる」.",
  };
  if (notes[target]) return notes[target];
  if (!target || !source) return "";
  return `Cách dùng đúng trong câu là 「${source}」.`;
}

function meaningfulRemoteExplanation(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^「[^」]+」$/.test(text)) return "";
  if (!/[=、。,.]|[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) return "";
  return text;
}

function remoteTargetWord(item) {
  const html = item.textHtml || "";
  const marked = html.match(/\[\[u\]\]([\s\S]*?)\[\[\/u\]\]/);
  if (marked) return marked[1].replace(/\[\[[^\]]+\]\]/g, "").trim();
  const quoted = item.text.match(/「([^」]+)」/);
  if (quoted) return quoted[1];
  if (item.questionNumber >= 20 && item.questionNumber <= 25) return item.text.replace(/[「」]/g, "").trim();
  return "";
}

function n1NotesForQuestion(item, group = null, baseExplanation = "") {
  const textParts = [item.text, item.textHtml, item.passage, group?.passage, ...(item.options || [])];
  const entries = n1EntriesForText(textParts.join(" "), item.questionNumber >= 41 ? 6 : 4)
    .filter((entry) => !baseExplanation.includes(vocabNoteText(entry.word, entry.reading, entry.meaning)));
  if (!entries.length) return "";
  return `\nTừ N1 cần nhớ: ${entries.map((entry) => vocabNoteText(entry.word, entry.reading, entry.meaning)).join("; ")}.`;
}

function n2NotesForQuestion(item, group = null, baseExplanation = "") {
  const textParts = [item.text, item.textHtml, item.passage, group?.passage, ...(item.options || [])];
  const entries = n2EntriesForText(textParts.join(" "), item.questionNumber >= 41 ? 8 : 5)
    .filter((entry) => !baseExplanation.includes(vocabNoteText(entry.word, entry.reading, entry.meaning)));
  if (!entries.length) return "";
  return `\nTừ N2 cần nhớ: ${entries.map((entry) => vocabNoteText(entry.word, entry.reading, entry.meaning)).join("; ")}.`;
}

function n1GrammarNotesForQuestion(item, group = null) {
  const textParts = [item.text, item.textHtml, item.passage, group?.passage, ...(item.options || [])];
  const entries = n1GrammarEntriesForText(textParts.join(" "), item.questionNumber >= 41 ? 6 : 4);
  if (!entries.length) return "";
  return `\nNgữ pháp N1 cần nhớ: ${entries.map((entry) => `「${entry.pattern}」= ${entry.meaning}`).join("; ")}.`;
}

function withStudyNotes(baseExplanation, item, group = null) {
  return `${baseExplanation}${n1GrammarNotesForQuestion(item, group)}${n1NotesForQuestion(item, group, baseExplanation)}${n2NotesForQuestion(item, group, baseExplanation)}`;
}

function compactText(value) {
  return String(value || "").replace(/\[\[[^\]]+\]\]/g, "").replace(/\s+/g, " ").trim();
}

function sharedChars(a, b) {
  const chars = new Set(compactText(a).replace(/[、。，．「」『』（）()・\s]/g, "").split(""));
  if (!chars.size) return 0;
  return compactText(b).replace(/[、。，．「」『』（）()・\s]/g, "").split("").reduce((score, char) => score + (chars.has(char) ? 1 : 0), 0);
}

function evidenceFromPassage(passageText, correctText, questionText) {
  const passageSource = compactText(passageText);
  if (!passageSource) return "";
  const chunks = passageSource
    .split(/(?<=[。！？!?])|\n+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 18 && item.length <= 180);
  if (!chunks.length) return "";
  const best = chunks
    .map((chunk) => ({
      chunk,
      score: sharedChars(correctText, chunk) * 2 + sharedChars(questionText, chunk),
    }))
    .sort((a, b) => b.score - a.score)[0];
  if (!best || best.score < 4) return "";
  return ` Chỗ đối chiếu trong bài: 「${best.chunk}」.`;
}

function wrongOptionHint(item, correctText) {
  return "";
}

function stripGenericReadingExplanation(value) {
  return compactText(value)
    .replace(/Câu này cần đối chiếu trực tiếp câu hỏi với ý chính hoặc chi tiết tương ứng trong đoạn văn。?/g, "")
    .replace(/Câu này hỏi chủ trương\/kết luận chính của tác giả, nên phải ưu tiên câu kết luận và mạch lập luận toàn đoạn。?/g, "")
    .replace(/Câu này hỏi quan điểm hoặc cách giải thích của tác giả, nên chọn ý phản ánh đúng nhận định trong bài, không chọn ý chỉ là ví dụ phụ。?/g, "")
    .replace(/Câu này hỏi quan điểm của tác giả, nên chọn ý phản ánh đúng nhận định của tác giả, không chọn ý chỉ là ví dụ phụ。?/g, "")
    .replace(/Câu này hỏi tác giả mô tả\/đánh giá vấn đề như thế nào, nên cần bám vào câu giải thích trực tiếp trong bài。?/g, "")
    .replace(/Câu này hỏi tác giả mô tả vấn đề như thế nào, nên cần bám vào câu giải thích trực tiếp trong đoạn。?/g, "")
    .replace(/Câu này hỏi lý do, nên đáp án đúng phải nêu đúng nguyên nhân trong bài, không chỉ nêu kết quả。?/g, "")
    .replace(/Câu này hỏi nội dung được chỉ tới, nên cần quay lại câu ngay trước và sau vị trí đó để xác định phạm vi。?/g, "")
    .replace(/Câu này hỏi từ\/cụm được chỉ tới, nên cần quay lại câu ngay trước và sau vị trí đó。?/g, "")
    .replace(/Câu này là dạng so sánh\/tổng hợp A-B, nên đáp án đúng phải khớp với cả hai văn bản。?/g, "")
    .replace(/Câu này là dạng thông tin ứng dụng, nên cần đối chiếu điều kiện, thời hạn, số tiền, người liên quan hoặc giấy tờ trong bảng\/thông báo。?/g, "")
    .replace(/Câu này là dạng thông tin ứng dụng, nên cần đối chiếu điều kiện, thời hạn, số tiền hoặc giấy tờ trong bảng\/thông báo。?/g, "")
    .replace(/Ý đúng nằm ở lựa chọn này vì nó giữ đúng trọng tâm của đoạn và không suy rộng ngoài nội dung bài。?/g, "")
    .replace(/Vì vậy cần chọn đáp án giữ đúng ý này, không suy rộng(?: ra)? ngoài bài。?/g, "")
    .replace(/Các lựa chọn còn lại như .*? thường sai vì thêm ý không có trong bài, đổi chủ thể, đảo quan hệ nguyên nhân-kết quả hoặc chỉ đúng một phần。?/g, "")
    .replace(/Các lựa chọn như .*? dễ sai vì thường thêm ý quá mức, đổi chủ thể, đảo quan hệ nguyên nhân-kết quả hoặc chỉ đúng với một phần nhỏ của đoạn。?/g, "")
    .replace(/(?:\s*\.\s*){2,}/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.。])/g, "$1")
    .trim();
}

function readingExplanationForRemoteQuestion(item, group) {
  const correctText = item.options[Number(item.correctAnswer) - 1];
  if (item.explanation) {
    const explanation = stripGenericReadingExplanation(item.explanation);
    return explanation.startsWith("Đáp án") ? explanation : `Đáp án: ${item.correctAnswer}. ${explanation}`;
  }
  const evidence = evidenceFromPassage(group?.passage || item.passage || "", correctText, item.text);
  return `Đáp án: ${item.correctAnswer}. Ý đúng là 「${correctText}」.${evidence}`;
}

function readingExplanationForLocalQuestion(question) {
  const correctText = question.options[question.answer] || "";
  const evidence = evidenceFromPassage(question.passage || "", correctText, question.prompt);
  const original = stripGenericReadingExplanation(question.explanation || "");
  const originalNote = original && !original.includes("Đáp án") ? ` Ghi chú lời giải: ${original}` : "";
  return `Đáp án: ${question.answer + 1}. Ý đúng là 「${correctText}」.${evidence}${originalNote}`;
}

function explanationForRemoteQuestion(exam, item, group) {
  const questionNumber = Number(item.questionNumber);
  const correctIndex = Number(item.correctAnswer) - 1;
  const correctText = item.options[correctIndex];
  const prompt = item.text.replace(/\[\[blank\]\]/g, "（　）");
  const original = meaningfulRemoteExplanation(item.explanation);
  let base = "";

  if (questionNumber <= 6) {
    const target = kanjiTargets[exam.id]?.[questionNumber - 1] || remoteTargetWord(item);
    const targetExplanation = meaningfulRemoteExplanation(item.explanation) || termMeaning(target);
    const targetNote = target ? ` Từ được hỏi: ${targetExplanation}.` : "";
    base = `Đáp án: ${item.correctAnswer}.${targetNote}`;
    return withStudyNotes(base, item, group);
  }

  if (questionNumber <= 13) {
    base = `Đáp án: ${item.correctAnswer}. ${answerMeaningLine(correctText)}${optionMeanings(item)}`;
    return withStudyNotes(base, item, group);
  }

  if (questionNumber <= 19) {
    base = `Đáp án: ${item.correctAnswer}. ${answerMeaningLine(correctText)}`;
    return withStudyNotes(base, item, group);
  }

  if (questionNumber <= 25) {
    const target = remoteTargetWord(item);
    base = `Đáp án: ${item.correctAnswer}. ${vocabularyUsageExplanation(target, correctText)}`;
    return base;
  }

  if (questionNumber <= 35) {
    if (original) return withStudyNotes(`Đáp án: ${item.correctAnswer}. ${original}`, item, group);
    base = `Đáp án: ${item.correctAnswer}. ${grammarAnswerLine(correctText)}${grammarOptionNotes(item)}`;
    return withStudyNotes(base, item, group);
  }

  if (questionNumber <= 40) {
    const fullOrder = item.starOrder || item.correctOrder || item.fullOrder || item.order || "";
    const orderNote = fullOrder ? ` 正しい順序: ${fullOrder}.` : "";
    if (original) return withStudyNotes(`Đáp án: ${item.correctAnswer}. Mảnh ở vị trí ★ là 「${correctText}」.${orderNote} ${original}`, item, group);
    base = `Đáp án: ${item.correctAnswer}. Mảnh ở vị trí ★ là 「${correctText}」.${orderNote} ${grammarAnswerLine(correctText)}${grammarOptionNotes(item)}`;
    return withStudyNotes(base, item, group);
  }

  if (questionNumber <= 44) {
    if (original) return withStudyNotes(`Đáp án: ${item.correctAnswer}. ${original}`, item, group);
    base = grammarPassageExplanation(item, group);
    return withStudyNotes(base, item, group);
  }

  base = readingExplanationForRemoteQuestion(item, group);
  return withStudyNotes(base, item, group);
}

function grammarPassageExplanation(item, group) {
  const correctText = item.options[Number(item.correctAnswer) - 1] || "";
  const grammarLine = grammarAnswerLine(correctText);
  return `Đáp án: ${item.correctAnswer}.${grammarLine ? ` ${grammarLine}` : ""}`;
}

function grammarPassageContext(passageText, number) {
  const source = String(passageText || "");
  const marker = grammarMarkers(number).find((value) => source.includes(value));
  if (!marker) return "";
  const index = source.indexOf(marker);
  const before = Math.max(source.lastIndexOf("。", index - 1), source.lastIndexOf("\n", index - 1));
  const afterCandidates = [source.indexOf("。", index), source.indexOf("\n", index)].filter((value) => value >= 0);
  const after = afterCandidates.length ? Math.min(...afterCandidates) : source.length;
  return source.slice(before + 1, after + (source[after] === "。" ? 1 : 0)).trim();
}

function fillGrammarMarker(text, number, answer) {
  return grammarMarkers(number).reduce((value, marker) => value.replace(marker, answer), text);
}

function grammarMarkers(number) {
  return [`（${number}）`, `(${number})`, `（${toFullWidthDigits(number)}）`, `【${number}】`, `【${toFullWidthDigits(number)}】`];
}

function sourceMarkupToHtml(value) {
  return escapeHtml(value)
    .replace(/\[\[blank\]\]/g, "（　）")
    .replace(/\[\[br\]\]/g, "<br>")
    .replace(/\[\[u\]\]/g, '<span class="kanji-target">')
    .replace(/\[\[\/u\]\]/g, "</span>")
    .replace(/\[\[\/?b\]\]/g, "")
    .replace(/\[\[\/?center\]\]/g, "")
    .replace(/\[\[\/?h4\]\]/g, "");
}

function sourceMarkupToText(value) {
  return String(value || "")
    .replace(/\[\[blank\]\]/g, "（　）")
    .replace(/\[\[br\]\]/g, "\n")
    .replace(/\[\[[^\]]+\]\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function underlinedSourceText(value) {
  const match = String(value || "").match(/\[\[u\]\]([\s\S]*?)\[\[\/u\]\]/);
  return match ? sourceMarkupToText(match[1]) : "";
}

function convertRemoteExam(exam, data) {
  const converted = [];
  data.sections.forEach((section) => {
    section.groups.forEach((group) => {
      group.questions.forEach((item) => {
        const questionNumber = Number(item.questionNumber);
        const promptText = item.text.replace(/\[\[blank\]\]/g, "（　）");
        const promptMarkup = item.textHtml ? `${questionNumber}. ${sourceMarkupToHtml(item.textHtml)}` : "";
        converted.push(q(
          exam.id,
          labelFor(exam.title, questionNumber),
          `${questionNumber}. ${promptText}`,
          item.options,
          Number(item.correctAnswer) - 1,
          explanationForRemoteQuestion(exam, item, group),
          questionNumber >= 41 ? item.passage || group.passage || "" : "",
          promptMarkup,
          {
            starOrder: item.starOrder || item.correctOrder || item.fullOrder || item.order || "",
            readingTarget: questionNumber >= 45 ? underlinedSourceText(item.textHtml) : "",
          }
        ));
      });
    });
  });
  return converted;
}

function targetFromQuestionText(question) {
  const prompt = question.prompt || "";
  const number = questionNumber(question);
  const quoted = prompt.match(/「([^」]+)」/);
  if (quoted) return quoted[1];

  if (number >= 20 && number <= 25) {
    return prompt.replace(/^\d+\.\s*/, "").replace(/^\d+\s*/, "").trim();
  }

  const meaningPrompt = prompt.match(/^\d+\.\s*(.+?)。意味が近いものは？/);
  if (meaningPrompt) {
    const entries = studyEntriesForText(meaningPrompt[1], 1);
    if (entries.length) return entries[0].word;
  }

  const entries = studyEntriesForText(prompt, 1);
  return entries.length ? entries[0].word : "";
}

function hasHighlightedPrompt(question) {
  return Boolean(question.htmlPrompt && question.htmlPrompt.includes('class="kanji-target"'));
}

function normalizeKanjiQuestionExplanation(question) {
  const number = questionNumber(question);
  if (number < 1 || number > 6 || !question.type?.startsWith("exam-")) return;
  const target = question.targetWord || kanjiTargets[question.type]?.[number - 1] || highlightedTargetFromHtml(question.htmlPrompt) || targetFromQuestionText(question);
  if (!target) return;
  const targetExplanation = termMeaning(target);
  if (targetExplanation.startsWith("「")) return;
  question.explanation = `Đáp án: ${question.answer + 1}. Từ được hỏi: ${targetExplanation}.`;
}

function addN1NotesToExplanation(question) {
  if (!question.explanation || question.explanation.includes("Từ N1 cần nhớ:")) return;
  const entries = n1EntriesForText(`${question.prompt} ${question.passage || ""} ${question.options.join(" ")}`, question.skill === "reading" ? 6 : 4)
    .filter((entry) => !question.explanation.includes(vocabNoteText(entry.word, entry.reading, entry.meaning)));
  if (!entries.length) {
    const fallback = fallbackN1EntryForQuestion(question);
    if (fallback && isUsefulStudyEntry(fallback.word, fallback.reading, fallback.meaning) && !question.explanation.includes(vocabNoteText(fallback.word, fallback.reading, fallback.meaning))) entries.push(fallback);
  }
  if (!entries.length) return;
  question.explanation += `\nTừ N1 cần nhớ: ${entries.map((entry) => vocabNoteText(entry.word, entry.reading, entry.meaning)).join("; ")}.`;
}

function addN2NotesToExplanation(question) {
  if (!question.explanation || question.explanation.includes("Từ N2 cần nhớ:")) return;
  const entries = n2EntriesForText(`${question.prompt} ${question.passage || ""} ${question.options.join(" ")}`, question.skill === "reading" ? 8 : 5);
  if (!entries.length) return;
  question.explanation += `\nTừ N2 cần nhớ: ${entries.map((entry) => vocabNoteText(entry.word, entry.reading, entry.meaning)).join("; ")}.`;
}

function addN1GrammarNotesToExplanation(question) {
  if (!question.explanation || question.explanation.includes("Ngữ pháp N1 cần nhớ:")) return;
  const entries = n1GrammarEntriesForText(`${question.prompt} ${question.passage || ""} ${question.options.join(" ")}`, question.skill === "reading" ? 6 : 4);
  if (!entries.length) return;
  question.explanation += `\nNgữ pháp N1 cần nhớ: ${entries.map((entry) => `「${entry.pattern}」= ${entry.meaning}`).join("; ")}.`;
}

function prependAnswerDetail(question) {
  if (!question.explanation) return;
  const number = questionNumber(question);
  const correctText = question.options?.[question.answer] || "";
  if (!correctText) return;

  if (number >= 7 && number <= 19 && !question.explanation.includes("Đáp án đúng:")) {
    question.explanation = `${answerMeaningLine(correctText)} ${question.explanation}`;
  }

  if (number >= 26 && number <= 44 && !question.explanation.includes("Đáp án ngữ pháp:") && !question.explanation.includes("Đáp án ngữ pháp/cụm đúng:")) {
    const grammarLine = grammarAnswerLine(correctText);
    if (grammarLine) question.explanation = `${grammarLine} ${question.explanation}`;
  }
}

function enhanceQuestion(question) {
  if (question.folder?.startsWith("boki-")) {
    addN1GrammarNotesToExplanation(question);
    addN1NotesToExplanation(question);
    addN2NotesToExplanation(question);
    return question;
  }

  if (!hasHighlightedPrompt(question) && !question.targetWord) {
    const target = targetFromQuestionText(question);
    if (target && question.prompt.includes(target)) {
      question.targetWord = target;
    }
  }
  addUsageTargetHighlight(question);
  normalizeKanjiQuestionExplanation(question);
  if (question.skill === "reading" && (!question.explanation || !question.explanation.includes("Đáp án"))) {
    question.explanation = readingExplanationForLocalQuestion(question);
  }
  prependAnswerDetail(question);
  if (questionNumber(question) >= 20 && questionNumber(question) <= 25) return question;
  addN1GrammarNotesToExplanation(question);
  addN1NotesToExplanation(question);
  addN2NotesToExplanation(question);
  return question;
}

function addUsageTargetHighlight(question) {
  const number = questionNumber(question);
  if (number < 20 || number > 25 || hasHighlightedPrompt(question)) return;
  const target = question.targetWord || targetFromQuestionText(question);
  if (!target) return;
  const prompt = question.prompt || "";
  const prefix = prompt.match(/^(\d+\.\s*)/)?.[1] || "";
  const body = prefix ? prompt.slice(prefix.length) : prompt;
  if (body.trim() !== target) return;
  question.htmlPrompt = `${prefix}<span class="kanji-target">${escapeHtml(target)}</span>`;
}

function optionHtml(question, option) {
  const number = questionNumber(question);
  if (number < 20 || number > 25) return "";
  const target = question.targetWord || targetFromQuestionText(question);
  if (!target) return "";
  return highlightUsageTargetInText(option, target);
}

function highlightUsageTargetInText(text, target) {
  const source = String(text || "");
  const forms = usageTargetForms(target)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const found = forms.find((form) => source.includes(form));
  if (!found) return "";
  const index = source.indexOf(found);
  return `${escapeHtml(source.slice(0, index))}<span class="kanji-target">${escapeHtml(found)}</span>${escapeHtml(source.slice(index + found.length))}`;
}

function usageTargetForms(target) {
  const source = normalizeLookupTerm(target);
  const forms = new Set([source]);
  const stem = source.slice(0, -1);
  const ending = source.at(-1);

  if (ending === "い") {
    forms.add(`${stem}く`);
    forms.add(`${stem}くて`);
    forms.add(`${stem}かった`);
  }

  if (ending === "る") {
    const ichidanStem = source.slice(0, -1);
    forms.add(ichidanStem);
    forms.add(`${ichidanStem}て`);
    forms.add(`${ichidanStem}た`);
    forms.add(`${ichidanStem}ない`);
    forms.add(`${ichidanStem}ず`);
    forms.add(`${ichidanStem}られる`);
  }

  if (ending === "す") {
    forms.add(`${stem}し`);
    forms.add(`${stem}して`);
    forms.add(`${stem}した`);
    forms.add(`${stem}さない`);
    forms.add(`${stem}さず`);
    forms.add(`${stem}される`);
    forms.add(`${stem}されて`);
    forms.add(`${stem}された`);
  } else if (ending === "く") {
    forms.add(`${stem}き`);
    forms.add(`${stem}いて`);
    forms.add(`${stem}いた`);
  } else if (ending === "ぐ") {
    forms.add(`${stem}ぎ`);
    forms.add(`${stem}いで`);
    forms.add(`${stem}いだ`);
  } else if (["む", "ぶ", "ぬ"].includes(ending)) {
    forms.add(`${stem}み`);
    forms.add(`${stem}び`);
    forms.add(`${stem}に`);
    forms.add(`${stem}んで`);
    forms.add(`${stem}んだ`);
    if (ending === "む") {
      forms.add(`${stem}まない`);
      forms.add(`${stem}まず`);
      forms.add(`${stem}まれる`);
      forms.add(`${stem}まれて`);
      forms.add(`${stem}まれた`);
    }
  } else if (ending === "う" || ending === "つ" || ending === "る") {
    forms.add(`${stem}い`);
    forms.add(`${stem}ち`);
    forms.add(`${stem}り`);
    forms.add(`${stem}って`);
    forms.add(`${stem}った`);
    forms.add(`${stem}わない`);
    forms.add(`${stem}わず`);
    forms.add(`${stem}われる`);
    forms.add(`${stem}われて`);
    forms.add(`${stem}われた`);
  }

  if (source.endsWith("する")) {
    const base = source.slice(0, -2);
    forms.add(`${base}し`);
    forms.add(`${base}して`);
    forms.add(`${base}した`);
    forms.add(`${base}しない`);
    forms.add(`${base}せず`);
    forms.add(`${base}される`);
    forms.add(`${base}されて`);
    forms.add(`${base}された`);
  }

  return [...forms];
}

function enhanceQuestions(list) {
  list.forEach(enhanceQuestion);
}

async function loadHanVietMap() {
  try {
    const response = await fetch(hanVietSourceUrl);
    if (!response.ok) throw new Error("Không tải được bảng âm Hán Việt");
    hanVietMap = await response.json();
  } catch (error) {
    console.warn(error);
    hanVietMap = {};
  }
}

async function loadRemoteExams() {
  const remoteLoaded = await Promise.allSettled(remoteExams.map(async (exam) => {
    const response = await fetch(`${exam.path}?v=${examDataVersion}`);
    if (!response.ok) throw new Error(`Không tải được đề ${exam.title}`);
    const data = await response.json();
    return convertRemoteExam(exam, data);
  }));
  remoteLoaded.forEach((item) => {
    if (item.status === "fulfilled") {
      questions.push(...item.value);
    } else {
      console.warn(item.reason);
    }
  });


  applyKanjiTargets(questions);
  enhanceQuestions(questions);
}


function activeQuestions() {
  if (state.filter === "all") return [];
  if (state.filter === "boki-all") return [];
  if (state.filter.startsWith("exam-") || state.filter.startsWith("boki-")) return questions.filter((item) => item.type === state.filter);
  const folderQuestions = questions.filter((item) => item.folder);
  return folderQuestions.filter((item) => item.skill === state.filter);
}

function questionNumber(question) {
  const match = question.prompt.match(/^(\d+)\./);
  return match ? Number(match[1]) : 0;
}

function applyKanjiTargets(list) {
  list.forEach((question) => {
    const number = questionNumber(question);
    const targets = kanjiTargets[question.folder];
    if (number >= 1 && number <= 6 && targets) {
      question.targetWord = targets[number - 1];
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function promptHtml(question) {
  if (question.htmlPrompt) return question.htmlPrompt;
  const prompt = escapeHtml(question.prompt);
  if (!question.targetWord) return prompt;

  const target = escapeHtml(question.targetWord);
  const index = prompt.indexOf(target);
  if (index === -1) return prompt;

  return `${prompt.slice(0, index)}<span class="kanji-target">${target}</span>${prompt.slice(index + target.length)}`;
}

function passageHtml(question) {
  let source = escapeHtml(question.passage || "");
  const number = questionNumber(question);
  const readingTarget = readingPassageTarget(question);
  if (question.skill === "reading" && readingTarget) {
    source = highlightPassageFragment(source, readingTarget);
  }
  const readingMarker = readingPassageMarker(question);
  if (question.skill === "reading" && readingMarker && source.includes(readingMarker)) {
    source = source.replace(readingMarker, `<strong class="passage-blank-focus">${readingMarker}</strong>`);
    return source;
  }
  if (number < 41 || number > 44) return source;
  const variants = grammarMarkers(number);
  const marker = variants.find((value) => source.includes(value));
  if (!marker) return source;
  return source.replace(marker, `<strong class="passage-blank-focus">${marker}</strong>`);
}

function highlightPassageFragment(sourceHtml, fragment) {
  const raw = String(fragment || "").trim();
  const variants = [...new Set([
    raw,
    raw.replace(/[「」『』]/g, ""),
    raw.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, ""),
  ].map((value) => escapeHtml(value.trim())).filter((value) => value.length >= 2))];
  const target = variants.find((value) => sourceHtml.includes(value) && !sourceHtml.includes(`>${value}</strong>`));
  if (!target) return sourceHtml;
  return sourceHtml.replace(target, `<strong class="passage-blank-focus">${target}</strong>`);
}

function readingPassageTarget(question) {
  const explicit = String(question.readingTarget || "").trim();
  if (explicit) return explicit;
  const fromHtml = highlightedTargetFromHtml(question.htmlPrompt);
  if (fromHtml) return fromHtml.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, "").trim();
  return inferredReadingTarget(question.prompt);
}

function inferredReadingTarget(promptValue) {
  let prompt = String(promptValue || "").replace(/^\d+\.\s*/, "").trim();
  const hasLeadingMarker = /^[①②③④⑤⑥⑦⑧⑨⑩]/u.test(prompt) || /^[（(]\s*[1-9]\s*[）)]/u.test(prompt);
  prompt = prompt.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, "").replace(/^[（(]\s*[1-9]\s*[）)]\s*/, "").trim();
  const quoted = prompt.match(/[「『]([^」』]{2,80})[」』]/);
  if (quoted) return quoted[1].trim();
  const boundaryTokens = hasLeadingMarker ? ["とある", "とは", "と述べ", "と言って", "と言う", "と考えて"] : ["とある", "と述べ", "と言って", "と言う", "と考えて"];
  const boundary = boundaryTokens.map((token) => prompt.indexOf(token)).filter((index) => index > 0).sort((a, b) => a - b)[0];
  if (!boundary) return "";
  const target = prompt.slice(0, boundary).replace(/^(筆者が|筆者は|ここでの|ここで|この|その|①|②|③|④)\s*/, "").trim();
  return target.length >= 2 && target.length <= 80 ? target : "";
}

function readingPassageMarker(question) {
  const prompt = String(question.prompt || "").replace(/^\d+\.\s*/, "").trim();
  const circled = prompt.match(/[①②③④⑤⑥⑦⑧⑨⑩]/u)?.[0];
  if (circled) return circled;
  const bracketed = prompt.match(/^[（(]\s*([1-9])\s*[）)]/) || prompt.match(/[「『]?[（(]\s*([1-9])\s*[）)][」』]?/);
  if (!bracketed) return "";
  const digit = bracketed[1];
  return question.passage?.includes(`(${digit})`) ? `(${digit})` : `（${digit}）`;
}

function toFullWidthDigits(value) {
  return String(value).replace(/\d/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 0xfee0));
}

function hasTextSelection() {
  return window.getSelection?.().toString().trim().length > 0;
}

function createCopyableAnswer(option, onChoose, html = "") {
  const answer = document.createElement("div");
  answer.className = "answer";
  answer.setAttribute("role", "button");
  answer.tabIndex = 0;
  if (html) {
    answer.innerHTML = html;
  } else {
    answer.textContent = option;
  }
  answer.addEventListener("click", () => {
    if (answer.getAttribute("aria-disabled") === "true" || hasTextSelection()) return;
    onChoose();
  });
  answer.addEventListener("keydown", (event) => {
    if (answer.getAttribute("aria-disabled") === "true") return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChoose();
    }
  });
  return answer;
}

function saveProgress() {
  localStorage.setItem("n1Answered", String(state.answered));
  localStorage.setItem("n1Correct", String(state.correct));
  localStorage.setItem("n1Streak", String(state.streak));
  localStorage.setItem("n1Selections", JSON.stringify(state.selectedByPrompt));
}

function updateMetrics() {
  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  const accuracyMetric = document.querySelector("#accuracyMetric");
  const answeredMetric = document.querySelector("#answeredMetric");
  const streakMetric = document.querySelector("#streakMetric");
  if (accuracyMetric) accuracyMetric.textContent = `${accuracy}%`;
  if (answeredMetric) answeredMetric.textContent = state.answered;
  if (streakMetric) streakMetric.textContent = state.streak;
}

function scrollQuestionIntoView() {
  if (!quizShell) return;
  requestAnimationFrame(() => {
    quizShell.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderQuestion() {
  if (state.filter?.startsWith("boki-")) {
    renderFolderDirectory();
    return;
  }

  if (state.filter === "all") {
    renderFolderDirectory();
    return;
  }

  if (folderBackFilter) folderBackFilter.hidden = false;
  prevButton.hidden = false;
  nextButton.hidden = false;
  backToFoldersButton.hidden = false;
  prevButton.style.display = "";
  nextButton.style.display = "";
  backToFoldersButton.style.display = "";
  const list = activeQuestions();
  if (!list.length) {
    questionType.textContent = state.loading ? "Đang tải" : "Chưa có câu hỏi";
    questionText.textContent = state.loading ? "Đang tải dữ liệu đề..." : "Chưa có câu hỏi trong mục này.";
    questionCount.textContent = "0/0";
    passage.hidden = true;
    answers.innerHTML = "";
    questionJump.hidden = true;
    questionJump.innerHTML = "";
    feedback.hidden = true;
    return;
  }

  const current = list[state.index];
  questionType.textContent = current.label;
  questionText.innerHTML = promptHtml(current);
  questionCount.textContent = `${state.index + 1}/${list.length}`;

  if (current.passage) {
    passage.hidden = false;
    passage.innerHTML = passageHtml(current);
  } else {
    passage.hidden = true;
    passage.innerHTML = "";
  }

  answers.innerHTML = "";
  feedback.hidden = true;
  feedback.textContent = "";

  current.options.forEach((option, optionIndex) => {
    answers.appendChild(createCopyableAnswer(option, () => chooseAnswer(current, optionIndex), optionHtml(current, option)));
  });

  const selected = state.selectedByPrompt[current.prompt];
  if (selected !== undefined) revealAnswer(current, selected);
  renderQuestionJump(list);
}

function renderFolderDirectory() {
  if (folderBackFilter) folderBackFilter.hidden = true;
  prevButton.hidden = true;
  nextButton.hidden = true;
  backToFoldersButton.hidden = true;
  prevButton.style.display = "none";
  nextButton.style.display = "none";
  backToFoldersButton.style.display = "none";
  questionType.textContent = "Thư mục đề";
  questionText.textContent = state.loading ? "Đang tải thêm thư mục đề..." : "Chọn thư mục để luyện đề";
  questionCount.textContent = `${examFolders.length} thư mục`;
  passage.hidden = true;
  passage.textContent = "";
  questionJump.hidden = true;
  questionJump.innerHTML = "";
  feedback.hidden = false;
  feedback.textContent = "Các tab Từ vựng và Ngữ pháp sẽ tự gom câu từ tất cả thư mục đề. Đọc hiểu vẫn nằm trong từng thư mục đề.";
  answers.innerHTML = "";

  examFolders.forEach((folder) => {
    const button = document.createElement("button");
    button.className = "answer folder-card";
    button.type = "button";
    button.innerHTML = `<strong>${folder.title}</strong><span>${folder.subtitle}</span>`;
    button.addEventListener("click", () => setFilter(folder.id));
    answers.appendChild(button);
  });
}

function renderBokiFolderDirectory() {
  bokiPrevButton.hidden = true;
  bokiNextButton.hidden = true;
  bokiBackToFoldersButton.hidden = true;
  bokiPrevButton.style.display = "none";
  bokiNextButton.style.display = "none";
  bokiBackToFoldersButton.style.display = "none";
  bokiQuestionType.textContent = "Boki 3級";
  bokiQuestionText.textContent = "Chọn thư mục luyện đề Boki";
  bokiQuestionCount.textContent = `${bokiFolders.length} thư mục`;
  bokiPassage.hidden = true;
  bokiPassage.textContent = "";
  bokiQuestionJump.hidden = true;
  bokiQuestionJump.innerHTML = "";
  bokiFeedback.hidden = false;
  bokiFeedback.textContent = "Chọn một thư mục Boki để luyện theo form 3 mondai.";
  bokiAnswers.innerHTML = "";

  bokiFolders.forEach((folder) => {
    const button = document.createElement("button");
    button.className = "answer folder-card";
    button.type = "button";
    button.innerHTML = `<strong>${folder.title}</strong><span>${folder.subtitle}</span>`;
    button.addEventListener("click", () => setBokiFilter(folder.id));
    bokiAnswers.appendChild(button);
  });
}

function renderBokiFolders() {
  renderBokiQuestion();
}

function activeBokiQuestions() {
  if (!state.filter?.startsWith("boki-") || state.filter === "boki-all") return [];
  return questions.filter((item) => item.type === state.filter);
}

function renderBokiQuestion() {
  if (!state.filter?.startsWith("boki-") || state.filter === "boki-all") {
    renderBokiFolderDirectory();
    return;
  }

  bokiPrevButton.hidden = false;
  bokiNextButton.hidden = false;
  bokiBackToFoldersButton.hidden = false;
  bokiPrevButton.style.display = "";
  bokiNextButton.style.display = "";
  bokiBackToFoldersButton.style.display = "";

  const list = activeBokiQuestions();
  if (!list.length) {
    bokiQuestionType.textContent = "Boki 3級";
    bokiQuestionText.textContent = "Chưa có câu hỏi trong thư mục này.";
    bokiQuestionCount.textContent = "0/0";
    bokiPassage.hidden = true;
    bokiAnswers.innerHTML = "";
    bokiQuestionJump.hidden = true;
    bokiQuestionJump.innerHTML = "";
    bokiFeedback.hidden = true;
    return;
  }

  const current = list[state.index];
  const imagePrompt = current.htmlPrompt?.includes("<img");
  bokiQuestionType.textContent = current.label;
  if (imagePrompt) {
    const images = current.htmlPrompt.match(/<img[^>]+>/g) || [];
    bokiQuestionText.textContent = current.prompt;
    bokiPassage.hidden = false;
    bokiPassage.innerHTML = images.join("");
  } else {
    bokiQuestionText.innerHTML = promptHtml(current);
    if (current.passage) {
      bokiPassage.hidden = false;
      bokiPassage.textContent = current.passage;
    } else {
      bokiPassage.hidden = true;
      bokiPassage.textContent = "";
    }
  }
  bokiQuestionCount.textContent = `${state.index + 1}/${list.length}`;
  bokiAnswers.innerHTML = "";
  bokiFeedback.hidden = true;
  bokiFeedback.textContent = "";

  current.options.forEach((option, optionIndex) => {
    bokiAnswers.appendChild(createCopyableAnswer(option, () => chooseBokiAnswer(current, optionIndex)));
  });

  const selected = state.selectedByPrompt[current.prompt];
  if (selected !== undefined) revealBokiAnswer(current, selected);
  renderBokiQuestionJump(list);
}

function renderBokiQuestionJump(list) {
  bokiQuestionJump.hidden = false;
  bokiQuestionJump.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "question-jump-heading";
  heading.innerHTML = `<strong>Chọn câu</strong><span>${folderTitle(state.filter)} · ${list.length} câu</span>`;
  bokiQuestionJump.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "question-jump-grid";
  list.forEach((question, questionIndex) => {
    const selected = state.selectedByPrompt[question.prompt];
    const button = document.createElement("button");
    button.className = "jump-button";
    button.type = "button";
    button.textContent = questionIndex + 1;
    button.classList.toggle("active", questionIndex === state.index);
    if (selected !== undefined) {
      button.classList.add(selected === question.answer ? "done-correct" : "done-wrong");
    }
    button.addEventListener("click", () => {
      state.index = questionIndex;
      renderBokiQuestion();
      document.querySelector("#boki .quiz-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    grid.appendChild(button);
  });
  bokiQuestionJump.appendChild(grid);
}

function chooseBokiAnswer(question, optionIndex) {
  if (state.selectedByPrompt[question.prompt] !== undefined) {
    revealBokiAnswer(question, optionIndex);
    return;
  }

  state.selectedByPrompt[question.prompt] = optionIndex;
  state.answered += 1;
  if (optionIndex === question.answer) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  saveProgress();
  updateMetrics();
  revealBokiAnswer(question, optionIndex);
}

function revealBokiAnswer(question, selectedIndex) {
  [...bokiAnswers.children].forEach((answer, optionIndex) => {
    answer.setAttribute("aria-disabled", "true");
    answer.tabIndex = -1;
    if (optionIndex === question.answer) answer.classList.add("correct");
    if (optionIndex === selectedIndex && optionIndex !== question.answer) answer.classList.add("wrong");
  });
  bokiFeedback.hidden = false;
  bokiFeedback.textContent = question.explanation;
  renderBokiQuestionJump(activeBokiQuestions());
}

function moveBokiQuestion(direction) {
  const list = activeBokiQuestions();
  if (!list.length) return;
  state.index = (state.index + direction + list.length) % list.length;
  renderBokiQuestion();
  document.querySelector("#boki .quiz-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setBokiFilter(filter) {
  state.filter = filter;
  state.index = 0;
  renderBokiQuestion();
}

function renderQuestionJump(list) {
  if (!state.filter.startsWith("exam-") && !state.filter.startsWith("boki-")) {
    questionJump.hidden = true;
    questionJump.innerHTML = "";
    return;
  }

  questionJump.hidden = false;
  questionJump.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "question-jump-heading";
  heading.innerHTML = `<strong>Chọn câu</strong><span>${folderTitle(state.filter)} · ${list.length} câu</span>`;
  questionJump.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "question-jump-grid";

  list.forEach((question, questionIndex) => {
    const selected = state.selectedByPrompt[question.prompt];
    const button = document.createElement("button");
    button.className = "jump-button";
    button.type = "button";
    button.textContent = questionIndex + 1;
    button.setAttribute("aria-label", `Chuyển tới câu ${questionIndex + 1}`);
    button.classList.toggle("active", questionIndex === state.index);

    if (selected !== undefined) {
      button.classList.add(selected === question.answer ? "done-correct" : "done-wrong");
    }

    button.addEventListener("click", () => {
      state.index = questionIndex;
      renderQuestion();
      scrollQuestionIntoView();
    });

    grid.appendChild(button);
  });

  questionJump.appendChild(grid);
}

function chooseAnswer(question, optionIndex) {
  if (state.selectedByPrompt[question.prompt] !== undefined) {
    revealAnswer(question, optionIndex);
    return;
  }

  state.selectedByPrompt[question.prompt] = optionIndex;
  state.answered += 1;
  if (optionIndex === question.answer) {
    state.correct += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  saveProgress();
  updateMetrics();
  revealAnswer(question, optionIndex);
}

function revealAnswer(question, selectedIndex) {
  [...answers.children].forEach((answer, optionIndex) => {
    answer.setAttribute("aria-disabled", "true");
    answer.tabIndex = -1;
    if (optionIndex === question.answer) answer.classList.add("correct");
    if (optionIndex === selectedIndex && optionIndex !== question.answer) answer.classList.add("wrong");
  });
  feedback.hidden = false;
  feedback.textContent = question.explanation;
  renderQuestionJump(activeQuestions());
}

function moveQuestion(direction) {
  const list = activeQuestions();
  if (!list.length) return;
  state.index = (state.index + direction + list.length) % list.length;
  renderQuestion();
  scrollQuestionIntoView();
}

function folderTitle(folderId) {
  const folder = [...examFolders, ...bokiFolders].find((item) => item.id === folderId);
  return folder ? folder.title : "Đề JLPT";
}

function flashcardsFromFolders(skill = state.deckType) {
  return questions
    .filter((question) => question.folder && question.skill === skill)
    .map((question) => {
      const answer = question.options[question.answer];
      const vocabEntry = skill === "vocab" ? lookupVocabAnswer(answer) : null;
      const baseWord = vocabEntry?.base || answer;
      return {
        tag: folderTitle(question.folder),
        jp: skill === "vocab" ? answer : question.prompt.replace(/^\d+\.\s*/, ""),
        reading: vocabEntry?.reading || "",
        hanViet: skill === "vocab" ? hanVietForText(baseWord) : "",
        vn: question.prompt.replace(/^\d+\.\s*/, ""),
        example: question.explanation,
      };
    });
}

function renderDeck() {
  deckGrid.innerHTML = "";
  const cards = flashcardsFromFolders();
  if (state.deckIndex >= cards.length) state.deckIndex = 0;

  const shell = document.createElement("div");
  shell.className = "flashcard-shell";

  const tabs = document.createElement("div");
  tabs.className = "deck-tabs";
  [
    { type: "vocab", label: "Từ vựng" },
    { type: "grammar", label: "Ngữ pháp" },
  ].forEach((item) => {
    const button = document.createElement("button");
    button.className = "deck-tab";
    button.type = "button";
    button.textContent = item.label;
    button.classList.toggle("active", state.deckType === item.type);
    button.addEventListener("click", () => {
      state.deckType = item.type;
      state.deckIndex = 0;
      state.deckOpen = false;
      renderDeck();
    });
    tabs.appendChild(button);
  });
  shell.appendChild(tabs);

  if (!cards.length) {
    const empty = document.createElement("div");
    empty.className = "flashcard-empty";
    empty.textContent = state.loading ? "Đang tải flashcards..." : "Chưa có flashcard trong mục này.";
    shell.appendChild(empty);
    deckGrid.appendChild(shell);
    return;
  }

  const card = cards[state.deckIndex];
  const item = document.createElement("button");
  item.className = "flashcard single";
  item.type = "button";
  item.classList.toggle("is-open", state.deckOpen);
  item.innerHTML = `
    <span class="tag">${card.tag}</span>
    <div class="jp">${card.jp}</div>
    ${card.reading || card.hanViet ? `<div class="flashcard-reading">${[card.reading, card.hanViet].filter(Boolean).join(" · ")}</div>` : ""}
    <div class="meaning">${card.vn}<br><strong>${card.example}</strong></div>
  `;
  item.addEventListener("click", () => {
    state.deckOpen = !state.deckOpen;
    item.classList.toggle("is-open", state.deckOpen);
  });
  shell.appendChild(item);

  const actions = document.createElement("div");
  actions.className = "deck-actions";
  actions.innerHTML = `<span class="pill">${state.deckIndex + 1}/${cards.length}</span>`;

  const prev = document.createElement("button");
  prev.className = "secondary-button";
  prev.type = "button";
  prev.textContent = "Thẻ trước";
  prev.addEventListener("click", () => moveDeck(-1));

  const next = document.createElement("button");
  next.className = "primary-button";
  next.type = "button";
  next.textContent = "Thẻ tiếp";
  next.addEventListener("click", () => moveDeck(1));

  actions.prepend(prev);
  actions.appendChild(next);
  shell.appendChild(actions);
  deckGrid.appendChild(shell);
}

function moveDeck(direction) {
  const cards = flashcardsFromFolders();
  if (!cards.length) return;
  state.deckIndex = (state.deckIndex + direction + cards.length) % cards.length;
  state.deckOpen = false;
  renderDeck();
}

filters.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

folderBackFilter?.addEventListener("click", () => setFilter("all"));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const view = link.getAttribute("href").replace("#", "");
    window.setTimeout(() => showAppView(view), 0);
  });
});

window.addEventListener("hashchange", () => showAppView());

function setFilter(filter) {
  filters.forEach((item) => item.classList.toggle("active", item.dataset.filter === filter));
  state.filter = filter;
  state.index = 0;
  renderQuestion();
  scrollQuestionIntoView();
}

nextButton.addEventListener("click", () => moveQuestion(1));
prevButton.addEventListener("click", () => moveQuestion(-1));
backToFoldersButton.addEventListener("click", () => {
  setFilter(state.filter.startsWith("boki-") ? "boki-all" : "all");
});
bokiNextButton.addEventListener("click", () => moveBokiQuestion(1));
bokiPrevButton.addEventListener("click", () => moveBokiQuestion(-1));
bokiBackToFoldersButton.addEventListener("click", () => {
  state.filter = "boki-all";
  state.index = 0;
  renderBokiQuestion();
});

document.querySelector("#resetProgress").addEventListener("click", () => {
  state.answered = 0;
  state.correct = 0;
  state.streak = 0;
  state.selectedByPrompt = {};
  saveProgress();
  updateMetrics();
  renderQuestion();
});

renderQuestion();
renderDeck();
renderBokiFolders();
showAppView();
updateMetrics();

loadHanVietMap()
  .then(() => loadRemoteExams())
  .then(() => {
    state.loading = false;
    renderQuestion();
    renderDeck();
    renderBokiFolders();
  })
  .catch((error) => {
    state.loading = false;
    feedback.hidden = false;
    feedback.textContent = error.message;
    renderQuestion();
    renderDeck();
    renderBokiFolders();
  });
