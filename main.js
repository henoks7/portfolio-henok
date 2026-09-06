/* Henok.Codes — main.js (compact version) */

document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  setupMobileMenu();
  setupActiveNavLink();
  setupTypingEffect();
  setupScrollReveal();
  setupBackToTop();
  setupContactForm();
  setupSkillBars();
});

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .reveal-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
    .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
    #scroll-progress { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg,#6c63ff,#00c9a7); z-index: 9999; }
    #back-to-top { position: fixed; bottom: 24px; right: 24px; width: 46px; height: 46px; border-radius: 50%; border: none;
      background: #6c63ff; color: #fff; font-size: 20px; cursor: pointer; opacity: 0; visibility: hidden;
      transform: translateY(12px); transition: opacity .3s, transform .3s, visibility .3s; z-index: 9998; }
    #back-to-top.show { opacity: 1; visibility: visible; transform: translateY(0); }
    .links a.active-link { font-weight: 700; text-decoration: underline; text-underline-offset: 6px; }
    .project-boxes { transition: transform .25s ease, box-shadow .25s ease; }
    .project-boxes:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 10px 24px rgba(0,0,0,.25); }
    .skill-bar-track { background: rgba(120,120,120,.25); border-radius: 6px; height: 10px; margin-top: 4px; overflow: hidden; }
    .skill-bar-fill { height: 100%; width: 0%; border-radius: 6px; background: linear-gradient(90deg,#6c63ff,#00c9a7); transition: width 1.1s ease; }
    .field-error { color: #ff5c5c; font-size: .8rem; margin: 2px 0 8px; display: none; }
    .field-error.show { display: block; }
    input.invalid, select.invalid, textarea.invalid { outline: 2px solid #ff5c5c; }
    #msg-counter { font-size: .75rem; opacity: .7; text-align: right; display: block; }
  `;
  document.head.appendChild(style);
}

function setupMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const links = document.querySelector(".links");
  if (!menuIcon || !links) return;
  menuIcon.addEventListener("click", () => {
    links.classList.toggle("open");
    menuIcon.classList.toggle("bx-x");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      menuIcon.classList.remove("bx-x");
    })
  );
}

function setupActiveNavLink() {
  const links = document.querySelectorAll(".links a");
  const current = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    if (a.getAttribute("href").replace("./", "") === current) a.classList.add("active-link");
  });
}

function setupTypingEffect() {
  const el = document.getElementById("animation");
  if (!el) return;
  const phrases = ["Tech Student & Aspiring Developer", "Full-Stack Developer in Training", "Open Source Contributor"];
  let p = 0, c = 0, deleting = false;
  el.textContent = "";
  (function tick() {
    const word = phrases[p];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1400); }
    if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; }
    setTimeout(tick, deleting ? 40 : 80);
  })();
}

function setupScrollReveal() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  document.body.appendChild(bar);
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  });

  const targets = document.querySelectorAll(".content, .left-part, .right-part, .project-boxes, table");
  targets.forEach((t) => t.classList.add("reveal-on-scroll"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => observer.observe(t));
}

function setupBackToTop() {
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.innerHTML = "&uarr;";
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 300));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setupContactForm() {
  const form = document.querySelector("form");
  if (!form) return;
  const fields = form.querySelectorAll("input[required], select[required], textarea[required]");

  fields.forEach((field) => {
    const err = document.createElement("small");
    err.className = "field-error";
    err.textContent = field.type === "email" ? "Enter a valid email."
      : field.type === "tel" ? "Enter a 10-digit phone number."
      : "This field is required.";
    field.insertAdjacentElement("afterend", err);
    field.addEventListener("blur", () => validate(field, err));
    field.addEventListener("input", () => field.classList.contains("invalid") && validate(field, err));
  });

  form.addEventListener("submit", (e) => {
    let bad = false;
    fields.forEach((f) => { if (!validate(f, f.nextElementSibling)) bad = true; });
    if (bad) { e.preventDefault(); form.querySelector(".invalid")?.focus(); }
  });

  function validate(field, err) {
    const ok = field.checkValidity();
    field.classList.toggle("invalid", !ok);
    err?.classList.toggle("show", !ok);
    return ok;
  }

  const textarea = form.querySelector("textarea");
  if (textarea) {
    const counter = document.createElement("small");
    counter.id = "msg-counter";
    textarea.insertAdjacentElement("afterend", counter);
    const update = () => (counter.textContent = `${textarea.value.length} characters`);
    textarea.addEventListener("input", update);
    update();
  }
}

function setupSkillBars() {
  document.querySelectorAll("table tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 2) return;
    const match = cells[1].textContent.match(/(\d+)\s*star/i);
    if (!match) return;
    const pct = Math.min(100, (parseInt(match[1], 10) / 5) * 100);
    const track = document.createElement("div");
    track.className = "skill-bar-track";
    const fill = document.createElement("div");
    fill.className = "skill-bar-fill";
    track.appendChild(fill);
    cells[1].appendChild(track);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { fill.style.width = pct + "%"; observer.unobserve(e.target); } });
    }, { threshold: 0.3 });
    observer.observe(row);
  });
}
