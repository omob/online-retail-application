import React, { Fragment } from "react";

const Input = ({ register, errors, label, name, required, ...rest }) => {
  return (
    <Fragment>
      <div className="form-group">
        {label && (
          <label htmlFor={name}>
            {label}{" "}
            {required && (
              <span style={{ color: "red", fontWeight: "bold" }}>*</span>
            )}
          </label>
        )}
        <input className="form-control" name={name} ref={register} {...rest} />
        {errors[name] && (
          <div className="alert alert-danger">{errors[name].message}</div>
        )}
      </div>
    </Fragment>
  );
};

export default Input;
