/* =====================================================
   script.js  -  BSEd Department website
   -----------------------------------------------------
   HOW TO EDIT:
   1. Change text, contact details and images in SITE_CONFIG below.
   2. To replace an image, either overwrite the file in the /images
      folder (same file name) or change its path here.
   3. Everything below SITE_CONFIG is the website's functions.
   ===================================================== */

const SITE_CONFIG = {
  // Text that appears in several places (matches data-config="..." in index.html)
  schoolName: "Your School Name",
  deptName: "Department of Teacher Education",
  tagline: "Shaping competent, compassionate and globally competitive secondary school teachers.",
  address: "Teacher Education Office, Room 204, Main Building",
  email: "bsed@yourschool.edu.ph",
  phone: "(02) 8123-4567",
  hours: "Monday to Friday, 8:00 AM to 5:00 PM",

  // Cover slideshow images (add or remove items freely)
  slideInterval: 5000, // milliseconds
  slides: [
    { src: "images/slide1.svg", alt: "Teacher in a classroom",        caption: "Inspiring classrooms" },
    { src: "images/slide2.svg", alt: "Graduation cap and diploma",    caption: "Future licensed teachers" },
    { src: "images/slide3.svg", alt: "Books and a glowing light bulb", caption: "Learning that sparks ideas" }
  ],

  // Majors shown in the tabs (Section 2) and in the inquiry form.
  // The image changes whenever a different tab is selected.
  majors: [
    { id: "english", name: "English", image: "images/major-english.svg",
      summary: "Develop strong communication, literature and language teaching skills for junior and senior high school.",
      subjects: ["Structure of English", "Children and Adolescent Literature", "Language Assessment", "Campus Journalism"] },
    { id: "math", name: "Mathematics", image: "images/major-math.svg",
      summary: "Master algebra, geometry and statistics while learning how to make math meaningful for every learner.",
      subjects: ["Calculus and Analytic Geometry", "Modern Geometry", "Probability and Statistics", "Problem Solving"] },
    { id: "science", name: "Science", image: "images/major-science.svg",
      summary: "Teach biology, chemistry, physics and earth science through inquiry-based laboratory experiences.",
      subjects: ["General Biology", "General Chemistry", "Physics for Teachers", "Earth and Space Science"] },
    { id: "filipino", name: "Filipino", image: "images/major-filipino.svg",
      summary: "Strengthen the national language through panitikan, komunikasyon at pananaliksik.",
      subjects: ["Panitikan ng Pilipinas", "Retorika", "Sining ng Pagsasalin", "Pagtuturo ng Filipino"] },
    { id: "socialstudies", name: "Social Studies", image: "images/major-socialstudies.svg",
      summary: "Prepare to teach history, geography, economics and civics with a global and local perspective.",
      subjects: ["Philippine History", "World Geography", "Economics", "Politics and Governance"] },
    { id: "values", name: "Values Education", image: "images/major-values.svg",
      summary: "Guide learners in ethics, character formation and responsible citizenship.",
      subjects: ["Ethics", "Moral Development", "Peace Education", "Character Formation"] }
  ],

  fallbackImage: "images/placeholder.svg" // shown if an image path is wrong
};

/* ---------- Small helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function safeStorage(action, key, value) {           // localStorage can be blocked, so wrap it
  try { return action === "get" ? localStorage.getItem(key) : localStorage.setItem(key, value); }
  catch (e) { return null; }
}
function withFallback(img) {                          // swap broken images for a placeholder
  img.addEventListener("error", () => {
    if (!img.src.endsWith(SITE_CONFIG.fallbackImage)) img.src = SITE_CONFIG.fallbackImage;
  });
}

/* ---------- 1. Fill config text into the page ---------- */
function applyConfig() {
  $$("[data-config]").forEach(el => {
    const value = SITE_CONFIG[el.dataset.config];
    if (value) el.textContent = value;
  });
  document.title = `${SITE_CONFIG.deptName} | ${SITE_CONFIG.schoolName}`;
  $$("img").forEach(withFallback);
}

/* ---------- 2. Dark / light theme ---------- */
function initTheme() {
  const btn = $("#theme-toggle");
  const root = document.documentElement;
  const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = () => root.dataset.theme || (prefersDark() ? "dark" : "light");
  const paint = () => { btn.textContent = current() === "dark" ? "☀" : "☾"; };

  const saved = safeStorage("get", "theme");
  if (saved) root.dataset.theme = saved;
  paint();

  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    safeStorage("set", "theme", next);
    paint();
  });
}

/* ---------- 3. Mobile menu ---------- */
function initMobileMenu() {
  const burger = $("#burger");
  const links = $("#nav-links");
  const setOpen = open => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  $$("a", links).forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
}

/* ---------- 4. Header shadow + back-to-top ---------- */
function initScrollEffects() {
  const header = $("#site-header");
  const toTop = $("#to-top");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
}

/* ---------- 5. Highlight the menu link of the visible section ---------- */
function initScrollSpy() {
  const map = {};
  $$("[data-spy]").forEach(a => { map[a.dataset.spy] = a; });
  const targets = [["top", $(".cover")], ["about", $("#about")], ["programs", $("#programs")], ["contact", $("#contact")]];
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      Object.values(map).forEach(a => a.classList.remove("active"));
      const key = targets.find(t => t[1] === entry.target)[0];
      map[key].classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  targets.forEach(t => t[1] && io.observe(t[1]));
}

/* ---------- 6. Scroll reveal ---------- */
function initReveal() {
  const items = $$("[data-reveal]");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in-view")); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
}

/* ---------- 7. Animated counters ---------- */
function initCounters() {
  const counters = $$("[data-count]");
  const run = el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(c => io.observe(c));
}

/* ---------- 8. Cover slideshow ---------- */
function initSlider() {
  const root = $("#slider");
  const track = $(".slides", root);
  const dotsBox = $(".dots", root);
  const caption = $(".slide-caption", root);
  const slides = SITE_CONFIG.slides;
  let index = 0, timer = null;

  const slideEls = slides.map((s, i) => {
    const fig = document.createElement("figure");
    fig.className = "slide";
    const img = new Image();
    img.src = s.src; img.alt = s.alt; withFallback(img);
    fig.appendChild(img);
    track.appendChild(fig);

    const dot = document.createElement("button");
    dot.type = "button"; dot.className = "dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => { go(i); restart(); });
    dotsBox.appendChild(dot);
    return fig;
  });
  const dotEls = $$(".dot", dotsBox);

  function go(i) {
    index = (i + slides.length) % slides.length;
    slideEls.forEach((el, n) => el.classList.toggle("is-active", n === index));
    dotEls.forEach((el, n) => el.classList.toggle("is-active", n === index));
    caption.textContent = slides[index].caption || "";
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion && slides.length > 1) timer = setInterval(() => go(index + 1), SITE_CONFIG.slideInterval);
  }

  $(".prev", root).addEventListener("click", () => { go(index - 1); restart(); });
  $(".next", root).addEventListener("click", () => { go(index + 1); restart(); });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  root.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { go(index - 1); restart(); }
    if (e.key === "ArrowRight") { go(index + 1); restart(); }
  });
  document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : restart());

  go(0);
  restart();
}

/* ---------- 9. Accordion (Mission / Vision / Values) ---------- */
function initAccordion() {
  const heads = $$(".acc-head");
  heads.forEach(head => {
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      heads.forEach(h => h.setAttribute("aria-expanded", "false"));   // only one open at a time
      head.setAttribute("aria-expanded", String(!open));
    });
  });
}

/* ---------- 10. Major tabs (text + image change together) ---------- */
function initTabs() {
  const tabsBox = $("#tabs");
  const panel = $("#tab-panel");
  const image = $("#major-image");
  const nameEl = $("#major-name");
  const summaryEl = $("#major-summary");
  const listEl = $("#major-subjects");
  const cta = $("#major-cta");
  const select = $("#f-major");
  let currentId = null;

  // Build tab buttons + the form's <select> options from the same data
  select.innerHTML = '<option value="">Select a major...</option>';
  SITE_CONFIG.majors.forEach(m => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "tab"; btn.textContent = m.name;
    btn.setAttribute("role", "tab"); btn.dataset.id = m.id;
    btn.addEventListener("click", () => show(m.id));
    tabsBox.appendChild(btn);

    const opt = document.createElement("option");
    opt.value = m.id; opt.textContent = m.name;
    select.appendChild(opt);
  });

  function fill(m) {
    nameEl.textContent = `Major in ${m.name}`;
    summaryEl.textContent = m.summary;
    listEl.innerHTML = "";
    m.subjects.forEach(s => { const li = document.createElement("li"); li.textContent = s; listEl.appendChild(li); });
    image.src = m.image;
    image.alt = `${m.name} major illustration`;
    $$(".tab", tabsBox).forEach(t => t.setAttribute("aria-selected", String(t.dataset.id === m.id)));
  }

  function show(id) {
    if (id === currentId) return;
    const major = SITE_CONFIG.majors.find(m => m.id === id);
    if (!major) return;
    const first = currentId === null;
    currentId = id;
    if (first || reduceMotion) { fill(major); return; }
    panel.classList.add("is-swapping");
    image.classList.add("is-swapping");
    setTimeout(() => {
      fill(major);
      panel.classList.remove("is-swapping");
      image.classList.remove("is-swapping");
    }, 250);
  }

  // "Learn more" jumps to the form with this major pre-selected
  cta.addEventListener("click", () => { if (currentId) select.value = currentId; });

  // Arrow-key navigation between tabs
  tabsBox.addEventListener("keydown", e => {
    const tabs = $$(".tab", tabsBox);
    const i = tabs.findIndex(t => t.dataset.id === currentId);
    if (e.key === "ArrowRight") { tabs[(i + 1) % tabs.length].focus(); show(tabs[(i + 1) % tabs.length].dataset.id); }
    if (e.key === "ArrowLeft")  { tabs[(i - 1 + tabs.length) % tabs.length].focus(); show(tabs[(i - 1 + tabs.length) % tabs.length].dataset.id); }
  });

  show(SITE_CONFIG.majors[0].id);
}

/* ---------- 11. Inquiry form validation ---------- */
function initForm() {
  const form = $("#inquiry-form");
  const success = $("#form-success");
  const msg = $("#f-message");
  const counter = $("#msg-count");

  const rules = {
    "f-name":    v => v.trim().length >= 2 ? "" : "Please enter your full name.",
    "f-email":   v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address.",
    "f-major":   v => v ? "" : "Please choose a major.",
    "f-message": v => v.trim().length >= 10 ? "" : "Message must be at least 10 characters."
  };

  function check(id) {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const error = rules[id](input.value);
    $(`[data-error-for="${id}"]`).textContent = error;
    field.classList.remove("invalid");
    if (error) { void field.offsetWidth; field.classList.add("invalid"); }   // restart shake animation
    input.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => check(id));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) check(id);
    });
  });

  msg.addEventListener("input", () => { counter.textContent = `${msg.value.length} / ${msg.maxLength}`; });

  form.addEventListener("submit", e => {
    e.preventDefault();
    success.hidden = true;
    const results = Object.keys(rules).map(check);
    if (results.includes(false)) {
      const firstBad = Object.keys(rules).find(id => !rules[id](document.getElementById(id).value) === false);
      if (firstBad) document.getElementById(firstBad).focus();
      return;
    }
    // No server here, so we just confirm. Connect this to your backend or form service later.
    const name = $("#f-name").value.trim().split(" ")[0];
    success.textContent = `Thank you, ${name}! Your inquiry has been received. We will reply by email soon.`;
    success.hidden = false;
    form.reset();
    counter.textContent = `0 / ${msg.maxLength}`;
    $$(".field", form).forEach(f => f.classList.remove("invalid"));
  });
}

/* ---------- 12. Footer year ---------- */
function setYear() { $("#year").textContent = new Date().getFullYear(); }

/* ---------- Start everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initScrollSpy();
  initReveal();
  initCounters();
  initSlider();
  initAccordion();
  initTabs();
  initForm();
  setYear();
});
