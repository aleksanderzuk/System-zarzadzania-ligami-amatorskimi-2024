import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import Leagues from './components/Leagues';
import Teams from './components/Teams';
import Players from './components/Players';
import Profile from './components/Profile';
import LeagueDetails from './components/LeagueDetails';

import Cookies from 'js-cookie';

function App() {
  const token = Cookies.get('session');
  const [isLogged, setIsLogged] = useState(token);
  const [isRegistered, setIsRegistered] = useState(true);

  function handleLogout() {
    Cookies.remove('session');
    location.reload(); // wylogowanie i odświeżenie strony
  }

  return (
    <Router>
      {!isLogged ? (
        <>
          <Header />
          {isRegistered ? (
            <LoginForm checkLogin={setIsLogged} checkReg={setIsRegistered} />
          ) : (
            <RegistrationForm checkReg={setIsRegistered} />
          )}
        </>
      ) : (
        <>
          <Navbar /> 
          
          <Routes>
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leagues/:id" element={<LeagueDetails/>} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/players" element={<Players />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <button onClick={handleLogout} className="footer btn btn-danger">Wyloguj</button>
        </>
      )}
    </Router>
  );
}

export default App;