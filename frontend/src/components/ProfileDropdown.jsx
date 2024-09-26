import { Dropdown, Button } from "react-bootstrap";
import React from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function ProfileDropdown() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { clearAuth } = useContext(AuthContext);

  const logout = async() => {
    try {
      await fetch("http://localhost:5005/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });
      clearAuth(); // Clear local auth state
      window.location.href = "/login"; // Redirect to login page or home
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.clear("auth");
    setAuth({});
    navigate("/");
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="none" id="dropdown-basic">
        <BsFillPersonFill />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          {auth.role === "buyer" ? (
            <Link to="/customer/profile">Profile</Link>
          ) : (
            <Link to="/seller/products">Profile</Link>
          )}
        </Dropdown.Item>
    
        <Dropdown.Item>
          {auth.role === "seller" ? (
            <Link to="/seller/dashboard">Profile</Link>
          ) : (
            <Link to="/seller/products">Profile</Link>
          )}
        </Dropdown.Item>



        <Dropdown.Item>
          <Button onClick={() => logout()}>SignOut</Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;
