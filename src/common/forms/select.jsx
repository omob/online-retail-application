import React from "react";

const Select = ({ name, label, items, value, errors, register, ...rest }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className="form-control"
        id={name}
        name={name}
        {...rest}
        value={value}
        ref={register}
      >
        {items.map((item, index) => (
          <option className="form-control-item" key={index} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="alert alert-danger">{errors[name].message}</div>
      )}
    </div>
  );
};

export default Select;
