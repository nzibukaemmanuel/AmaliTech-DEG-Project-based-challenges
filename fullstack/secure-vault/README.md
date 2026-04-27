# SecureVault Dashboard

A high-performance file explorer UI built for enterprise cloud storage. Designed with a dark "cyber-secure" aesthetic for law firms and banks that need to navigate deeply nested document structures with speed and precision.

| | |
|---|---|
| **Live Demo** | [Secure Vault_ Netlify](https://voluble-douhua-8ed86c.netlify.app/) |
| **Design File** | [Secure Vault — Figma](https://www.figma.com/design/Aw4fpNZbREMeAwwmvYC2OH/Secure-vault?node-id=0-1&t=yeYWJNnbbzbcB5ax-1) |

---

## Tech Stack

- **React 19** — component architecture and state management
- **Vite** — development server and build tooling
- **Custom CSS** — no component libraries; all UI built from scratch

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd fullstack/secure-vault

# Install dependencies
npm install

# Start the development server
npm start
```

The app runs on `http://localhost:5173` by default.

---

## Features

### Recursive File Tree
Folders expand and collapse on click. The tree handles arbitrary nesting depth — the same `TreeBranch` component renders itself recursively for each level of children, so 2 levels and 20 levels work identically.

### File Properties Panel
Selecting a file opens a properties panel that slides in from the right and occupies 50% of the screen. It displays the file's **Name**, **Type**, and **Size** directly from the data source — no mock or derived fields. Deselecting a file collapses the panel and the tree returns to full width.

### Keyboard Navigation
Full keyboard support for power users:

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move focus between visible items |
| `→` | Expand focused folder |
| `←` | Collapse focused folder |
| `Enter` | Select focused file |

### Search & Filter
The search bar filters the tree in real time. Folders that contain matching items are automatically expanded so results are never hidden inside collapsed nodes.

### URL State Persistence
Application state is encoded in the URL query string. Refreshing the page or sharing a link restores the exact view — including active search, sort direction, and selected file. The tree also pre-expands ancestor folders so the selected file is immediately visible.

```
?q=Discovery     — active search query
?sort=desc       — sort direction (omitted when ascending, the default)
?file=email_1    — selected file ID
```

---

## Wildcard Feature — Sort

**What it does:** A sort toggle button (`⇅ Sort ↑ / ↓`) in the sidebar toolbar lets users switch between ascending and descending alphabetical order for the file tree. The sort direction is persisted in the URL so it survives a page refresh.

**Why it adds value:** Enterprise vaults accumulate hundreds of documents across deeply nested folders. Alphabetical sorting is how lawyers and analysts mentally index their files — being able to flip the order (e.g., newest-named files to the top when files are date-prefixed) lets them locate documents without scrolling through the entire tree. It is a zero-learning-curve feature that directly reduces time-to-file.

---

## Recursive Strategy

The data structure is a tree of nodes where each node is either a `file` (leaf) or a `folder` (branch with a `children` array). The rendering strategy mirrors this shape directly:

- **`TreeBranch`** receives an array of nodes and maps over them, rendering a `TreeNode` for each.
- For every `folder` node that is expanded, `TreeBranch` renders another `TreeBranch` with `node.children` — the recursion.
- Depth is tracked via a `depth` prop and used only for visual indentation (`paddingLeft: depth * 12px`).

```
TreeBranch(nodes)
  └─ TreeNode(node)          ← renders one item (folder or file)
       └─ TreeBranch(children)   ← recurses if folder is expanded
            └─ TreeNode(node)
                 └─ ...
```

This means no special-casing for depth: adding a 10th nesting level requires no code change. The `flattenVisible` utility traverses the same tree to produce the flat keyboard-navigation list, applying the same recursive pattern.

---

## Project Structure

```
src/
├── components/
│   ├── Topbar.jsx          — app header
│   ├── Sidebar.jsx         — search, sort, and tree host
│   ├── TreeBranch.jsx      — recursive branch renderer
│   ├── TreeNode.jsx        — single tree item (folder or file)
│   ├── ChevronIcon.jsx     — animated expand/collapse indicator
│   ├── FolderIcon.jsx      — folder icon
│   ├── PropertiesPanel.jsx — file detail panel
│   └── SortControl.jsx     — reusable sort direction toggle
├── utils.jsx               — tree traversal, search filter, flat list
├── styles.css              — design system and all component styles
├── App.jsx                 — state management and layout
└── main.jsx                — entry point
data.json                   — vault file structure
```
