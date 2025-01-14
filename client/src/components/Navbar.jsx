import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import userIcon from "../assets/UserIconWhite.png";
import logoIcon from "../assets/RoundTable.png";
import { jwtDecode } from "jwt-decode";

function Navbar({ token, setToken, isAdmin }) {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const updateTokenState = () => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);  // Update parent component's token

    if (currentToken) {
      try {
        const decodedToken = jwtDecode(currentToken);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setToken(null);  // Reset token state in parent
      }
    } else {
      
      setUserId(null);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
    navigate("/", { state: { searchQuery } });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/"); // Redirect to home page after logout
  };


  useEffect(() => {
    updateTokenState();

    window.addEventListener("storage", updateTokenState);
    return () => {
      window.removeEventListener("storage", updateTokenState);
    };
  }, []);


// *** thu token state
  //   const handleStorageChange = () => {
  //     updateTokenState();
  //   };

  //   // Listen for changes to localStorage (such as token update)
  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     // Clean up the event listener when the component is unmounted
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []); // Empty dependency array to run only once on mount

  return (
    <nav className="navbar">
      <Link to="/">
        <div id="logoContainer">
          <img id="logoIcon" src={logoIcon} alt="Website logo" />
          <span className="header" id="logoText">Recipe Round Table</span>
        </div>
      </Link>
      <div id="searchbarContainer">
        <input
          id="searchbar"
          type="text"
          placeholder="Search for recipes or users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button id="searchBtn" onClick={handleSearch}>Search</button>
      </div>
      <div className="dropdownMenu">
        <button
          className="dropdownToggle"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <div id="userIconContainer">
            <span>Menu</span>
            <img src={userIcon} alt="User icon" />
            </div>
        </button>
        {dropdownVisible && (
          <div className="dropdown">
            {token ? (
              <>
                <Link 
                  className="postrecipebutton"
                  to="/user" 
                  onClick={() => setDropdownVisible(false)}
                >
                  Profile
                </Link>
                <Link 
                  id="bookmarksBtn"
                  className="header" 
                  to ="/notifications" 
                  onClick={() => setDropdownVisible(false)}
                >
                  Notifications
                </Link>
                <button
                  className="logoutButton" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <Link 
                  className="postrecipebutton"
                  to="/new-recipe" 
                  onClick={() => setDropdownVisible(false)}
                >
                  Add New Recipe
                </Link>
                <Link 
                  id="bookmarksBtn"
                  className="header" 
                  to ="/bookmarks" 
                  onClick={() => setDropdownVisible(false)}
                >
                  Bookmarks
                </Link>
                {isAdmin && (
                  <Link 
                    className="adminDashboardButton"
                    to="/admin" 
                    onClick={() => setDropdownVisible(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  className="postrecipebutton"
                  to="/login" 
                  onClick={() => setDropdownVisible(false)}
                >
                  Login
                </Link>
                <Link 
                  className="postrecipebutton"
                  to="/register"
                  onClick={() => setDropdownVisible(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;