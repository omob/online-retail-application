import React, { Fragment, useEffect, useState } from "react";

import userService from "../../services/userService";
import "./register.scss";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import { Redirect } from "react-router";
import Loading from "../../common/loading/loading";
import Error from "../../common/error";
import UserRegistrationForm from "./user-registration-form/user-registration-form";

const RegisterForm = ({ location, history }) => {
  const [registerError, setRegisterError] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state)
      toast.error(
        "You must either login or signup to subscribe / purchase a product"
      );
  }, [location.state]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // const { confirmPassword, ...user } = data;

      await userService.registerUser(data);
      const { state } = location;
      setLoading(false);

      window.location = location.state?.product
        ? `/?returnUrl=true&subscribe=${state?.product?._id}`
        : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setRegisterError(ex.response.data);
      }
      setLoading(false);
    }
  };

  if (authService.getCurrentUser()) return <Redirect to="/" />;
  return (
    <Fragment>
      <div className="registerDiv">
        <Loading isLoading={isLoading} />

        <div className="container ">
          <div className="row ">
            <div className="col-12">
              <h2 className="  pt-5 font-weight-bold text-uppercase">
                Sign Up
              </h2>
            </div>

            <div className="col">
              {registerError && <Error message={registerError} />}
              <UserRegistrationForm
                handleFormSubmit={onSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterForm;
