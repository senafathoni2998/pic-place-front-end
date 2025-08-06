import React from "react";
import Input from "../../shared/components/FormElement/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import "./Authenticate.css";
import Button from "../../shared/components/FormElement/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";

const Authenticate = () => {
  const auth = React.useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = React.useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  /**
   * Handles authentication form submission for both login and signup modes.
   * - In login mode: sends email and password as JSON to the login endpoint.
   * - In signup mode: sends email, name, password, and image as FormData to the signup endpoint.
   * - On success: calls auth.login with the returned user data.
   * - Shows loading spinner and error modal via useHttpClient hook.
   */
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    // Prevent submission if form is invalid
    if (!formState.isValid) {
      return;
    }

    if (isLoginMode) {
      // LOGIN MODE: send credentials as JSON
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        // Log response and authenticate user
        console.log("Login response:", responseData);
        auth.login(responseData.user);
      } catch (err) {
        // Error handled by useHttpClient
      }
    } else {
      // SIGNUP MODE: send data as FormData (supports image upload)
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        console.log("Signup form inputs:", formState.inputs);

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        // Log response and authenticate user
        console.log("Signup response:", responseData.user);
        auth.login(responseData.user);
      } catch (err) {
        // Error handled by useHttpClient
      }
    }

    // Debug: log all form inputs
    console.log("Form submitted!", formState.inputs);
  };

  const swithchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="">Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              errorText="Please enter a valid name!"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload id="image" center onInput={inputHandler} />
          )}
          <Input
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
            id="email"
          />
          <Input
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
            id="password"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={swithchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
