import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../../../common/forms/input";
import Button from "../../../common/forms/button";

import "./user-registration-form.scss";
import { useEffect } from "react";
import userService from "../../../services/userService";
import Select from "../../../common/forms/select";
import authService from "../../../services/authService";
import PasswordField from "../../dashboard/profile/password-field/password-field";

const UserRegistrationForm = ({ handleFormSubmit, isLoading }) => {
  const RegisterSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone number is required").min(10),
    email: yup.string().required("Email is required").min(10),
    password: yup.string().required("Password is required"),
    addressline1: yup.string(),
    city: yup.string(),
    state: yup.string(),
    roles: yup.string().notRequired(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: RegisterSchema,
  });

  const [roles, setUserRoles] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      const { data: roles } = await userService.getRoles();
      setUserRoles(roles);
    };

    getRoles();
  }, []);

  return (
    <form
      className="form registration-form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="row">
        <div className="col-12 col-sm-6">
          <Input
            name="firstName"
            placeholder="First Name"
            errors={errors}
            register={register}
          />
        </div>
        <div className="col-12 col-sm-6">
          <Input
            name="lastName"
            placeholder="Last Name"
            errors={errors}
            register={register}
          />
        </div>
      </div>

      <Input
        name="email"
        placeholder="Email"
        type="email"
        errors={errors}
        register={register}
      />
      <Input
        name="phoneNumber"
        placeholder="Phone Number"
        errors={errors}
        register={register}
      />

      <div className="address">
        <Input
          name="addressline1"
          placeholder="Address Line1"
          errors={errors}
          register={register}
        />
        <div className="row">
          <div className="col-12 col-sm-6">
            <Input
              name="city"
              placeholder="City"
              errors={errors}
              register={register}
            />
          </div>
          <div className="col-12 col-sm-6">
            <Input
              name="state"
              placeholder="State"
              errors={errors}
              register={register}
            />
          </div>
        </div>
      </div>
      <PasswordField
        placeholder="Password"
        name="password"
        errors={errors}
        register={register}
      />
      {/* <Input
        name="password"
        placeholder="Password"
        type="password"
        errors={errors}
        register={register}
      />
      <Input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        errors={errors}
        register={register}
      /> */}
      {authService.getCurrentUser()?.roles?.admin && (
        <Select
          name="role"
          items={[
            {
              _id: "",
              name: "Select Role",
            },
            ...roles,
          ]}
          register={register}
          errors={errors}
        />
      )}
      <div className="pt-4 ">
        <Button
          label="Sign Up"
          disabled={isLoading}
          className="btn btn-red"
        ></Button>
      </div>
    </form>
  );
};

export default UserRegistrationForm;
