import React, { Fragment } from "react";
import { formatNumberWithComma } from "../../common/functions";
import PayNow from "./payNow";
import "./product.scss";
import authService from "../../services/authService";
import { toast } from "react-toastify";

const Product = ({ product, onSubscribe, onNotLoggedIn, onPaymentSuccess }) => {
  const { id, imageUrl, name, price, description } = product;

  return (
    <Fragment>
      <div className="product py-4" key={id}>
        <div className="card">
          <img src={imageUrl} className="img-fluid" alt="..." />
          <div className="card-body">
            <div className="button-group">
              <button
                className="btn btn-danger"
                onClick={() => onSubscribe(product)}
              >
                Subscribe
              </button>
              {authService.getCurrentUser() == undefined ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={onNotLoggedIn}
                >
                  Pay Now
                </button>
              ) : (
                <PayNow
                  className={"btn btn-outline-danger"}
                  onPaymentSuccess={onPaymentSuccess}
                  amount={price}
                />
              )}
            </div>
            <div className="card-text">
              <p>
                <span className="title">Product Name</span>: {name}
              </p>
              <p>
                {" "}
                <span className="title">Price</span>: &#x20a6;
                {formatNumberWithComma(price)}
              </p>
              <p>
                <span className="title">Description</span>: {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Product;
