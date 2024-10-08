import { useContext } from 'react';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
function App() {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser)
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <ProtectedRoute>
                <Home />
              </ProtectedRoute>} />
      <Route path='register' element={<Register/>} />
      <Route path='login' element={<Login/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
