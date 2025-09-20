import React from "react";
import Font from "../aesthetic/Font";

const ErrorMessage = ({message }) => {  

    return (
      <Font
        mensage={message}
        variant="semiBold"
        size={14}
        Color="red"
        style={{ marginLeft: 5, marginTop: 5 }}
      />
    );
  };

  export default ErrorMessage;