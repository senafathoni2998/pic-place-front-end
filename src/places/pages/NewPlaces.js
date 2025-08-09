import React from "react";

import Input from "../../shared/components/FormElement/Input";
import "./PlaceForm.css";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import Button from "../../shared/components/FormElement/Button";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";
import { useNavigate } from "react-router-dom";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      console.log("Form is not valid!");
      return;
    }
    console.log("Form submitted!", formState.inputs);
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("creator", auth.userData.id);
    formData.append("image", formState.inputs.image.value);

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        formData
      );
      navigate("/");
    } catch (err) {}

    // Here you would typically send the form data to the server
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter a valid title!"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          errorText="Please enter a valid description!"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          errorText="Please enter a valid address!"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          center
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
