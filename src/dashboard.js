/* dashboard.js — Scratch-style clay dashboard (Part 2).
 *
 * View layer only. The Python engine stays exactly like Part 1 (main
 * thread, vendored same-origin ./pyodide/, no CDN). Blockly stays the same
 * injected workspace. This file ONLY renders the collage = hero + nav +
 * ideas feed + explore placeholder + about blurb, and toggles the IDE.
 *
 * Routing is hash-based (#/create, #/ideas, #/explore, #/about, #/ or none
 * = the dashboard home). Hash-only = no server config, no reload, survives
 * a jury browser refresh, and the workspace NEVER remounts (state intact).
 *
 * All DOM refs are lazy (resolved on first use) so importing this module
 * before the HTML mounts is safe.
 */

/* ----------------------------------------------------------- lazy DOM --- */

function $(id) { return document.getElementById(id); }
function root() { return $('ideArea'); }
function topbar() { return $('topbar'); }
function clayViews() { return $('clayViews'); }

/* --------------------------------------------------------------- ideas --- */

const IDEAS = [
  {
    id: 1,
    tag: 'starter · ask-the-user',
    title: 'Your name, a hello',
    blurb:
      'Program pauses and asks for the user\'s name, then prints Hello, <name>! — the clay input demo.',
    blocks: 'pyb_input \u21E2 text_print',
    cta: '\u25B6 start with this',
    demo: 'inputDemo',
  },
  {
    id: 2,
    tag: 'starter',
    title: 'How old will you be?',
    blurb: 'Ask their age, add 10, print the future answer.',
    blocks: 'pyb_input \u21E2 math_arithmetic \u2192 text_print',
    cta: '\u25B6 start with this',
    demo: null,
  },
  {
    id: 3,
    tag: 'starter',
    title: 'Mad-libs mania',
    blurb: 'Three asks \u2192 build one silly clay sentence.',
    blocks: 'pyb_input \u00D73 \u2192 text_join \u2192 text_print',
    cta: '\u25B6 start with this',
    demo: null,
  },
  {
    id: 4,
    tag: 'more',
    title: 'Count 1\u00B72\u00B73',
    blurb: 'A clay list, a loop, a counter \u2014 the numbers go marching.',
    blocks: 'lists_create_with \u21E2 controls_forEach \u2192 text_print',
    cta: '\u25B6 start with this',
    demo: null,
  },
  {
    id: 5,
    tag: 'more',
    title: 'Nested loops',
    blurb: 'Two loops in a row \u2014 a tiny multiplication clay square.',
    blocks: 'controls_for \u00D7 controls_for \u2192 text_print',
    cta: '\u25B6 start with this',
    demo: null,
  },
  {
    id: 6,
    tag: 'dictionary',
    title: 'My clay dictionary',
    blurb: 'Build a dict, look up a key, print a fact about yourself.',
    blocks: 'pyb_dict_create \u21E2 pyb_dict_get \u2192 text_print',
    cta: '\u25B6 start with this',
    demo: null,
  },
];

/* ----------------------------------------------------------- routes --- */

export function setupDashboard({ workspace, loadDefaultProgram, loadInputDemo, pythonFromWorkspace }) {
  const r = root();
  if (!r) return;
  const views = clayViews();
  const tb = topbar();
  if (!views || !tb) return;

  buildNav(tb);
  wireNav(tb);
  wireIdeas(views, workspace, loadDefaultProgram, loadInputDemo, pythonFromWorkspace);
  wireRouting(r, views, tb);
}

/* ------------------------------------------------------------- views --- */

function renderHome(views) {
  views.innerHTML = `
    <section class="dash-hero">
      <div class="dash-hero-inner">
        <p class="dash-eyebrow">clay \u00B7 offline \u00B7 python</p>
        <h1 class="dash-title">Build real Python.<br/><span class="dash-accent">Drag. Snap. Run.</span></h1>
        <p class="dash-sub">PyBlocks turns real Python into clay blocks \u2014 no CDN, no
          waiting, no "Running Python\u2026" forever. Your code runs right here, offline.</p>
        <div class="dash-cta">
          <a class="clay-btn clay-btn-primary" href="#/create">\u25B6 Start creating</a>
          <a class="clay-btn clay-btn-ghost" href="#/ideas">\u2728 Surprise me</a>
        </div>
        <ul class="dash-facts">
          <li>\uD83E\uDDE9 clay block engine</li>
          <li>\uD83C\uDF10 no CDN \u2014 same origin</li>
          <li>\uD83D\uDCE6 0.26.4 vendored engine</li>
        </ul>
      </div>
    </section>`;

  const cards = IDEAS.map(clayCard).join('');
  views.insertAdjacentHTML('beforeend', `
    <section class="dash-ideas">
      <div class="dash-ideas-head">
        <h2>Ideas \u2014 start with a challenge</h2>
        <p>Each card is a tiny clay starter. Card #1 presses \u25B6 by itself.</p>
      </div>
      <div class="dash-card-grid">${cards}</div>
    </section>`);
}

function renderIdeas(views) {
  const cards = IDEAS.map(clayCard).join('');
  views.innerHTML = `
    <section class="dash-ideas">
      <div class="dash-ideas-head">
        <h2>Ideas \u2014 start with a challenge</h2>
        <p>Every card loads right into the workspace. The first one proves
          the ask-the-user block \u2014 try it.</p>
      </div>
      <div class="dash-card-grid">${cards}</div>
    </section>`;
}

function renderExplore(views) {
  views.innerHTML = `
    <section class="dash-empty">
      <h3>\uD83C\uDF31 Explore \u2014 coming soon</h3>
      <p>Real user projects will live here. For now it's clay-royally empty \u2014
        no fake examples. <span class="dash-empty-hint">Hit Create to make the
        first one!</span></p>
      <a class="clay-btn clay-btn-primary" href="#/create">Create the first project \u2192</a>
    </section>`;
}

function renderAbout(views) {
  views.innerHTML = `
    <section class="dash-empty dash-about">
      <h3>About PyBlocks</h3>
      <p>\uD83D\uDC0D Python engine: <b>Pyodide 0.26.4</b>, vendored + same-origin (no CDN).
        <br/><b>Blockly 13.3.0</b> drives the clay blocks; the IDE runs entirely
        offline in your browser.</p>
      <p class="dash-about-fonts">Fonts (vendored, clay-styled): Baloo 2 \u00B7 Fredoka</p>
      <p class="dash-about-tiny">Made with clay \u2014 for the hackathon jury.</p>
    </section>`;
}

function clayCard(idea, i) {
  const tag = idea.tag ? `<span class="clay-tag">${idea.tag}</span>` : '';
  return `
    <article class="clay-card idea-card" style="--card-i:${i}">
      <div class="idea-card-top">
        <span class="idea-num">#${idea.id}</span>
        ${tag}
      </div>
      <h3>${idea.title}</h3>
      <p>${idea.blurb}</p>
      <div class="idea-blocks">${idea.blocks}</div>
      <button class="clay-btn clay-btn-ghost idea-btn" data-idea-id="${idea.id}">${idea.cta}</button>
    </article>`;
}

/* ------------------------------------------------------------- nav --- */

function buildNav(tb) {
  if (tb.querySelector('.clay-nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'clay-nav';
  nav.innerHTML = `
    <a class="clay-nav-item" href="#/" data-nav="home">\uD83D\uDC0D PyBlocks</a>
    <a class="clay-nav-item" href="#/create" data-nav="create">Create</a>
    <a class="clay-nav-item" href="#/ideas" data-nav="ideas">Ideas</a>
    <a class="clay-nav-item" href="#/explore" data-nav="explore">Explore</a>
    <a class="clay-nav-item" href="#/about" data-nav="about">About</a>`;
  tb.appendChild(nav);
}

function wireNav(tb) {
  tb.addEventListener('click', (e) => {
    const link = e.target.closest('.clay-nav-item');
    if (!link) return;
    e.preventDefault();
    location.hash = link.getAttribute('href');
  });
}

function highlightNav(route) {
  const href = route === 'home' ? '#/' : '#' + route;
  document.querySelectorAll('.clay-nav-item').forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === href);
  });
}

/* ---------------------------------------------------------- ideas --- */

function wireIdeas(views, workspace, loadDefaultProgram, loadInputDemo, pythonFromWorkspace) {
  views.addEventListener('click', (e) => {
    const btn = e.target.closest('.idea-btn');
    if (!btn) return;
    const id = Number(btn.dataset.ideaId);
    if (id === 1) {
      if (loadInputDemo) loadInputDemo();
      else if (loadDefaultProgram) loadDefaultProgram();
    }
    location.hash = '#/create';
  });
}

/* ---------------------------------------------------------- routing --- */

function wireRouting(r, views, tb) {
  function visit() {
    const hash = location.hash || '#/';
    const route = hash.replace(/^#\/?/, '').split('/')[0] || 'home';

    if (route === 'create') {
      r.hidden = false;
      views.hidden = true;
      views.innerHTML = '';
      resizeBlockly(workspace);
    } else {
      r.hidden = true;
      views.hidden = false;
      switch (route) {
        case 'ideas':  renderIdeas(views);  break;
        case 'explore': renderExplore(views); break;
        case 'about':  renderAbout(views);  break;
        default:       renderHome(views);   break;
      }
    }
    highlightNav(route);
  }

  window.addEventListener('hashchange', visit);
  visit();
}

function resizeBlockly(workspace) {
  if (!workspace || typeof workspace.resize !== 'function') return;
  requestAnimationFrame(() => workspace.resize());
}
