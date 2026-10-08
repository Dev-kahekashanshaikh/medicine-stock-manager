import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaHome,
  FaPills,
  FaBoxes,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/pills-svgrepo-com.svg";

import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/stock");
      setMenuOpen(false);
      return;
    }

    navigate(
      `/stock?search=${encodeURIComponent(value)}`
    );

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* Logo */}

          <NavLink
            to="/dashboard"
            className="navbar-logo"
            onClick={closeMenu}
          >
            <div className="logo-icon">
                <img src={logo} alt="MedStock Logo" />
            </div>

            <div className="logo-text">
              <h2>MedStock</h2>
              <span>Medicine Manager</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}

          <nav className="desktop-nav">

            <NavLink to="/dashboard">
              <FaHome />
              Dashboard
            </NavLink>

            <NavLink to="/medicine">
              <FaPills />
              Add Medicine
            </NavLink>

            <NavLink to="/stock">
              <FaBoxes />
              Stock List
            </NavLink>

          </nav>

          {/* Desktop Search */}

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >
            <FaSearch className="search-left-icon" />

            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Hamburger */}

          <button
            className="menu-button"
            type="button"
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>
      </header>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="mobile-menu">

          <NavLink
            to="/dashboard"
            onClick={closeMenu}
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/medicine"
            onClick={closeMenu}
          >
            <FaPills />
            Add / Update Medicine
          </NavLink>

          <NavLink
            to="/stock"
            onClick={closeMenu}
          >
            <FaBoxes />
            Available Stock
          </NavLink>

          <form
            className="mobile-search"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button type="submit">
              <FaSearch />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

export default Navbar;