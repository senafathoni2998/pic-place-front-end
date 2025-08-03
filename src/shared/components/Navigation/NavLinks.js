import React from "react";
import { AuthContext } from "../../context/auth-context";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = React.useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">All Users</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userData.id}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Place</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
