import React, { Fragment } from "react";
import PasswordField from "../password-field/password-field";
import Button from "../../../../common/forms/button";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Loading from "../../../../common/loading/loading";
import userService from "../../../../services/userService";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const schema = yup.object().shape({
    password: yup.string().min(6).required("Password is required"),
  });

  let { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });

  const onSubmit = async ({ password }) => {
    try {
      setLoading(true);
      await userService.changePassword(password);
      setLoading(false);
      setPassword("");
      toast.info("Password changed successfully");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Loading isLoading={isLoading} />
        <PasswordField
          name="password"
          label="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          register={register}
          errors={errors}
        />
        <Button label="Update" className="btn btn-danger btn-sm font-small" />
      </form>
    </Fragment>
  );
};

export default ChangePassword;
