import { useState } from "react";
import "./Register.css";

function Register({ setShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function register() {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://192.168.1.66:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);

        if (data.message === "Registration successful") {
          setShowLogin(true);
        }
      })
      .catch(() => {
        alert("Server error");
      });
  }

  return (
    <div className="register-container">
      <div className="register-box">

        <h2>📝 Create Account</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={register}>Register</button>

        <p onClick={() => setShowLogin(true)}>
          Already have account? Login
        </p>

      </div>
    </div>
  );
}

export default Register;