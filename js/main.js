
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
