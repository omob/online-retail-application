import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Header from "../../../common/header/header";
const ProductHeader = ({ location }) => {
  return (
    <Fragment>
      <Header title="Products" />
      <div className="nav navbar pl-4 ">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {location && (
                <div>
                  <Link
                    to="/dashboard/products/"
                    className="btn btn-danger btn-sm font-small"
                  >
                    <i className="fa fa-caret-left"></i> Products
                  </Link>
                  <Link
                    to="/dashboard/products/new"
                    className="btn btn-default  btn-sm font-small font-weight-bold"
                  >
                    {location}
                  </Link>
                </div>
              )}
              {!location && (
                <Link
                  to="/dashboard/products/new"
                  className="btn btn-danger float-right btn-sm font-weight-normal"
                >
                  <i className="fa fa-plus"></i> Add New
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductHeader;
