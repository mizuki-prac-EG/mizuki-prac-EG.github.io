```javascript
/* ========================================
   共通：スクロール表示アニメーション
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const onceTargets = document.querySelectorAll(
    ".hero, .section, footer"
  );

  const repeatTargets = document.querySelectorAll(".card");

  // 見出し・セクション：初回だけ表示
  onceTargets.forEach((target) => {
    target.classList.add("reveal");
  });

  // カード：画面に入るたびに表示
  repeatTargets.forEach((target) => {
    target.classList.add("reveal");
  });

  // アニメーションに対応していない環境では表示を維持
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.querySelectorAll(".reveal").forEach((target) => {
      target.classList.add("is-visible");
    });

    initializeAwsLearningPage();
    return;
  }

  // セクション：一度表示したら監視を終了
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

  // カード：画面に入るたびに表示
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

  initializeAwsLearningPage();
});


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

  // AWS学習ノート以外のページでは何もしない
  if (
    !searchInput ||
    !categoryFilter ||
    !resetButton ||
    !resultCount ||
    !noResults ||
    cards.length === 0
  ) {
    return;
  }

  // 検索文字列を整える
  function normalizeText(text) {
    return text
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
      const category = card.dataset.category;

      const searchableText = normalizeText(
        card.innerText + " " + (card.dataset.search || "")
      );

      const matchesKeyword =
        keyword === "" || searchableText.includes(keyword);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const isVisible = matchesKeyword && matchesCategory;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    // 件数表示
    resultCount.textContent =
      `${visibleCount} / ${cards.length}分野を表示中`;

    // 検索結果が0件の場合の案内
    noResults.hidden = visibleCount !== 0;
  }

  // キーワード入力時
  searchInput.addEventListener("input", filterCategories);

  // 分野選択時
  categoryFilter.addEventListener("change", filterCategories);

  // 条件をリセット
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";

    filterCategories();

    searchInput.focus();
  });

  // 初期表示
  filterCategories();
}
```
