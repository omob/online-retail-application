import React from "react";
// import "./textarea.css";

const TextArea = ({ register, errors, name, showCounter = false, ...rest }) => {
  // const spanClass = value?.length > maxLength ? "red" : "";

  // const getValue = () => {
  //   return (
  //     (value?.length > maxLength ? "-" + value?.length : value?.length) || 0
  //   );
  // };

  return (
    <div className="form-group">
      <textarea
        className="form-control"
        rows="3"
        name={name}
        ref={register}
        {...rest}
      ></textarea>
      {showCounter && (
        <span className="float-right text-muted textCount">
          {/* <span className={spanClass}>{getValue()}</span>/ {maxLength} */}
        </span>
      )}
      {errors[name] && (
        <div className="alert alert-danger">{errors[name].message}</div>
      )}
    </div>
  );
};

export default TextArea;
