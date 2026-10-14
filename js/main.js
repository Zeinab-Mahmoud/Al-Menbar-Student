// ===== المنبر - واجهة الطالب | الصفحة الرئيسية =====

// ----- بيانات المقررات (placeholder content per Figma) -----
const COURSES = [
  {
    id: 1,
    bigWord: "التفسير",
    title: "التعريف بعلم التفسير",
    bookLine: "الكتاب: الفقه الميسر في ضوء الكتاب والسنة",
    description:
      "الْفَهْمُ للشيء والعلم به، وفهم الأحكام الدقيقة والمسائل الغامضة، وهو في الأصل مطلق الفهم، وغلب استعماله في العرف مخصوصا بعلم الشريعة؛ لشرفها على سائر العلوم.",
    href: "#course-tafsir",
  },
  {
    id: 2,
    bigWord: "الفقــــــــه",
    title: "الفقه الميسر",
    bookLine: "الكتاب: الفقه الميسر في ضوء الكتاب والسنة",
    description:
      "الْفَهْمُ للشيء والعلم به، وفهم الأحكام الدقيقة والمسائل الغامضة، وهو في الأصل مطلق الفهم، وغلب استعماله في العرف مخصوصا بعلم الشريعة؛ لشرفها على سائر العلوم.",
    href: "#course-fiqh",
  },
  {
    id: 3,
    bigWord: "العقيـدة",
    title: "الفقه الميسر",
    bookLine: "الكتاب: الفقه الميسر في ضوء الكتاب والسنة",
    description:
      "الْفَهْمُ للشيء والعلم به، وفهم الأحكام الدقيقة والمسائل الغامضة، وهو في الأصل مطلق الفهم، وغلب استعماله في العرف مخصوصا بعلم الشريعة؛ لشرفها على سائر العلوم.",
    href: "#course-aqeedah",
  },
  {
    id: 4,
    bigWord: "الحديث",
    title: "الفقه الميسر",
    bookLine: "الكتاب: الفقه الميسر في ضوء الكتاب والسنة",
    description:
      "الْفَهْمُ للشيء والعلم به، وفهم الأحكام الدقيقة والمسائل الغامضة، وهو في الأصل مطلق الفهم، وغلب استعماله في العرف مخصوصا بعلم الشريعة؛ لشرفها على سائر العلوم.",
    href: "#course-hadith",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  renderCourses();
  initProfileMenu();
  initStars();
  initRatingForm();
});

// ----- عرض المقررات -----
function renderCourses() {
  const container = document.getElementById("courses");
  if (!container) return;

  container.innerHTML = COURSES.map(
    (c) => `
    <article class="course-card">
      <span class="course-card__word" aria-hidden="true">${c.bigWord}</span>
      <div class="course-card__divider" aria-hidden="true"></div>
      <h3 class="course-card__title">${c.title}</h3>
      <p class="course-card__book">${c.bookLine}</p>
      <p class="course-card__desc">${c.description}</p>
      <a class="course-card__btn" href="${c.href}">ادرس الان</a>
    </article>`
  ).join("");
}

// ----- قائمة الحساب (profile menu) -----
function initProfileMenu() {
  const toggle = document.getElementById("profile-toggle");
  const menu = document.getElementById("profile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.hasAttribute("hidden");
    if (open) {
      menu.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    } else {
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (e) => {
    if (!menu.hasAttribute("hidden") && !menu.contains(e.target)) {
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hasAttribute("hidden")) {
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

// ----- النجوم (RTL: 1 = rightmost = غير راض … 5 = leftmost = راض جداً) -----
function initStars() {
  const group = document.querySelector(".stars");
  const input = document.getElementById("rating-value");
  if (!group || !input) return;

  const buttons = [...group.querySelectorAll(".stars__btn")];

  group.addEventListener("click", (e) => {
    const btn = e.target.closest(".stars__btn");
    if (!btn) return;
    const value = Number(btn.dataset.value);
    setRating(value, buttons, input);
  });

  group.addEventListener("keydown", (e) => {
    const current = Number(input.value);
    // RTL: ArrowRight → lower value (toward right), ArrowLeft → higher value
    if (e.key === "ArrowRight" && current > 1) {
      e.preventDefault();
      setRating(current - 1, buttons, input);
      buttons.find((b) => Number(b.dataset.value) === current - 1)?.focus();
    } else if (e.key === "ArrowLeft" && current < 5) {
      e.preventDefault();
      setRating(current + 1, buttons, input);
      buttons.find((b) => Number(b.dataset.value) === current + 1)?.focus();
    }
  });
}

function setRating(value, buttons, input) {
  input.value = String(value);
  buttons.forEach((btn) => {
    const v = Number(btn.dataset.value);
    const active = v <= value;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", String(v === value));
  });
  hideError("rating");
}

// ----- نموذج التقييم -----
function initRatingForm() {
  const form = document.getElementById("rating-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    const rating = form.querySelector("#rating-value");
    const success = document.getElementById("form-success");

    let valid = true;

    // Name required
    if (!name.value.trim()) {
      showError("name");
      valid = false;
    } else {
      hideError("name");
    }

    // Email required + basic format
    const emailVal = email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailOk) {
      showError("email");
      valid = false;
    } else {
      hideError("email");
    }

    // Rating required
    if (!rating.value) {
      showError("rating");
      valid = false;
    } else {
      hideError("rating");
    }

    if (!valid) {
      success.setAttribute("hidden", "");
      return;
    }

    // No backend defined in the design — show success state
    const data = {
      name: name.value.trim(),
      email: emailVal,
      rating: Number(rating.value),
      message: message.value.trim(),
    };
    console.log("Rating submitted:", data);

    success.removeAttribute("hidden");
    form.reset();
    setRating(3, [...form.querySelectorAll(".stars__btn")], rating);
  });
}

function showError(field) {
  const error = document.querySelector(`[data-error-for="${field}"]`);
  if (!error) return;
  error.removeAttribute("hidden");
  const wrap = error.closest(".field");
  if (wrap) wrap.classList.add("has-error");
}

function hideError(field) {
  const error = document.querySelector(`[data-error-for="${field}"]`);
  if (!error) return;
  error.setAttribute("hidden", "");
  const wrap = error.closest(".field");
  if (wrap) wrap.classList.remove("has-error");
}
