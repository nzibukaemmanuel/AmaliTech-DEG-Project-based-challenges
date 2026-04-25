export const FILE_ICONS = {
  pdf:     { icon: "PDF",  color: "#ef4444" },
  png:     { icon: "IMG",  color: "#8b5cf6" },
  jpg:     { icon: "IMG",  color: "#8b5cf6" },
  jpeg:    { icon: "IMG",  color: "#8b5cf6" },
  svg:     { icon: "SVG",  color: "#06b6d4" },
  docx:    { icon: "DOC",  color: "#3b82f6" },
  doc:     { icon: "DOC",  color: "#3b82f6" },
  xlsx:    { icon: "XLS",  color: "#22c55e" },
  xls:     { icon: "XLS",  color: "#22c55e" },
  txt:     { icon: "TXT",  color: "#94a3b8" },
  yaml:    { icon: "YML",  color: "#f59e0b" },
  ttf:     { icon: "TTF",  color: "#a78bfa" },
  default: { icon: "FILE", color: "#64748b" },
};

export const FILE_META = {};

export function getExt(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "default";
}

export function getFileIcon(name) {
  const ext = getExt(name);
  return FILE_ICONS[ext] || FILE_ICONS.default;
}

function getModified() {
  const now = new Date();
  now.setDate(now.getDate() - Math.floor(Math.random() * 30));
  return now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const OWNERS = ["J. Smith", "A. Patel", "M. Chen", "T. Okonkwo"];

export function ensureMeta(id) {
  if (!FILE_META[id]) {
    FILE_META[id] = {
      modified: getModified(),
      owner: OWNERS[Math.floor(Math.random() * OWNERS.length)],
    };
  }
  return FILE_META[id];
}

export function flattenVisible(nodes, expandedSet, depth = 0) {
  const result = [];
  for (const node of nodes) {
    result.push({ ...node, depth });
    if (node.type === "folder" && expandedSet.has(node.id) && node.children?.length) {
      result.push(...flattenVisible(node.children, expandedSet, depth + 1));
    }
  }
  return result;
}

export function filterTree(nodes, query) {
  if (!query) return nodes;
  const q = query.toLowerCase();
  return nodes.reduce((acc, node) => {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(q)) acc.push(node);
    } else {
      const filtered = filterTree(node.children || [], query);
      if (filtered.length > 0 || node.name.toLowerCase().includes(q)) {
        acc.push({ ...node, children: filtered });
      }
    }
    return acc;
  }, []);
}

export function collectIds(nodes, set = new Set()) {
  for (const n of nodes) {
    if (n.type === "folder") {
      set.add(n.id);
      if (n.children) collectIds(n.children, set);
    }
  }
  return set;
}

export function highlightText(text, query) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(0,212,160,0.3)", color: "#00d4a0", borderRadius: "2px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}
