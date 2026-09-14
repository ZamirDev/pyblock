# PyBlocks

**Scratch-style visual programming IDE with a real Python engine.**

Drag-and-drop blocks that compile to real Python and run instantly in the browser — powered by Pyodide (CPython in WebAssembly). No server, no accounts, no install.

**Live:** [pyblocks-drab.vercel.app](https://pyblocks-drab.vercel.app)

---

## Features

- **Block-to-Python:** snap blocks together, see the equivalent Python code update live
- **Real execution:** runs on Pyodide (full CPython 3.x compiled to WASM) — not a simulator
- **Save / restore:** workspace persists to localStorage, survives page refresh
- **Clay theme:** warm paper-white palette, rounded blocks, friendly fonts (Fredoka + Baloo 2)
- **Zero backend:** 100 % client-side — works offline once loaded

## Blocks

| Category | Example blocks |
|----------|----------------|
| Events | `when green flag clicked`, `when key pressed` |
| Control | `repeat`, `forever`, `if / else` |
| Motion | `move 10 steps`, `turn 15 degrees` |
| Looks | `say Hello`, `set color` |
| Sensing | `ask`, `touching edge?` |
| Operators | `+`, `-`, `*`, `/`, `random` |
| Variables | `set`, `change`, `show variable` |
| Input | `Input` block (connects to a text field) |

## Tech stack

- **Vite** (build tool)
- **Pyodide** (CPython in WebAssembly)
- **Vanilla JS** (no framework)

## Run locally

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build

```bash
npm run build
# output in dist/
```

## License

MIT
