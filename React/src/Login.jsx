import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "./resourses/logo.png";
import "./utils/login.css";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:7777/auth/login", {
        email,
        password,
      });

      if (response && response.data && response.data.token) {
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(response.data));

        switch (response.data.user_type) {
          case 'admin':
            toast.success('Logged in as admin');
            history.push("/admin/home");
            break;
          case 'vendor':
            toast.success('Logged in as vendor');
            history.push("/vendor/home");
            break;
          case 'client':
            toast.success('Logged in as client');
            history.push("/client/home");
            break;
          default:
            toast.success('Logged in');
            history.push("/home");
            break;
        }
      } else {
        console.error("Unexpected response structure:", response);
        setError("Unexpected response structure");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </div>
    </div>
  );
}

export default Login;
