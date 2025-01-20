import React, { useState } from 'react';
import { db } from '../firebase';
import { Button, TextField, Select, MenuItem } from '@mui/material';

const PROJECT_TYPES = [
    'TV Series',
    'Academic Program',
    'Research Project',
    'Business Plan'
];

export default function CreateProjectView() {
    const [project, setProject] = useState({
        title: '',
        description: '',
        type: 'TV Series',
        depth: 3
    });

    const handleSubmit = async () => {
        const docRef = await db.collection('reasoning_nodes').add({
            question: `Create ${project.type}: ${project.title}`,
            description: project.description,
            type: project.type,
            depth: project.depth,
            status: 'new',
            createdAt: new Date()
        });
        // Navigate to project view
    };

    return (
        <div className="create-project">
            <TextField
                label="Project Title"
                value={project.title}
                onChange={e => setProject({...project, title: e.target.value})}
            />
            <Select
                value={project.type}
                onChange={e => setProject({...project, type: e.target.value})}
            >
                {PROJECT_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
            </Select>
            <Button variant="contained" onClick={handleSubmit}>
                Start Project
            </Button>
        </div>
    );
}  