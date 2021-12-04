import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../../common/forms/input";
import Button from "../../common/forms/button";
import Loading from "../../common/loading/loading";

import authService from "../../services/authService";
import Error from "../../common/error";
import "./login.scss";
import { Redirect } from "react-router";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = ({ location }) => {
  const [loginError, setLoginError] = useState();
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: loginSchema,
  });

  const onSubmit = async ({ username, password }) => {
    setLoading(true);
    try {
      await authService.login(username, password);

      const { state } = location;
      window.location = state ? state.from.pathname : "/";
      setLoading(false);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setLoginError(ex.response.data);
      } else if (ex.response && ex.response.status === 403) {
        setLoginError(ex.response.data);
      }
      setLoading(false);
    }
  };

  if (authService.getCurrentUser()) return <Redirect to="/" />;
  return (
    <Fragment>
      <div className="loginDiv">
        <div className="container">
          <div className="row mt-5">
            <Loading isLoading={isLoading} />
            <div className="col-12">
              <h2 className="pt-5 font-weight-bold text-uppercase">Login</h2>
            </div>

            <div className="col">
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                {loginError && <Error message={loginError} />}
                <div className="mt-5"></div>
                <Input
                  name="username"
                  errors={errors}
                  register={register}
                  placeholder="Username"
                />
                <div className="mt-4"></div>
                <Input
                  name="password"
                  type="password"
                  errors={errors}
                  register={register}
                  placeholder="Password"
                />

                <div className="pt-4">
                  <Button
                    label="Login"
                    disabled={isLoading}
                    className="btn btn-red"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="spaces-5"></div>
      </div>
    </Fragment>
  );
};

export default LoginForm;
