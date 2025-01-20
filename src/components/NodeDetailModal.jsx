import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function NodeDetailModal({ node, onClose }) {
    return (
        <Modal open={!!node} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    {node?.question}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {node?.answer || 'Processing...'}
                </Typography>
                <Button
                    onClick={onClose}
                    sx={{ mt: 2 }}
                    variant="contained"
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}