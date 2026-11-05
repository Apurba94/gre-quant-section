/* Quant Section Simulator: timed Quant sections in the current GRE format, with an adaptive second section. */
(function () {
  'use strict';
  const T = SK.QUANT_TOPICS;
  // Easier and harder template mixes. The harder mix leans on multi-step and trap-heavy templates.
  const EASY = ['percentOf', 'linear', 'thirdAngle', 'mean', 'remainder', 'qcSwap', 'polygon', 'rectangle', 'arithSeq', 'ratioSplit', 'slope', 'circle', 'evaluate', 'range', 'qcAverage'];
  const HARD = ['percentChange', 'quadratic', 'system', 'roundTrip', 'work', 'mixture', 'noReplace', 'arrange', 'successive', 'reversePercent', 'qcSquare', 'qcNegative', 'absCount', 'overlapPct', 'sdCompare', 'geoSeq', 'arithSum', 'perpendicular'];
  const build = (n, hard, seed) => {
    const items = SK.makeQuant(hard ? HARD : EASY.concat(T.qc.slice(0, 2)), n, seed);
    // About a third of GRE Quant questions are comparisons; keep at least a few.
    return items;
  };
  const App = {
    about: 'Take a full Quant measure under test timing: 12 questions in 21 minutes, then 15 questions in 26 minutes. The second section is harder if you answered at least 8 of the first 12 correctly. Questions are generated, so every attempt is new.',
    how: ['Have scratch paper ready and press **Start** in **Simulator**.', 'Mark questions you want to revisit, and go back before time runs out.', 'The score shown is raw. This app does not estimate an official 130 to 170 score.'],
    tabs: [
      { id: 'sim', label: 'Simulator', render(el) {
        const intro = () => {
          const seed = SK.seedNow();
          SK.clear(el);
          el.appendChild(SK.card('Quantitative Reasoning: two sections', SK.table(['Section', 'Questions', 'Time'], [['1', '12', '21 minutes'], ['2 (adapts to section 1)', '15', '26 minutes']], false),
            SK.h('div', { style: { marginTop: '12px' } }, SK.btn('Start', () => SK.sectionRun(el, [
              { title: 'Quant section 1', seconds: 21 * 60, items: build(12, false, seed) },
              { title: 'Quant section 2', seconds: 26 * 60, items: (res) => build(15, res[0].correct >= 8, seed + 1), intro: '15 questions in 26 minutes. Its difficulty depends on section 1.' }],
            (res) => {
              SK.clear(el);
              el.appendChild(SK.card('Quant results', SK.stats([['Section 1', res[0].correct + ' / 12'], ['Section 2', res[1].correct + ' / 15'], ['Total', res[0].correct + res[1].correct + ' / 27'], ['Second section', res[0].correct >= 8 ? 'Harder' : 'Easier']]), SK.btn('Take another', intro, 'ghost', { 'data-auto': 'once' })));
            }), '', { 'data-auto': 'once' }))));
        };
        intro();
      } },
    ],
    build, EASY, HARD,
    checks: {
      'every template named in the mixes exists': (data, assert) => { for (const n of EASY.concat(HARD)) assert.equal(typeof SK.QUANT[n], 'function', n); },
      'sections have the right length with no repeats': (data, assert) => {
        for (let s = 1; s < 30; s++) for (const [n, hard] of [[12, false], [15, true], [15, false]]) {
          const items = build(n, hard, s);
          assert.equal(items.length, n);
          assert.equal(new Set(items.map((q) => q.id)).size, n);
          for (const q of items) assert.deepEqual(SK.validateItem(q), []);
        }
      },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
