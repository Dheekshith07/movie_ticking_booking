import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  if (user) {
    return <Home user={user} setUser={setUser} />;
  }

  return showLogin ? (
    <Login setUserId={setUser} setShowLogin={setShowLogin} />
  ) : (
    <Register setShowLogin={setShowLogin} />
  );
}

export default App;