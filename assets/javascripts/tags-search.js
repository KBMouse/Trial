document.addEventListener("DOMContentLoaded", function () {
  // 在这里自定义你的标签列表
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

  // 创建标签建议面板
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
    max-height: 300px;
    overflow-y: auto;
  `;

  const tagContainer = document.createElement("div");
  tagContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  `;

  presetTags.forEach((tag) => {
    const tagEl = document.createElement("button");
    tagEl.type = "button";
    tagEl.textContent = tag;
    tagEl.style.cssText = `
      background: var(--md-accent-fg-color--transparent, rgba(0,0,0,0.05));
      border: 1px solid var(--md-default-fg-color--lightest);
      border-radius: 1rem;
      padding: 0.2rem 0.6rem;
      font-size: 0.7rem;
      cursor: pointer;
      color: var(--md-default-fg-color);
    `;

    tagEl.addEventListener("mouseenter", function () {
      this.style.background = "var(--md-accent-fg-color)";
      this.style.color = "var(--md-accent-bg-color)";
    });

    tagEl.addEventListener("mouseleave", function () {
      this.style.background = "var(--md-accent-fg-color--transparent, rgba(0,0,0,0.05))";
      this.style.color = "var(--md-default-fg-color)";
    });

    tagEl.addEventListener("click", function () {
      searchInput.value = tag;
      searchInput.focus();
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      suggestionPanel.style.display = "none";
    });

    tagContainer.appendChild(tagEl);
  });

  const title = document.createElement("div");
  title.textContent = "热门标签：";
  title.style.cssText = `
    font-size: 0.75rem;
    color: var(--md-default-fg-color--light);
    margin-bottom: 0.4rem;
  `;

  suggestionPanel.appendChild(title);
  suggestionPanel.appendChild(tagContainer);

  // 把建议面板插到搜索表单内
  searchForm.style.position = "relative";
  searchForm.appendChild(suggestionPanel);

  // 搜索输入框获得焦点或点击时显示标签
  searchInput.addEventListener("focus", function () {
    suggestionPanel.style.display = "block";
  });

  // 点击搜索框外部时隐藏
  document.addEventListener("click", function (event) {
    if (!searchForm.contains(event.target)) {
      suggestionPanel.style.display = "none";
    }
  });

  // 点击搜索表单内部（除输入框外）时显示标签
  searchForm.addEventListener("click", function (event) {
    if (event.target !== searchInput) return;
    suggestionPanel.style.display = "block";
  });

  // 输入文字时隐藏标签
  searchInput.addEventListener("input", function () {
    if (this.value.trim().length > 0) {
      suggestionPanel.style.display = "none";
    } else {
      suggestionPanel.style.display = "block";
    }
  });
});