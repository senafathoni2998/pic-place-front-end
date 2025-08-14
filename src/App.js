import React, { useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlaces from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [token, setToken] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  /**
   * Handles user login by setting authentication token and user data.
   *
   * This function updates the authentication state by storing the provided user and token
   * in both React state and localStorage. It is memoized using useCallback to prevent
   * unnecessary re-creations.
   *
   * @function
   * @param {Object} user - The user object containing user information.
   * @param {string} token - The authentication token for the user session.
   *
   * @returns {void}
   */
  const loginHandler = useCallback((user, token) => {
    console.log("TOKEN", token);
    setToken(token);
    setUserData(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({ user: user, token: token })
    );
  }, []);

  /**
   * Handles user logout by clearing authentication token and user data.
   *
   * This function resets the authentication state by removing the user and token
   * from both React state and localStorage. It is memoized using useCallback to prevent
   * unnecessary re-creations.
   *
   * @function
   * @returns {void}
   */
  const logoutHandler = useCallback(() => {
    setToken(null); // Clear authentication token from state
    setUserData(null); // Clear user data from state
    localStorage.removeItem("userData"); // Remove user data from localStorage
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        if (userData && userData.user && userData.token) {
          setUserData(userData.user);
          setToken(userData.token);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  console.log("TOKEN", token);
  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlaces />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userData: userData,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
