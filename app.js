const state = {
  mode: "returning",
  activeDirection: null,
  savedSearches: [
    { title: "Купить квартиру", subtitle: "Савёловская · до 20 млн ₽", icon: "⌂" },
    { title: "Новостройки", subtitle: "Москва · 1-комн.", icon: "▦" },
  ],
};

const directions = [
  { id: "buy", label: "Купить", icon: "home", description: "Квартиры на вторичном рынке и в новостройках. Настроим фильтры и покажем подходящие варианты." },
  { id: "rent", label: "Снять", icon: "key", description: "Долгосрочная аренда квартир и комнат. Сохраняйте понравившиеся варианты в избранное." },
  { id: "newbuild", label: "Новостройки", icon: "buildings", description: "Квартиры от застройщиков с актуальными ценами, акциями и условиями покупки." },
  { id: "daily", label: "Посуточно", icon: "sun", description: "Жильё на короткий срок для путешествий, командировок и отдыха." },
  { id: "business", label: "Коммерческая", icon: "briefcase", description: "Офисы, склады, торговые помещения и готовый бизнес." },
];

const historyList = document.querySelector("#history-list");
const directionGrid = document.querySelector("#direction-grid");
const searchSheet = document.querySelector("#search-sheet");
const directionSheet = document.querySelector("#direction-sheet");
const toast = document.querySelector("#toast");

function icon(name) {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/>',
    key: '<circle cx="8" cy="15" r="3"/><path d="m10.5 12.5 8-8M16 6l2 2M14 8l2 2"/>',
    buildings: '<path d="M4 21V5a1 1 0 0 1 1-1h7v17M12 9h7a1 1 0 0 1 1 1v11M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(notify.timeout);
  notify.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!state.savedSearches.length) {
    historyList.innerHTML = '<div class="empty-history">Сохранённые поиски появятся здесь.</div>';
    return;
  }

  state.savedSearches.forEach((search) => {
    const card = document.createElement("button");
    card.className = "history-card";
    card.type = "button";
    card.innerHTML = `<span class="history-icon">${icon(search.icon === "⌂" ? "home" : "buildings")}</span><span><strong>${search.title}</strong><small>${search.subtitle}</small></span>`;
    card.addEventListener("click", () => notify(`Открываем поиск: ${search.title}`));
    historyList.append(card);
  });
}

function renderDirections() {
  directions.forEach((direction) => {
    const button = document.createElement("button");
    button.className = `direction ${direction.id}`;
    button.type = "button";
    button.innerHTML = `<span>${direction.label}</span><span class="direction-icon">${icon(direction.icon)}</span>`;
    button.addEventListener("click", () => openDirection(direction));
    directionGrid.append(button);
  });
}

function renderPropertyRow() {
  document.querySelector("#property-row").innerHTML = [
    ["14,2 млн ₽", "1-комн. · 42 м²"],
    ["22 млн ₽", "3-комн. · 76 м²"],
  ].map(([price, title]) => `<button class="mini-property" type="button"><span class="mini-image"></span><b>${price}</b><small>${title}</small></button>`).join("");
  document.querySelectorAll(".mini-property").forEach((card) => card.addEventListener("click", () => notify("Открыта карточка объявления")));
}

function setMode(mode) {
  const returning = mode === "returning";
  state.mode = mode;
  document.querySelectorAll(".mode-button").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === mode));
  document.querySelector("#greeting").textContent = returning ? "Добрый день, Евгения" : "Найдём жильё для вас";
  document.querySelector("#hero-title").textContent = returning ? "Продолжим искать квартиру?" : "С чего начнём поиск?";
  document.querySelector("#history-title").textContent = returning ? "Ваши поиски" : "Начните с поиска";
  document.querySelector("#recommendations-subtitle").textContent = returning ? "Подобрали рядом с вашими поисками" : "Популярные варианты в Москве";
  document.querySelector("#edit-searches").hidden = !returning;
  state.savedSearches = returning
    ? [{ title: "Купить квартиру", subtitle: "Савёловская · до 20 млн ₽", icon: "⌂" }, { title: "Новостройки", subtitle: "Москва · 1-комн.", icon: "▦" }]
    : [];
  renderHistory();
}

function openDirection(direction) {
  state.activeDirection = direction;
  document.querySelector("#direction-title").textContent = direction.label;
  document.querySelector("#direction-description").textContent = direction.description;
  document.querySelector("#direction-action").textContent = `Найти: ${direction.label.toLowerCase()}`;
  directionSheet.showModal();
}

document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
document.querySelector(".search-trigger").addEventListener("click", () => searchSheet.showModal());
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => { document.querySelector("#query-input").value = button.dataset.query; }));
document.querySelector("#find-button").addEventListener("click", () => {
  const query = document.querySelector("#query-input").value.trim() || "Москва";
  document.querySelector("#search-label").textContent = query;
  searchSheet.close();
  notify(`Показываем объявления: ${query}`);
});
document.querySelector("#direction-action").addEventListener("click", () => {
  document.querySelector("#search-label").textContent = state.activeDirection.label;
  directionSheet.close();
  notify(`Открыт поиск: ${state.activeDirection.label}`);
});
document.querySelector("#edit-searches").addEventListener("click", () => notify("В демо-версии список поисков доступен для редактирования"));
document.querySelectorAll("[data-notice]").forEach((button) => button.addEventListener("click", () => notify(button.dataset.notice)));
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  notify(button.dataset.nav === "Главная" ? "Вы на главной" : `${button.dataset.nav}: демо-экран`);
}));

renderHistory();
renderDirections();
renderPropertyRow();
