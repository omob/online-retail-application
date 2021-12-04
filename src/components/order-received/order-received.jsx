import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../../common/forms/button";
import "./modal.scss";

const OrderReceived = ({ isVisible: visibility, handleVisibility, title }) => {
  const [isVisible, setVisibility] = useState(null);

  useEffect(() => {
    setVisibility(visibility);
  }, [visibility]);

  const modalClass = isVisible ? "modal fade show" : "modal";

  const handleModalBackgroundClick = ({ target }) => {
    if (target.classList.contains("modal")) handleModalClose();
  };

  const handleModalClose = () => {
    handleVisibility();
  };
  return (
    <>
      <div
        className={modalClass}
        tabIndex="-1"
        role="dialog"
        onClick={handleModalBackgroundClick}
      >
        <div className="modal-dialog modal-dialog-top" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title font-weight-bold text-transform-uppercase">
                {title}
              </h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleModalClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body ">
              <div className="row">
                <div className="col-12">
                  <h4 className="title text-center font-weight-bold">
                    Thank you!
                  </h4>
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
                <div className="col-12 text-center">
                  <p>Your Order has been successfully received!</p>
                  <Button
                    type="button"
                    label="Close"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleModalClose}
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderReceived;
