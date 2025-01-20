import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';  
import { db } from '../firebase';  
import { collection, addDoc } from 'firebase/firestore';  
import {   
  Button,   
  TextField,   
  Select,   
  MenuItem,   
  InputLabel,   
  FormControl,   
  FormHelperText,  
  Grid, // 2 as Grid,
  CircularProgress,  
  Typography  
} from '@mui/material';  
  
const PROJECT_TYPES = [  
  'TV Series',  
  'Academic Program',  
  'Research Project',  
  'Business Plan',  
  'Scientific Paper',  
  'Mobile App'  
];  
  
const DEFAULT_DEPTHS = {  
  'TV Series': 4,  
  'Academic Program': 5,  
  'Research Project': 3,  
  'Business Plan': 3,  
  'Scientific Paper': 4,  
  'Mobile App': 3  
};  
  
export default function CreateProjectView() {  
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  
  const [project, setProject] = useState({  
    title: '',  
    description: '',  
    type: 'TV Series',  
    depth: DEFAULT_DEPTHS['TV Series']  
  });  
  
  const validateForm = () => {  
    if (!project.title.trim()) {  
      setError('Project title is required');  
      return false;  
    }  
    if (project.depth < 1 || project.depth > 6) {  
      setError('Depth must be between 1 and 6');  
      return false;  
    }  
    setError('');  
    return true;  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    if (!validateForm()) return;  
  
    setLoading(true);  
    try {  
      const docRef = await addDoc(collection(db, 'reasoning_nodes'), {  
        question: `Create ${project.type}: ${project.title}`,  
        description: project.description,  
        type: project.type,  
        depth: project.depth,  
        status: 'processing',  
        parentId: null,  
        createdAt: new Date(),  
        children: []  
      });  
  
      navigate(`/project/${docRef.id}`);  
    } catch (err) {  
      console.error('Error creating project:', err);  
      setError('Failed to create project. Please try again.');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleTypeChange = (newType) => {  
    setProject(prev => ({  
      ...prev,  
      type: newType,  
      depth: DEFAULT_DEPTHS[newType]  
    }));  
  };

  return (
      <div>

    <Grid container justifyContent="center" sx={{ p: 4 }}>  
      <Grid item xs={12} md={8} lg={6}>  
        <Typography variant="h4" gutterBottom>  
          Start New Project  
        </Typography>  
          
        <form onSubmit={handleSubmit}>  
          <Grid container spacing={3}>  
            <Grid item xs={12}>  
              <TextField  
                label="Project Title"  
                value={project.title}  
                onChange={e => setProject(p => ({...p, title: e.target.value}))}  
                fullWidth  
                required  
                disabled={loading}  
              />  
            </Grid>  
  
            <Grid item xs={12}>  
              <TextField  
                label="Description"  
                value={project.description}  
                onChange={e => setProject(p => ({...p, description: e.target.value}))}  
                fullWidth  
                multiline  
                rows={4}  
                disabled={loading}  
              />  
            </Grid>  
  
            <Grid item xs={12} sm={6}>  
              <FormControl fullWidth disabled={loading}>  
                <InputLabel>Project Type</InputLabel>  
                <Select  
                  value={project.type}  
                  onChange={e => handleTypeChange(e.target.value)}  
                  label="Project Type"  
                >  
                  {PROJECT_TYPES.map(type => (  
                    <MenuItem key={type} value={type}>{type}</MenuItem>  
                  ))}  
                </Select>  
              </FormControl>  
            </Grid>  
  
            <Grid item xs={12} sm={6}>  
              <TextField  
                label="Reasoning Depth"  
                type="number"  
                value={project.depth}  
                onChange={e => setProject(p => ({  
                  ...p,   
                  depth: Math.min(6, Math.max(1, parseInt(e.target.value) || 1))  
                }))}  
                fullWidth  
                disabled={loading}  
                inputProps={{  
                  min: 1,  
                  max: 6  
                }}  
              />  
            </Grid>  
  
            {error && (  
              <Grid item xs={12}>  
                <FormHelperText error>{error}</FormHelperText>  
              </Grid>  
            )}  
  
            <Grid item xs={12}>  
              <Button  
                type="submit"  
                variant="contained"  
                size="large"  
                disabled={loading}  
                startIcon={loading && <CircularProgress size={20} />}  
              >  
                {loading ? 'Creating Project...' : 'Create Project'}  
              </Button>  
            </Grid>  
          </Grid>  
        </form>  
      </Grid>  
    </Grid>
      </div>
  );  
}  