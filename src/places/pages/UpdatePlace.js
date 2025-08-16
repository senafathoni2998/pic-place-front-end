import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElement/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import "./PlaceForm.css";
import Button from "../../shared/components/FormElement/Button";
import Card from "../../shared/components/UIElements/Card";
import useHttpClient from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loadedPlace, setLoadedPlace] = useState(null);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  React.useEffect(() => {
    const getPlace = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/places/" + placeId
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: loadedPlace.title,
              isValid: true,
            },
            description: {
              value: loadedPlace.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    getPlace();
  }, [placeId, sendRequest]);

  const submitHandler = async (event) => {
    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
      "PATCH",
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      }
    );
    console.log(auth.userData.id);
    navigate("/" + auth.userData.id + "/places");
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            errorText="Please enter a valid title!"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            errorText="Please enter a valid description!"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
