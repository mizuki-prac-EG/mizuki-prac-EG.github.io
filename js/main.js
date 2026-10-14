```javascript
/* ========================================
   共通：スクロール表示アニメーション
======================================== */

function initializeScrollAnimations() {
  const onceTargets = document.querySelectorAll(
    ".hero, .section, footer"
  );

  const repeatTargets = document.querySelectorAll(".card");

  onceTargets.forEach((target) => {
    target.classList.add("reveal");
  });

  repeatTargets.forEach((target) => {
    target.classList.add("reveal");
  });

  // IntersectionObserverが使えない場合は
  // アニメーションを無効化して内容を表示する
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.querySelectorAll(".reveal").forEach((target) => {
      target.classList.add("is-visible");
    });

    return;
  }

  // セクションは一度表示したら監視終了
  const onceObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  onceTargets.forEach((target) => {
    onceObserver.observe(target);
  });

  // カードは画面に入るたびに表示
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  repeatTargets.forEach((target) => {
    cardObserver.observe(target);
  });
}


/* ========================================
   AWS学習ノート：検索・絞り込み
======================================== */

function initializeAwsLearningPage() {
  const searchInput = document.getElementById("aws-search");
  const categoryFilter = document.getElementById("aws-category-filter");
  const resetButton = document.getElementById("aws-reset");
  const resultCount = document.getElementById("aws-results-count");
  const noResults = document.getElementById("aws-no-results");

  const cards = Array.from(
    document.querySelectorAll(".aws-category-card")
  );

  // AWS学習ノート以外のページでは終了
  if (
    !searchInput ||
    !categoryFilter ||
    !resetButton ||
    !resultCount ||
    !noResults ||
    cards.length === 0
  ) {
    console.log(
      "[AWS検索] 初期化対象なし。AWS学習ノート以外のページです。"
    );
    return;
  }

  console.log(`[AWS検索] 初期化成功：${cards.length}分野`);

  // 全角・半角や英字の大文字・小文字を整える
  function normalizeText(text) {
    return String(text)
      .normalize("NFKC")
      .toLocaleLowerCase("ja")
      .trim();
  }

  // 検索・絞り込み
  function filterCategories() {
    const keyword = normalizeText(searchInput.value);
    const selectedCategory = categoryFilter.value;

    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";

      const searchableText = normalizeText(
        `${card.textContent} ${card.dataset.search || ""}`
      );

      const matchesKeyword =
        keyword === "" || searchableText.includes(keyword);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const isVisible = matchesKeyword && matchesCategory;

      // 表示・非表示を切り替える
      card.hidden = !isVisible;
      card.style.display = isVisible ? "" : "none";

      if (isVisible) {
        visibleCount++;
      }
    });

    // 件数を更新
    resultCount.textContent =
      `${visibleCount} / ${cards.length}分野を表示中`;

    // 0件の場合の案内を切り替える
    noResults.hidden = visibleCount !== 0;

    console.log(
      `[AWS検索] キーワード="${keyword}", ` +
      `分野="${selectedCategory}", ` +
      `表示件数=${visibleCount}`
    );
  }

  // 入力した時点で検索
  searchInput.addEventListener("input", filterCategories);

  // 分野を選択した時点で検索
  categoryFilter.addEventListener("change", filterCategories);

  // リセットボタン
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";

    filterCategories();

    searchInput.focus();
  });

  // 最初の表示
  filterCategories();
}


/* ========================================
   初期化
======================================== */

function initializePage() {
  initializeScrollAnimations();
  initializeAwsLearningPage();
}

// HTMLの読み込み状態に応じて初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
```
