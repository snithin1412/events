import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Page from './Page';
import { Home } from './Home/Home';
import { Login } from './common/Login';
import { Provider } from 'react-redux';
import {store} from '../store/store'
import { Booking } from './Home/Booking';

function App() {
  console.log("Main App");
  const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if(user !== null && user !== undefined){
        return children; 
    } else {
      return <Navigate to="/login" />;
    }
  };
  const UnProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if(user === null || user === undefined){
        return children; 
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <div className="App">
      <Provider store={store}>
      <Page>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
          <Route path="/booking/:id" element={<PrivateRoute><Booking/></PrivateRoute>} />
          <Route path="/login" element={<UnProtectedRoute><Login/></UnProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </Page>
      </Provider>
    </div>
  );
}

export default App;
