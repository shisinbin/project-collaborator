import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// styles
import './App.css';

// pages and components
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Project from './pages/project/Project';
import Create from './pages/create/Create';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className='App'>
      {authIsReady && (
        <>
          {user && <Sidebar />}

          <div className='container'>
            <Navbar />

            <Routes>
              <Route
                path='/'
                element={user ? <Dashboard /> : <Navigate to='login' />}
              />
              <Route
                path='login'
                element={!user ? <Login /> : <Navigate to='/' />}
              />
              <Route
                path='signup'
                element={!user ? <Signup /> : <Navigate to='/' />}
              />
              <Route
                path='create'
                element={user ? <Create /> : <Navigate to='/login' />}
              />
              <Route
                path='projects/:id'
                element={user ? <Project /> : <Navigate to='/login' />}
              />
            </Routes>
          </div>

          {user && <OnlineUsers />}
        </>
      )}
    </div>
  );
}

export default App;

/* pages

 - dashboard (homepage)
 - login
 - signup
 - create
 - project (project details)

*/
