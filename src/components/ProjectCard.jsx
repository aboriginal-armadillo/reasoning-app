import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {project.question}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {project.type}
                </Typography>
                <Typography variant="body2">
                    Status: {project.status}
                </Typography>
                <Button
                    component={Link}
                    to={`/project/${project.id}`}
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
}