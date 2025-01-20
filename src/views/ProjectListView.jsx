import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ProjectCard from '../components/ProjectCard';
import { Grid } from '@mui/material';

export default function ProjectListView() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'reasoning_nodes'), where('parentId', '==', null));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = [];
            snapshot.forEach(doc => {
                projectsData.push({ id: doc.id, ...doc.data() });
            });
            setProjects(projectsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Grid container spacing={2} sx={{ p: 3 }}>
            {projects.map(project => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <ProjectCard project={project} />
                </Grid>
            ))}
        </Grid>
    );
}