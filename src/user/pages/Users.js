import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users");

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Failed to fetch users data");
        }

        setLoadedUsers(responseData.users || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setIsLoading(false);
    };

    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  console.log(isLoading);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
