import { useState } from "react";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLoginSuccess() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
  }

  return (
    <>
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;