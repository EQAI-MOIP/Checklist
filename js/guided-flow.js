/* QURI Checklist — pure guided navigation, shared by the offline UI and tests.
 * Completion requirements come exclusively from QuriCore.progress().
 */
(function (root, factory) {
  'use strict';
  var core = typeof module === 'object' && module.exports ? require('./core.js') : root.QuriCore;
  var api = factory(core);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.QuriFlow = api;
})(typeof window !== 'undefined' ? window : globalThis, function (Core) {
  'use strict';

  function sequence(c, rules) {
    var applicable = Core.applicableItems(c, rules);
    var originals = new Map();
    rules.categories.forEach(function (category) {
      category.items.forEach(function (item) { originals.set(item.id, item); });
    });
    var steps = applicable.map(function (item) {
      return {
        id: item.id, categoryId: item.categoryId, categoryTitle: item.categoryTitle,
        title: item.title, question: item.question, claim: false, item: originals.get(item.id)
      };
    });
    for (var n = 1; n <= (c.claimCount || 0); n++) {
      steps.push({
        id: 'claim:' + n, categoryId: 'claims', categoryTitle: '청구항별 점검',
        title: '청구항 ' + n, claim: true, number: n
      });
    }
    return steps;
  }

  function blockers(p) { return p && Array.isArray(p.blockers) ? p.blockers : []; }

  function resolve(c, rules, savedId, p) {
    var steps = sequence(c, rules);
    var ids = new Set(steps.map(function (step) { return step.id; }));
    if (ids.has(savedId)) return savedId;
    var remaining = blockers(p);
    for (var i = 0; i < remaining.length; i++) {
      if (ids.has(remaining[i].itemId)) return remaining[i].itemId;
    }
    return steps.length ? steps[0].id : null;
  }

  function nextIncomplete(c, rules, currentId, p) {
    var steps = sequence(c, rules);
    var blockedIds = new Set(blockers(p).map(function (entry) { return entry.itemId; }));
    var index = steps.findIndex(function (step) { return step.id === currentId; });
    // Unknown/stale positions start at the beginning. A valid position wraps only
    // after checking every later item, and includes itself last if still unfinished.
    for (var offset = 1; offset <= steps.length; offset++) {
      var candidate = steps[(index + offset) % steps.length];
      if (blockedIds.has(candidate.id)) return candidate.id;
    }
    return null;
  }

  function next(c, rules, id, direction) {
    if (direction === undefined) direction = 1;
    if (direction !== 1 && direction !== -1) return null;
    var steps = sequence(c, rules);
    var index = steps.findIndex(function (step) { return step.id === id; });
    if (index === -1) return null;
    var adjacent = steps[index + direction];
    return adjacent ? adjacent.id : null;
  }

  return Object.freeze({ sequence: sequence, resolve: resolve, nextIncomplete: nextIncomplete, next: next });
});
