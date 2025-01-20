import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './AuthContext';
import Login from './views/LoginView';
import CreateProjectView from './views/CreateProjectView';
import ProjectListView from './views/ProjectListView';
import ProjectDetailView from './views/ProjectDetailView';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
      <Router>
        <AuthProvider>
          <NavBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<ProjectListView />} />
                    <Route path="/create" element={<CreateProjectView />} />
                    <Route path="/project/:projectId" element={<ProjectDetailView />} />
                </Route>
            </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;