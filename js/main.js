
const targets = document.querySelectorAll(
  ".hero, .section, footer, .card"
);

targets.forEach((target) => {
  target.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

targets.forEach((target) => {
  observer.observe(target);
});
