import { useState } from "react";
import "./Login.css";

function Login({ setUserId, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    fetch("http://192.168.1.66:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);

        if (data.message === "Login successful") {
          setUserId({
            id: data.userId,
            email: email
          });
        }
      })
      .catch(() => {
        alert("Server error");
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>🎬 Movie Booking</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p onClick={() => setShowLogin(false)}>
          Create new account
        </p>

      </div>
    </div>
  );
}

export default Login;