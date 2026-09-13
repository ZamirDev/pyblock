import * as Blockly from 'blockly';
import { buildClayTheme } from './theme.js';
import { pythonFromWorkspace } from './blocks.js';
import { createPythonPower } from './runtime.js';
import { setupDashboard } from './dashboard.js';
import './style.css';

const TOOLBOX = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Output" colour="#FF9F9F">
    <block type="text_print"/>
    <block type="pyb_friendly_error"/>
  </category>
  <category name="Logic" colour="#7FD8F7">
    <block type="controls_if"/>
    <block type="logic_compare"/>
    <block type="logic_operation"/>
    <block type="logic_negate"/>
    <block type="logic_boolean"/>
  </category>
  <category name="Loops" colour="#C9A9FF">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number"><field name="NUM">4</field></shadow>
      </value>
    </block>
    <block type="controls_whileUntil">
      <value name="BOOL">
        <shadow type="logic_boolean"><field name="BOOL">TRUE</field></shadow>
      </value>
    </block>
    <block type="controls_for">
      <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
      <value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="controls_forEach">
      <value name="LIST">
        <shadow type="lists_create_with">
          <mutation items="3"/>
          <value name="ADD0"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <value name="ADD1"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
          <value name="ADD2"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Math" colour="#A3E3A3">
    <block type="math_number"><field name="NUM">1</field></block>
    <block type="math_arithmetic">
      <value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="math_single"/>
    <block type="math_modulo">
      <value name="DIVIDEND"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
      <value name="DIVISOR"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
    </block>
  </category>
  <category name="Text" colour="#FFC974">
    <block type="text"/>
    <block type="text_join"/>
    <block type="text_length"/>
    <block type="text_isEmpty"/>
    <block type="text_print"/>
    <block type="pyb_input">
      <value name="PROMPT"><shadow type="text"><field name="TEXT">What is your name?</field></shadow></value>
    </block>
  </category>
  <category name="Lists" colour="#8FC1FF">
    <block type="lists_create_with">
      <mutation items="3"/>
      <value name="ADD0"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="ADD1"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
      <value name="ADD2"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
    </block>
    <block type="lists_length"/>
    <block type="lists_getIndex">
      <value name="AT">
        <shadow type="math_number"><field name="NUM">1</field></shadow>
      </value>
    </block>
    <block type="lists_indexOf"/>
  </category>
  <category name="Tuples" colour="#FFA8D9">
    <block type="pyb_tuple_create">
      <value name="ITEM0"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="ITEM1"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
    </block>
    <block type="pyb_tuple_item">
      <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
  </category>
  <category name="Dictionaries" colour="#D9B48F">
    <block type="pyb_dict_create">
      <value name="K0"><shadow type="text"><field name="TEXT">name</field></shadow></value>
      <value name="V0"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="K1"><shadow type="text"><field name="TEXT">age</field></shadow></value>
      <value name="V1"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
      <value name="K2"><shadow type="text"><field name="TEXT">likes</field></shadow></value>
      <value name="V2"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
    </block>
    <block type="pyb_dict_get"/>
    <block type="pyb_dict_has"/>
    <block type="pyb_dict_length"/>
  </category>
  <sep/>
  <category name="Variables" colour="#F5A75B">
    <block type="variables_set"/>
    <block type="variables_get"/>
  </category>
</xml>
`;

const STORE_KEY = 'pyblocks.workspace';

const DEFAULT_PROGRAM = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" x="40" y="30">
    <value name="TEXT">
      <shadow type="text"><field name="TEXT">Hello, PyBlocks! 🐍</field></shadow>
    </value>
  </block>
  <block type="text_print" x="40" y="80">
    <value name="TEXT">
      <shadow type="text"><field name="TEXT">Hello, PyBlocks! 🐍</field></shadow>
    </value>
  </block>
  <block type="controls_forEach" x="40" y="80">
    <field name="VAR">item</field>
    <value name="LIST">
      <block type="lists_create_with">
        <mutation items="3"/>
        <value name="ADD0"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        <value name="ADD1"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
        <value name="ADD2"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
      </block>
    </value>
    <statement name="DO">
      <block type="text_print">
        <value name="TEXT">
          <shadow type="variables_get"><field name="VAR">item</field></shadow>
        </value>
      </block>
    </statement>
  </block>
</xml>
`;

const workspace = Blockly.inject('blocklyArea', {
  toolbox: TOOLBOX,
  theme: buildClayTheme(),
  renderer: 'zelos',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.9,
    maxScale: 1.4,
    minScale: 0.4,
  },
  move: { scrollbars: true, drag: true, wheel: true },
  trashcan: true,
  grid: { spacing: 26, length: 3, colour: '#F1E4D0', snap: true },
});

// --- Dashboard DOM scaffolding (created once, toggled by hash router) ---
(() => {
  const header = document.querySelector('header.topbar');
  if (header) header.id = 'topbar';

  const main = document.querySelector('main.app');
  if (main) {
    const wrapper = document.createElement('div');
    wrapper.id = 'ideArea';
    main.parentNode.insertBefore(wrapper, main);
    wrapper.appendChild(main);
  }

  const cv = document.createElement('div');
  cv.id = 'clayViews';
  const topbarEl = document.getElementById('topbar');
  if (topbarEl && topbarEl.nextSibling) {
    topbarEl.parentNode.insertBefore(cv, topbarEl.nextSibling);
  } else if (main) {
    main.parentNode.insertBefore(cv, main);
  }
})();

function loadDefaultProgram() {
  workspace.clear();
  const xml = Blockly.utils.xml.textToDom(DEFAULT_PROGRAM);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function workspaceXml() {
  const dom = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToText(dom);
}

function loadProgramFromXml(text) {
  workspace.clear();
  try {
    const xml = Blockly.utils.xml.textToDom(text);
    Blockly.Xml.domToWorkspace(xml, workspace);
    return true;
  } catch (e) {
    console.error('Failed to restore saved program', e);
    return false;
  }
}

function restoreProgram() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORE_KEY);
  } catch (e) {}
  if (saved && loadProgramFromXml(saved)) {
    return;
  }
  loadDefaultProgram();
}

const INPUT_DEMO_PROGRAM = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" x="40" y="30">
    <value name="TEXT">
      <shadow type="text"><field name="TEXT">Hello! What is your name?</field></shadow>
    </value>
  </block>
  <block type="variables_set" x="40" y="90">
    <field name="VAR">name</field>
    <value name="VALUE">
      <block type="pyb_input">
        <value name="PROMPT">
          <shadow type="text"><field name="TEXT">Type your name:</field></shadow>
        </value>
      </block>
    </value>
  </block>
  <block type="text_print" x="40" y="150">
    <value name="TEXT">
      <block type="text_join">
        <mutation items="2"/>
        <value name="ADD0">
          <shadow type="text"><field name="TEXT">Hello, </field></shadow>
        </value>
        <value name="ADD1">
          <block type="variables_get"><field name="VAR">name</field></block>
        </value>
      </block>
    </value>
  </block>
</xml>
`;

function loadInputDemo() {
  workspace.clear();
  const xml = Blockly.utils.xml.textToDom(INPUT_DEMO_PROGRAM);
  Blockly.Xml.domToWorkspace(xml, workspace);
  codeView.textContent = pythonFromWorkspace(workspace);
}
restoreProgram();

// ---------- UI wiring ----------
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const runStatus = document.getElementById('runStatus');
const consoleEl = document.getElementById('console');
const codeView = document.getElementById('codeView');
const tabOutput = document.getElementById('tabOutput');
const tabCode = document.getElementById('tabCode');
const outputPanel = document.getElementById('outputPanel');
const codePanel = document.getElementById('codePanel');
const copyBtn = document.getElementById('copyCodeBtn');

let power = null;

function setStatus(text, ready = false) {
  runStatus.textContent = text;
  runBtn.disabled = !ready;
  runBtn.classList.toggle('disabled', !ready);
}

async function boot() {
  try {
    const consoleLine = document.createElement('div');
    consoleLine.className = 'console-hint';
    consoleLine.textContent = '🐍 Python engine loading (one-time, ~10 MB)…';
    consoleEl.appendChild(consoleLine);
    power = await createPythonPower();
    consoleLine.textContent = '✅ Python engine ready — hit ▶ Run!';
    setStatus('ready to run', true);
  } catch (e) {
    console.error(e);
    setStatus('😿 engine failed — check internet', false);
    const line = document.createElement('div');
    line.className = 'console-error';
    line.textContent = 'Could not load the Python engine. Make sure you have internet (Pyodide loads from CDN on first run).';
    consoleEl.appendChild(line);
  }
}

function consoleLine(text, kind = 'out') {
  const div = document.createElement('div');
  div.className = kind === 'err' ? 'console-error' : kind === 'warn' ? 'console-warn' : 'console-line';
  div.textContent = text;
  consoleEl.appendChild(div);
}

function consoleHint(text) {
  const div = document.createElement('div');
  div.className = 'console-hint';
  div.textContent = text;
  consoleEl.appendChild(div);
}

function friendlyMessage(pythonErrorOrText) {
  const text = String(pythonErrorOrText);
  if (/KeyboardInterrupt/.test(text)) {
    return '👀 Your program ran for too long. Looks like an endless loop — check your while and for blocks!';
  }
  const lines = text.split('\n').map((s) => s.trim()).filter(Boolean);
  let msg = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/Error:|Exception:/i.test(lines[i])) {
      msg = lines[i];
      break;
    }
  }
  if (!msg && lines.length) msg = lines[lines.length - 1];
  if (!msg) return 'Something went wrong — try again with a smaller program!';
  return '🙈 Oops! ' + msg;
}

function onRun() {
  const code = pythonFromWorkspace(workspace);
  codeView.textContent = code;
  if (!power) return;

  consoleEl.innerHTML = '';
  consoleHint('▼ your program output');
  try {
    power.run(code, {
      stdout: (t) => consoleLine(String(t)),
      stderr: (t) => consoleLine(String(t), 'err'),
    });
  } catch (e) {
    consoleLine(friendlyMessage(e && e.message ? e.message : e), 'err');
  }
  consoleHint('▲ the end');
  scrollOutputToEnd();
}

function scrollOutputToEnd() {
  const wrap = outputPanel;
  wrap.scrollTop = wrap.scrollHeight;
}

// Update code view on any workspace change (debounced)
let codeUpdateTimer;
workspace.addChangeListener(() => {
  clearTimeout(codeUpdateTimer);
  codeUpdateTimer = setTimeout(() => {
    codeView.textContent = pythonFromWorkspace(workspace);
  }, 140);
});

runBtn.addEventListener('click', onRun);
clearBtn.addEventListener('click', () => {
  loadDefaultProgram();
  codeView.textContent = pythonFromWorkspace(workspace);
  consoleEl.innerHTML = '';
  consoleHint('Workspace reset — hit ▶ Run again!');
});

saveBtn.addEventListener('click', () => {
  try {
    localStorage.setItem(STORE_KEY, workspaceXml());
    saveBtn.textContent = '✅ Saved';
    setTimeout(() => (saveBtn.textContent = '💾 Save'), 1500);
  } catch (e) {
    saveBtn.textContent = '✕';
  }
});

tabOutput.addEventListener('click', () => switchPanel('output'));
tabCode.addEventListener('click', () => switchPanel('code'));
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeView.textContent);
    copyBtn.textContent = '✓';
    setTimeout(() => (copyBtn.textContent = '⧉'), 1200);
  } catch (e) {
    copyBtn.textContent = '✕';
  }
});

function switchPanel(which) {
  const showOutput = which === 'output';
  outputPanel.classList.toggle('active', showOutput);
  codePanel.classList.toggle('active', !showOutput);
  tabOutput.classList.toggle('active', showOutput);
  tabCode.classList.toggle('active', !showOutput);
}

codeView.textContent = pythonFromWorkspace(workspace);

boot();

setupDashboard({ workspace, loadDefaultProgram, loadInputDemo, pythonFromWorkspace });