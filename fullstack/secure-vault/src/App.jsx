import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import DATA from "../data.json";
import { flattenVisible, filterTree, collectIds, ensureMeta } from "./utils.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import PropertiesPanel from "./components/PropertiesPanel";

export default function App() {
 
const [expanded, setExpanded] = useState(new Set(["root_1", "leg_1"]));
const [selected, setSelected] = useState(null);
const [focused, setFocused] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
const [toast, setToast] = useState({ msg: "", show: false });
const [activeFolder, setActiveFolder] = useState(null);
const treeRef = useRef(null);

const showToast = useCallback((msg) => {
  setToast({ msg, show: true });
  setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
}, []);

const displayData = useMemo(() => filterTree(DATA, searchQuery), [searchQuery]);

const autoExpanded = useMemo(() => {
  if (!searchQuery) return expanded;
  return new Set([...expanded, ...collectIds(displayData)]);
}, [searchQuery, displayData, expanded]);

const effectiveExpanded = searchQuery ? autoExpanded : expanded;

const flatList = useMemo(
  () => flattenVisible(displayData, effectiveExpanded),
  [displayData, effectiveExpanded],
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

const handleFolderClick = useCallback(
  (id) => {
    setActiveFolder((prev) => (prev === id ? null : id));
    handleToggle(id);
  },
  [handleToggle],
);

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

const selectedMeta = selectedNode ? ensureMeta(selectedNode.id) : null;

const folderContents = useMemo(() => {
  function find(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const r = find(n.children, id);
        if (r) return r;
      }
    }
    return null;
  }
  const node = activeFolder ? find(DATA, activeFolder) : null;
  return node?.children || [];
}, [activeFolder]);

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

return (
  <>
    <div className="scanline-overlay" />
    <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    <div
      className="app"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <Topbar onSync={() => showToast("Sync complete")} />
      <Sidebar
        displayData={displayData}
        effectiveExpanded={effectiveExpanded}
        selected={selected}
        focused={focused}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggle={handleToggle}
        onSelect={handleSelect}
        totalFiles={totalFiles}
      />
      <MainPanel
        selectedNode={selectedNode}
        selectedMeta={selectedMeta}
        activeFolder={activeFolder}
        folderContents={folderContents}
        selected={selected}
        onSelect={handleSelect}
        onFolderClick={handleFolderClick}
      />
      <PropertiesPanel
        selectedNode={selectedNode}
        selectedMeta={selectedMeta}
        onDownload={() => showToast(`Downloading ${selectedNode?.name}...`)}
        onCopyLink={() => {
          navigator.clipboard?.writeText(selectedNode?.id);
          showToast("Link copied");
        }}
        onDelete={() => showToast("Access denied — read only")}
      />
    </div>
  </>
);


}
