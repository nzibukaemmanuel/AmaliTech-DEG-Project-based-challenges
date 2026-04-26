import { useState, useMemo } from "react";
import { getFileIcon, getExt } from "../utils.jsx";
import SortControl from "./SortControl";

export default function MainPanel({ selectedNode, selectedMeta, activeFolder, folderContents, selected, onSelect, onFolderClick }) {
  const [sortDir, setSortDir] = useState("asc");

  const sortedContents = useMemo(() => {
    const items = [...folderContents];
    items.sort((a, b) =>
      sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return items;
  }, [folderContents, sortDir]);

  return (
    <main className="main">
      <div className="breadcrumb">
        <span className="breadcrumb-item">vault://</span>
        {selectedNode ? (
          <>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">{selectedNode.name}</span>
          </>
        ) : (
          <span className="breadcrumb-item active">root</span>
        )}
      </div>

      {!selectedNode && !activeFolder ? (
        <div className="empty-state">
          <div className="empty-hex">🔒</div>
          <div className="empty-label">Select a file or folder</div>
          <div className="empty-sub">Click any item in the explorer →</div>
        </div>
      ) : (
        <div className="main-content">
          {activeFolder && folderContents.length > 0 && (
            <>
              <div className="folder-bar">
                <span className="section-label" style={{ margin: 0 }}>Folder contents</span>
                <SortControl direction={sortDir} onDirectionChange={setSortDir} />
              </div>
              <div className="grid-view">
                {sortedContents.map(item => {
                  const fi = item.type === "file" ? getFileIcon(item.name) : null;
                  return (
                    <div
                      key={item.id}
                      className={`grid-card${selected === item.id ? " selected" : ""}`}
                      onClick={() => item.type === "file" ? onSelect(item) : onFolderClick(item.id)}
                    >
                      <div className="grid-card-icon">
                        {item.type === "folder" ? (
                          <div className="grid-folder-icon" />
                        ) : (
                          <span
                            className="file-badge"
                            style={{
                              fontSize: 11, padding: "3px 6px",
                              background: fi.color + "22",
                              color: fi.color,
                              border: `1px solid ${fi.color}44`,
                            }}
                          >
                            {fi.icon}
                          </span>
                        )}
                      </div>
                      <div className="grid-card-name">{item.name}</div>
                      {item.size && <div className="grid-card-meta">{item.size}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {selectedNode?.type === "file" && (
            <>
              <div className="section-label" style={{ marginTop: activeFolder && folderContents.length > 0 ? 20 : 0 }}>
                Selected file preview
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
                {(() => {
                  const fi = getFileIcon(selectedNode.name);
                  return (
                    <div style={{ width: 60, height: 60, borderRadius: 10, background: fi.color + "22", border: `1px solid ${fi.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, color: fi.color }}>{fi.icon}</span>
                    </div>
                  );
                })()}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4, wordBreak: "break-all" }}>{selectedNode.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                    Size: <span style={{ color: "var(--accent)" }}>{selectedNode.size}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Modified: {selectedMeta?.modified}</div>
                </div>
              </div>

              <div style={{ marginTop: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 16px" }}>
                {[
                  ["Type",       getExt(selectedNode.name).toUpperCase()],
                  ["Owner",      selectedMeta?.owner],
                  ["Encryption", "AES-256"],
                  ["Access",     "Restricted"],
                  ["Integrity",  "SHA-256 ✓"],
                ].map(([k, v], i, arr) => (
                  <div
                    key={k}
                    style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}
                  >
                    <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{k}</span>
                    <span style={{ fontSize: 12, color: k === "Integrity" ? "#22c55e" : "var(--text-muted)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
