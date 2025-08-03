import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hooks";
import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userID = useParams().userId;

  const [userPlace, setUserPlace] = useState([]);

  useEffect(() => {
    const getUserPlace = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/user/" + userID
        );
        setUserPlace(responseData.places);
      } catch (err) {}
    };
    getUserPlace();
  }, [sendRequest, userID]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />
      <PlaceList places={userPlace} />
    </React.Fragment>
  );
};

export default UserPlaces;
