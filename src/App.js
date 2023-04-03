import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Login from './pages/Login-Register'
import Layout from './components/Layout'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

function App() {

  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if(!currentUser){
      return <Navigate to='/login' />
    }

    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
