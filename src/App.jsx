import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import AddPaper from './pages/AddPaper';
import GraphView from './pages/GraphView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddPaper />} />
            <Route path="/graph" element={<GraphView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
