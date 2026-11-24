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