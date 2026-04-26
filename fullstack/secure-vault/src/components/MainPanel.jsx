import { useState, useMemo } from "react";
import { getFileIcon, getExt } from "../utils.jsx";
import SortControl from "./SortControl";

export default function MainPanel({ items, navPath, onFolderEnter, onNavBack, selectedNode, selected, onSelect }) {
  const [sortDir, setSortDir] = useState("asc");

  const sortedItems = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) =>
      sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return arr;
  }, [items, sortDir]);

  return (
    <main className="main">
      <div className="breadcrumb">
        <span
          className={`breadcrumb-item${navPath.length > 0 ? " link" : " active"}`}
          onClick={navPath.length > 0 ? () => onNavBack(-1) : undefined}
        >
          root
        </span>
        {navPath.map((seg, i) => (
          <span key={seg.id} style={{ display: "contents" }}>
            <span className="breadcrumb-sep">/</span>
            <span
              className={`breadcrumb-item${i < navPath.length - 1 ? " link" : " active"}`}
              onClick={i < navPath.length - 1 ? () => onNavBack(i) : undefined}
            >
              {seg.name}
            </span>
          </span>
        ))}
      </div>

      <div className="main-toolbar">
        <span className="section-label" style={{ margin: 0 }}>
          {navPath.length === 0 ? "vault://" : navPath[navPath.length - 1].name}
        </span>
        <SortControl direction={sortDir} onDirectionChange={setSortDir} />
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-hex">🔒</div>
          <div className="empty-label">Vault is empty</div>
          <div className="empty-sub">No files or folders found</div>
        </div>
      ) : (
        <div className="main-list">
          {sortedItems.map(item => {
            const isFolder = item.type === "folder";
            const fi = !isFolder ? getFileIcon(item.name) : null;
            return (
              <div
                key={item.id}
                className={`main-list-item${selected === item.id ? " selected" : ""}`}
                onClick={() => isFolder ? onFolderEnter(item) : onSelect(item)}
              >
                <div className="mli-icon">
                  {isFolder ? (
                    <div className="mli-folder-icon" />
                  ) : (
                    <span
                      className="file-badge"
                      style={{
                        fontSize: 9, padding: "2px 5px",
                        background: fi.color + "22",
                        color: fi.color,
                        border: `1px solid ${fi.color}44`,
                      }}
                    >
                      {fi.icon}
                    </span>
                  )}
                </div>
                <div className="mli-name">{item.name}</div>
                {isFolder
                  ? <span className="mli-chevron">›</span>
                  : item.size && <span className="mli-size">{item.size}</span>
                }
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
