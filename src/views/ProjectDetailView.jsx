import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ReasoningTree from '../components/ReasoningTree';
import NodeDetailModal from '../components/NodeDetailModal';
import { Box, CircularProgress } from '@mui/material';

export default function ProjectDetailView() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'reasoning_nodes', projectId), (doc) => {
            setProject(doc.data());
        });

        return () => unsubscribe();
    }, [projectId]);

    if (!project) return <CircularProgress />;

    return (
        <Box sx={{ p: 3 }}>
            <h1>{project.question}</h1>
            <ReasoningTree rootId={projectId} onNodeSelect={setSelectedNode} />
            <NodeDetailModal
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
        </Box>
    );
}