import { useRef } from "react";
import TreeBranch from "./TreeBranch";
import SortControl from "./SortControl";

export default function Sidebar({
  displayData,
  effectiveExpanded,
  selected,
  focused,
  searchQuery,
  onSearchChange,
  onToggle,
  onSelect,
  onFolderClick,
  totalFiles,
  rootSort,
  onRootSortChange,
}) {
  const treeRef = useRef(null);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label">File Explorer</span>
        <span className="sidebar-count">{totalFiles} Files</span>
      </div>
      <div className="search-wrap">
        <div className="search-inner" style={{ flex: "0 0 90%" }}>
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="search files..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange("")}>✕</button>
          )}
        </div>
        <SortControl direction={rootSort} onDirectionChange={onRootSortChange} />
      </div>
      <div className="tree-scroll" ref={treeRef} role="tree">
        {displayData.length === 0 ? (
          <div style={{ padding: "20px 16px", fontSize: 11, color: "var(--text-dim)", textAlign: "center" }}>
            No results for "{searchQuery}"
          </div>
        ) : (
          <TreeBranch
            nodes={displayData}
            expanded={effectiveExpanded}
            selected={selected}
            focused={focused}
            onToggle={onToggle}
            onSelect={onSelect}
            onFolderClick={onFolderClick}
            searchQuery={searchQuery}
          />
        )}
      </div>
      <div className="kb-hints">
        <div className="kb-hint"><span className="kb-key">↑↓</span><span className="kb-label">navigate</span></div>
        <div className="kb-hint"><span className="kb-key">→</span><span className="kb-label">expand</span></div>
        <div className="kb-hint"><span className="kb-key">←</span><span className="kb-label">collapse</span></div>
        <div className="kb-hint"><span className="kb-key">↵</span><span className="kb-label">select</span></div>
      </div>
    </aside>
  );
}
