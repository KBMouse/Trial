// 增强 MkDocs Material 搜索：多关键词全命中优先，同时保留联想匹配
(function () {
  'use strict';

  // 等待 Material 搜索初始化完成
  function waitForSearch() {
    if (typeof app === 'undefined' || !app || !app.search) {
      setTimeout(waitForSearch, 100);
      return;
    }
    enhanceSearch();
  }

  // 解析查询为关键词数组（保留中文单字、英文、数字等级别）
  function parseTerms(query) {
    return query
      .toLowerCase()
      .split(/[\s\u3000]+/) // 空格与中文全角空格
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }

  // 判断文档是否包含所有关键词
  function countMatchedTerms(doc, terms) {
    const haystack = ((doc.title || '') + ' ' + (doc.text || '')).toLowerCase();
    let count = 0;
    for (const term of terms) {
      if (haystack.indexOf(term) !== -1) {
        count++;
      }
    }
    return count;
  }

  // 重新排序搜索结果：全命中 > 多命中 > 少命中，同命中数内保留原分数
  function rerank(results, terms) {
    if (!results || results.length === 0 || terms.length <= 1) {
      return results;
    }

    // 复制一份，避免影响原数组
    const scored = results.map((r, idx) => {
      const doc = (r.document || {});
      const matched = countMatchedTerms(doc, terms);
      return { result: r, matched, originalIndex: idx };
    });

    scored.sort((a, b) => {
      // 1. 命中关键词数量多的排前面
      if (b.matched !== a.matched) {
        return b.matched - a.matched;
      }
      // 2. 同命中数量时，原 score 高的排前面（保留联想排序）
      const scoreA = a.result.score || 0;
      const scoreB = b.result.score || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      // 3. 稳定排序
      return a.originalIndex - b.originalIndex;
    });

    return scored.map(s => s.result);
  }

  // 包装 app.search 的查询方法，对结果重新排序
  function enhanceSearch() {
    const original = app.search;
    let queryFn = original.query || original.search;

    if (!queryFn) {
      console.warn('[search-enhance] 找不到 app.search.query 方法');
      return;
    }

    // 有些版本使用 app.search(query) 直接返回结果
    original.query = original.search = function (query) {
      const rawResults = queryFn.call(original, query);
      if (!rawResults) return rawResults;

      // 兼容 Promise 与同步数组
      if (typeof rawResults.then === 'function') {
        return rawResults.then(results => {
          const terms = parseTerms(query || '');
          return rerank(results, terms);
        });
      }

      const terms = parseTerms(query || '');
      return rerank(rawResults, terms);
    };

    console.log('[search-enhance] 搜索增强已启用');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSearch);
  } else {
    waitForSearch();
  }
})();
