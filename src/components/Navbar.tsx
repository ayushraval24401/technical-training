import "../assets/css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("username");
    ctx.setIsAuthenticated(false);
    ctx.setUsername("");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Report Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {ctx?.isAuthenticated && (
              <li className="nav-item">
                <span className="nav-link"> Welcome, {ctx?.username}</span>
              </li>
            )}
            {ctx?.isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>
            )}
            {ctx.isAuthenticated === false && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    SingUp
                  </Link>
                </li>
              </>
            )}
            {ctx?.isAuthenticated && (
              <>
                <li className="nav-item">
                  <span className="nav-link" onClick={handleLogout}>
                    Logout
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
