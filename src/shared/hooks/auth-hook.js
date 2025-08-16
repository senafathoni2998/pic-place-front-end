import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tokenExpireDate, setTokenExpireDate] = useState(null);

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
  const loginHandler = useCallback((user, token, expireDate) => {
    // console.log("TOKEN", token);
    setToken(token);
    setUserData(user);
    const tokenExpireDate =
      expireDate || new Date(new Date().getTime() + 60 * 60 * 1000);
    setTokenExpireDate(tokenExpireDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user,
        token,
        tokenExpireDate: tokenExpireDate.toISOString(),
      })
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
  }, [loginHandler]);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        if (
          userData &&
          userData.user &&
          userData.token &&
          new Date(userData.tokenExpireDate) > new Date()
        ) {
          loginHandler(
            userData.user,
            userData.token,
            new Date(userData.tokenExpireDate)
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (token && tokenExpireDate) {
      const remainingTime =
        new Date(tokenExpireDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpireDate]);

  return { token, userData, loginHandler, logoutHandler };
};
