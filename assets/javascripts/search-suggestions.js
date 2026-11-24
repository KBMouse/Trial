// 搜索建议增强：优先提示包含全部关键词的补全
(function () {
  'use strict';

  let searchInput = null;

  function init() {
    searchInput = document.querySelector('input.md-search__input');
    if (!searchInput) {
      setTimeout(init, 200);
      return;
    }

    // 监听输入，在建议列表生成后重新排序
    searchInput.addEventListener('input', () => {
      setTimeout(reorderSuggestions, 0);
    });
  }

  function parseTerms(query) {
    return query.toLowerCase().split(/[\s\u3000]+/).filter(t => t.length > 0);
  }

  function reorderSuggestions() {
    const list = document.querySelector('.md-search__output .md-search__list');
    if (!list) return;

    const query = (searchInput.value || '').trim();
    if (!query) return;

    const terms = parseTerms(query);
    if (terms.length <= 1) return;

    const items = Array.from(list.querySelectorAll('li, a, .md-search-result__item'));
    if (!items.length) return;

    // 提取每一项的文本并计算命中关键词数
    const scored = items.map((item, idx) => {
      const text = (item.textContent || '').toLowerCase();
      let matched = 0;
      for (const term of terms) {
        if (text.indexOf(term) !== -1) matched++;
      }
      return { item, matched, originalIndex: idx };
    });

    scored.sort((a, b) => {
      if (b.matched !== a.matched) return b.matched - a.matched;
      return a.originalIndex - b.originalIndex;
    });

    // 按新顺序重新 append 到 DOM
    scored.forEach(s => list.appendChild(s.item));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
