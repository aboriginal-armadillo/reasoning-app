import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Tree, TreeNode } from 'react-organizational-chart';

export default function ReasoningTree({ rootId }) {
    const [nodes, setNodes] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        const unsubscribe = db.collection('reasoning_nodes')
            .where('parentId', '==', rootId)
            .onSnapshot(snapshot => {
                const newNodes = {};
                snapshot.forEach(doc => {
                    newNodes[doc.id] = doc.data();
                });
                setNodes(newNodes);
            });

        return () => unsubscribe();
    }, [rootId]);

    return (
        <div className="reasoning-tree">
            <Tree label={<NodeContent node={selectedNode || nodes[rootId]} />}>
                {Object.values(nodes).map(node => (
                    <TreeNode key={node.id} label={<NodeContent node={node} />}>
                        {/* Recursive children rendering */}
                    </TreeNode>
                ))}
            </Tree>
        </div>
    );
}

function NodeContent({ node }) {
    return (
        <div className="node-card" onClick={() => {/* Implement click handler */}}>
            <h4>{node.question}</h4>
            <p>Status: {node.status}</p>
            {node.answer && <div className="node-answer">{node.answer}</div>}
        </div>
    );
}