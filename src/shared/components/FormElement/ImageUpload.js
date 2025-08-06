import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) return;

    const fileReviewUrl = new FileReader();
    fileReviewUrl.onload = () => {
      setPreviewUrl(fileReviewUrl.result);
    };
    fileReviewUrl.readAsDataURL(file);
  }, [file]);

  /**
   * Handles the file input change event for image upload.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered when a user selects a file.
   *
   * This function:
   * - Initializes a variable to store the picked file.
   * - Initializes a variable to track file validity, using the current validity state.
   * - Checks if exactly one file is selected by the user.
   *   - If true, assigns the selected file to `pickedFile` and updates the file state.
   *   - Sets the file validity to true.
   * - Updates the validity state.
   * - Calls the parent component's `onInput` handler with the input id, picked file, and validity status.
   */
  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      fileIsValid = true;
    }
    setIsValid(fileIsValid);
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.error}</p>}
    </div>
  );
};

export default ImageUpload;
