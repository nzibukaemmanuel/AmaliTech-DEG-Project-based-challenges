import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import DATA from "../data.json";
import { flattenVisible, filterTree, collectIds } from "./utils.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import PropertiesPanel from "./components/PropertiesPanel";

function getAncestorIds(nodes, targetId, path = []) {
  for (const n of nodes) {
    if (n.id === targetId) return path;
    if (n.children) {
      const found = getAncestorIds(n.children, targetId, [...path, n.id]);
      if (found) return found;
    }
  }
  return null;
}

export default function App() {

const [expanded, setExpanded] = useState(() => {
  const base = new Set(["root_1", "leg_1"]);
  const fileId = new URLSearchParams(window.location.search).get("file");
  if (fileId) {
    const ancestors = getAncestorIds(DATA, fileId);
    if (ancestors) ancestors.forEach(id => base.add(id));
  }
  return base;
});
const [selected, setSelected] = useState(() => new URLSearchParams(window.location.search).get("file"));
const [focused, setFocused] = useState(null);
const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
const [toast, setToast] = useState({ msg: "", show: false });
const [rootSort, setRootSort] = useState(() => new URLSearchParams(window.location.search).get("sort") ?? "asc");
const treeRef = useRef(null);

const showToast = useCallback((msg) => {
  setToast({ msg, show: true });
  setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
}, []);

useEffect(() => {
  const params = new URLSearchParams();
  if (searchQuery) params.set("q", searchQuery);
  if (rootSort !== "asc") params.set("sort", rootSort);
  if (selected) params.set("file", selected);
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}, [searchQuery, rootSort, selected]);

const displayData = useMemo(() => filterTree(DATA, searchQuery), [searchQuery]);

const sortedDisplayData = useMemo(() => {
  const items = [...displayData];
  items.sort((a, b) =>
    rootSort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  return items;
}, [displayData, rootSort]);

const autoExpanded = useMemo(() => {
  if (!searchQuery) return expanded;
  return new Set([...expanded, ...collectIds(displayData)]);
}, [searchQuery, displayData, expanded]);

const effectiveExpanded = searchQuery ? autoExpanded : expanded;

const flatList = useMemo(
  () => flattenVisible(sortedDisplayData, effectiveExpanded),
  [sortedDisplayData, effectiveExpanded],
);

const handleToggle = useCallback((id) => {
  setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  setFocused(id);
}, []);

const handleSelect = useCallback((node) => {
  setSelected(node.id);
  setFocused(node.id);
}, []);

const handleKeyDown = useCallback(
  (e) => {
    const idx = flatList.findIndex((n) => n.id === focused);
    if (idx === -1 && flatList.length > 0) {
      setFocused(flatList[0].id);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx < flatList.length - 1) setFocused(flatList[idx + 1].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx > 0) setFocused(flatList[idx - 1].id);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const node = flatList[idx];
      if (node?.type === "folder" && !effectiveExpanded.has(node.id))
        handleToggle(node.id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const node = flatList[idx];
      if (node?.type === "folder" && effectiveExpanded.has(node.id))
        handleToggle(node.id);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const node = flatList[idx];
      if (node?.type === "file") handleSelect(node);
      else if (node?.type === "folder") handleToggle(node.id);
    }
  },
  [flatList, focused, effectiveExpanded, handleToggle, handleSelect],
);

useEffect(() => {
  if (focused && treeRef.current) {
    const el = treeRef.current.querySelector(`[data-id="${focused}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }
}, [focused]);

const selectedNode = useMemo(() => {
  function find(nodes) {
    for (const n of nodes) {
      if (n.id === selected) return n;
      if (n.children) {
        const r = find(n.children);
        if (r) return r;
      }
    }
    return null;
  }
  return selected ? find(DATA) : null;
}, [selected]);

const totalFiles = useMemo(() => {
  let c = 0;
  function count(nodes) {
    for (const n of nodes) {
      n.type === "file" ? c++ : count(n.children || []);
    }
  }
  count(DATA);
  return c;
}, []);

const hasFile = selectedNode?.type === "file";

return (
  <>
    <div className="scanline-overlay" />
    <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    <div
      className="app"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ outline: "none", gridTemplateColumns: hasFile ? "1fr 1fr" : "1fr" }}
    >
      <Topbar />
      <Sidebar
        displayData={sortedDisplayData}
        effectiveExpanded={effectiveExpanded}
        selected={selected}
        focused={focused}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onFolderClick={handleToggle}
        totalFiles={totalFiles}
        rootSort={rootSort}
        onRootSortChange={setRootSort}
      />
      {hasFile && (
        <PropertiesPanel selectedNode={selectedNode} />
      )}
    </div>
  </>
);

}
