// src/components/Navbar.js

import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import logo from '../assets/logo.png';


const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const logoLink = isLoggedIn ? '/dashboard' : '/';

    return (
    <nav className="navbar">
      <Link className="navbar-brand custom-logo-padding" to={logoLink}>
        <img src={logo} alt="Discussable Logo" style={{ height: "40px" }} />
      </Link>
        <div className="dropdown custom-bars-padding">
            <button className="navbar-toggler btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                    aria-expanded="false">
                <FontAwesomeIcon icon="bars"/>
            </button>
            <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="dropdownMenuButton">
                {isLoggedIn ? (
                    <>
                        <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/discussions">Discussions</Link></li>
                        <li><Link className="dropdown-item" to="/create-discussion">Create New Discussion</Link></li>
                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                        <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                        <li><Link className="dropdown-item" to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </div>
    </nav>
  );
};

export default Navbar;






