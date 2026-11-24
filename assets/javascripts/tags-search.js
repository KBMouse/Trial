document.addEventListener("DOMContentLoaded", function () {
  const presetTags = [
    "听力",
    "阅读",
    "口语",
    "写作",
    "词汇",
    "考试",
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    "时事",
    "文化",
    "教育",
    "生活",
    "科技",
    "社会",
    "新闻时事",
    "访谈纪录",
    "教学节目",
    "日常vlog",
    "校园/留学",
    "德国文化"
  ];

  const searchForm = document.querySelector(".md-search__form");
  const searchInput = document.querySelector(".md-search__input");

  if (!searchForm || !searchInput) return;

  let selectedTags = [];

  const suggestionPanel = document.createElement("div");
  suggestionPanel.className = "md-search-tag-suggestions";
  suggestionPanel.style.cssText = `
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 0.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 0.6rem;
    z-index: 1000;
    max-height: 320px;
    overflow-y: auto;
  `;

  const title = document.createElement("div");
  title.textContent = "点击选择标签（可多选）：";
  title.style.cssText = `
    font-size: 0.75rem;
    color: var(--md-default-fg-color--light);
    margin-bottom: 0.4rem;
  `;

  const tagContainer = document.createElement("div");
  tagContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
  `;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
  `;

  const searchButton = document.createElement("button");
  searchButton.type = "button";
  searchButton.textContent = "搜索";
  searchButton.style.cssText = `
    background: var(--md-accent-fg-color);
    color: var(--md-accent-bg-color);
    border: none;
    border-radius: 0.2rem;
    padding: 0.3rem 0.8rem;
    font-size: 0.75rem;
    cursor: pointer;
  `;

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.textContent = "清空";
  clearButton.style.cssText = `
    background: transparent;
    color: var(--md-default-fg-color--light);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 0.2rem;
    padding: 0.3rem 0.8rem;
    font-size: 0.75rem;
    cursor: pointer;
  `;

  buttonContainer.appendChild(clearButton);
  buttonContainer.appendChild(searchButton);

  function renderTags() {
    tagContainer.innerHTML = "";
    presetTags.forEach((tag) => {
      const isSelected = selectedTags.includes(tag);
      const tagEl = document.createElement("button");
      tagEl.type = "button";
      tagEl.textContent = tag;
      tagEl.style.cssText = isSelected
        ? `
        background: var(--md-accent-fg-color);
        border: 1px solid var(--md-accent-fg-color);
        border-radius: 1rem;
        padding: 0.2rem 0.6rem;
        font-size: 0.7rem;
        cursor: pointer;
        color: var(--md-accent-bg-color);
      `
        : `
        background: var(--md-accent-fg-color--transparent, rgba(0,0,0,0.05));
        border: 1px solid var(--md-default-fg-color--lightest);
        border-radius: 1rem;
        padding: 0.2rem 0.6rem;
        font-size: 0.7rem;
        cursor: pointer;
        color: var(--md-default-fg-color);
      `;

      tagEl.addEventListener("click", function () {
        if (selectedTags.includes(tag)) {
          selectedTags = selectedTags.filter((t) => t !== tag);
        } else {
          selectedTags.push(tag);
        }
        updateSearchInput();
        renderTags();
      });

      tagContainer.appendChild(tagEl);
    });
  }

  function updateSearchInput() {
    searchInput.value = selectedTags.join(" ");
  }

  function triggerSearch() {
    updateSearchInput();
    searchInput.focus();
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    suggestionPanel.style.display = "none";
  }

  clearButton.addEventListener("click", function () {
    selectedTags = [];
    updateSearchInput();
    renderTags();
  });

  searchButton.addEventListener("click", function () {
    triggerSearch();
  });

  suggestionPanel.appendChild(title);
  suggestionPanel.appendChild(tagContainer);
  suggestionPanel.appendChild(buttonContainer);

  searchForm.style.position = "relative";
  searchForm.appendChild(suggestionPanel);

  searchInput.addEventListener("focus", function () {
    suggestionPanel.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    if (!searchForm.contains(event.target)) {
      suggestionPanel.style.display = "none";
    }
  });

  searchForm.addEventListener("click", function (event) {
    if (event.target === searchInput || event.target.closest(".md-search-tag-suggestions")) return;
    suggestionPanel.style.display = "block";
  });

  searchInput.addEventListener("input", function () {
    if (this.value.trim().length > 0) {
      suggestionPanel.style.display = "none";
    } else {
      suggestionPanel.style.display = "block";
    }
  });

  renderTags();
});