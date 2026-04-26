import FolderIcon from "./FolderIcon";
import ChevronIcon from "./ChevronIcon";
import { getFileIcon, highlightText } from "../utils.jsx";

export default function TreeNode({ node, depth, expanded, selected, focused, onToggle, onSelect, onFolderClick, searchQuery }) {
  const isFolder = node.type === "folder";
  const isOpen = expanded.has(node.id);
  const isSelected = selected === node.id;
  const isFocused = focused === node.id;
  const fileInfo = !isFolder ? getFileIcon(node.name) : null;

  return (
    <div
      role="treeitem"
      aria-expanded={isFolder ? isOpen : undefined}
      aria-selected={isSelected}
      tabIndex={isFocused ? 0 : -1}
      data-id={node.id}
      className={`tree-node${isSelected ? " selected" : ""}${isFocused ? " focused" : ""}`}
      style={{ paddingLeft: depth * 12 + 4, paddingRight: 8 }}
      onClick={() => (isFolder ? onFolderClick(node.id) : onSelect(node))}
      onKeyDown={e => {
        if (e.key === "Enter") isFolder ? onFolderClick(node.id) : onSelect(node);
      }}
    >
      {isFolder ? (
        <span className={`node-chevron${isOpen ? " open" : ""}`} style={{ color: isOpen ? "#00d4a0" : undefined }}>
          <ChevronIcon open={isOpen} />
        </span>
      ) : (
        <span style={{ width: 18 }} />
      )}
      <span className="node-icon">
        {isFolder ? (
          <FolderIcon size={13} />
        ) : (
          <span
            className="file-badge"
            style={{
              background: fileInfo.color + "22",
              color: fileInfo.color,
              border: `1px solid ${fileInfo.color}44`,
            }}
          >
            {fileInfo.icon}
          </span>
        )}
      </span>
      <span className={`node-name${isFolder ? " folder" : " muted"}`}>
        {highlightText(node.name, searchQuery)}
      </span>
      {!isFolder && node.size && (
        <span style={{ fontSize: 10, color: "#484f58", flexShrink: 0, paddingRight: 4 }}>{node.size}</span>
      )}
    </div>
  );
}
