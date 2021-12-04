import React, { Fragment } from "react";

const Button = ({ label, className, disabled, ...rest }) => {
  const btnClass = className ? className : "btn btn-default";
  return (
    <Fragment>
      <button disabled={disabled} className={btnClass} {...rest}>
        {label}
      </button>
    </Fragment>
  );
};

export default Button;
