import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./confirm-delete.css";

const ConfirmDelete = ({ onClose, handleDelete, message }) => {
  return (
    <div className="custom-ui">
      <h1>Are you sure?</h1>
      <p>{message || "You want to delete this product?"}</p>
      <button className="btn btn-sm btn-default" onClick={onClose}>
        No
      </button>
      {"  "}
      <button
        className="btn btn-sm btn-danger"
        onClick={() => {
          handleDelete();
          onClose();
        }}
      >
        Yes!
      </button>
    </div>
  );
};

export default ConfirmDelete;
