import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container">
        <span className="navbar-brand">
          logo
        </span>

        <div>
          <Link
            to="/login"
            className="me-3 text-dark text-decoration-none"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="text-dark text-decoration-none"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}