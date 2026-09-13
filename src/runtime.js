/* runtime.js — owns the Python engine on the MAIN thread.
 *
 * Pyodide 0.26.4 is loaded same-origin from ./pyodide/ — the vendored, offline
 * copy that ships with the app (exactly like the page's fonts). No CDN, no
 * network, so the engine always boots. All Python output runs synchronously,
 * which is what we want for a sandbox like this: `run()` returns when the
 * program finishes.
 */

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_ROUTE = './pyodide/';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export async function createPythonPower() {
  await loadScript(`${PYODIDE_ROUTE}pyodide.js`);
  const pyodide = await window.loadPyodide({ indexURL: PYODIDE_ROUTE });

  let out = null;
  let err = null;

  try {
    pyodide.setStdout({ batched: (s) => out && out(String(s)) });
  } catch (e) {}
  try {
    pyodide.setStderr({ batched: (s) => err && err(String(s)) });
  } catch (e) {}

  function run(code, { stdout, stderr } = {}) {
    out = stdout;
    err = stderr;
    try {
      pyodide.runPython(code);
    } catch (e) {
      if (err) err(String(e));
      console.error(e);
    }
  }

  return { run };
}
