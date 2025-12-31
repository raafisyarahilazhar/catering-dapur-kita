const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// === GANTI NOMOR WA DI SINI (format internasional tanpa +) ===
const WA_NUMBER = "62655202319";

$("#yearNow").textContent = new Date().getFullYear();

// Smooth scroll + close navbar mobile
$$('a.nav-link[href^="#"], a.btn[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navHeight = $("#topNav").offsetHeight;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 8;
    window.scrollTo({ top, behavior: "smooth" });

    const navCollapse = $("#navLinks");
    if (navCollapse && navCollapse.classList.contains("show")) {
      new bootstrap.Collapse(navCollapse).toggle();
    }
  });
});

// Back to top
const backToTop = $("#backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 700 ? "inline-flex" : "none";
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Menu filter
const filterButtons = $$(".filter-btn");
const items = $$(".menu-item");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    items.forEach((it) => {
      const cat = it.dataset.category;
      it.style.display = (filter === "all" || filter === cat) ? "" : "none";
    });
  });
});

// Modal detail menu
const menuModal = $("#menuModal");
if (menuModal) {
  menuModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const title = button?.getAttribute("data-title") || "Detail Menu";
    const desc = button?.getAttribute("data-desc") || "";
    $("#menuModalTitle").textContent = title;
    $("#menuModalDesc").textContent = desc;
  });
}

// Theme toggle (persist)
const themeToggle = $("#themeToggle");
const saved = localStorage.getItem("theme");
if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.innerHTML = isDark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
}
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");
  updateThemeIcon();
});

// Build WhatsApp URL
function waUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Top WhatsApp buttons
const waMessageQuick = "Halo, saya mau tanya catering (menu & paket).";
$("#waTop")?.setAttribute("href", waUrl(waMessageQuick));
$("#waFloat")?.setAttribute("href", waUrl(waMessageQuick));

// Order form -> open WhatsApp
const form = $("#orderForm");
const statusEl = $("#formStatus");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    statusEl.textContent = "Mohon lengkapi data yang wajib.";
    statusEl.classList.remove("text-success");
    statusEl.classList.add("text-danger");
    return;
  }

  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const date = data.get("date");
  const pack = data.get("package");
  const qty = data.get("qty");
  const time = data.get("time");
  const address = data.get("address");
  const notes = data.get("notes") || "-";

  const msg =
`Halo DapurRapi, saya mau pesan catering.

Nama: ${name}
WA: ${phone}
Paket: ${pack}
Tanggal: ${date}
Jam kirim: ${time}
Jumlah: ${qty}
Alamat: ${address}
Catatan: ${notes}

Mohon konfirmasi harga & ketersediaan. Terima kasih.`;

  statusEl.classList.remove("text-danger");
  statusEl.classList.add("text-success");
  statusEl.textContent = "Membuka WhatsApp…";

  window.open(waUrl(msg), "_blank");
});
