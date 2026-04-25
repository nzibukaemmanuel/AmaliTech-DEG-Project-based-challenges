import TreeNode from "./TreeNode";

export default function TreeBranch({ nodes, expanded, selected, focused, onToggle, onSelect, searchQuery, depth = 0 }) {
  return (
    <>
      {nodes.map(node => (
        <div key={node.id}>
          <TreeNode
            node={node}
            depth={depth}
            expanded={expanded}
            selected={selected}
            focused={focused}
            onToggle={onToggle}
            onSelect={onSelect}
            searchQuery={searchQuery}
          />
          {node.type === "folder" && expanded.has(node.id) && node.children?.length > 0 && (
            <TreeBranch
              nodes={node.children}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              focused={focused}
              onToggle={onToggle}
              onSelect={onSelect}
              searchQuery={searchQuery}
            />
          )}
        </div>
      ))}
    </>
  );
}
