import React, { useState } from "react";
import "./password-field.scss";

const PasswordField = ({
  label,
  name,
  onChange,
  register,
  errors,
  ...rest
}) => {
  const [isToggled, setToggle] = useState(false);

  const toggleClass = isToggled ? "fa-eye" : "fa-eye-slash";
  return (
    <div className="form-group password-field">
      <label className="font-weight-normal font-small">{label}</label>
      <div className="input-group" id="show_hide_password">
        <input
          className="form-control"
          name={name}
          type={isToggled ? "text" : "password"}
          ref={register}
          {...rest}
          onChange={onChange}
        />

        <div className="input-group-addon">
          <button
            type="button"
            className="btn btn-default toggle-btn"
            onClick={() => setToggle(!isToggled)}
          >
            <i className={"fa " + toggleClass} aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div>
        {errors[name] && (
          <div className="alert alert-danger">{errors[name].message}</div>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
