import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../../../../common/forms/button";
import Input from "../../../../common/forms/input";
import Header from "../../../../common/header/header";
import Loading from "../../../../common/loading/loading";
import userService from "../../../../services/userService";
import "./edit-profile.scss";
import ProfileHeader from "../profile-header";

const EditProfile = ({ history }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: profile } = await userService.getProfile();
        setProfile(profile);

        setValue([
          { firstName: profile.name.firstName },
          { lastName: profile.name.lastName },
          { email: profile.email },
          { phoneNumber: profile.phoneNumber },
          { addressline1: profile.address.line1 },
          { city: profile.address.city },
          { state: profile.address.state },
        ]);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // validation schema
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone number is required").min(10),
    email: yup.string().required("Email is required"),
    addressline1: yup.string(),
    city: yup.string(),
    state: yup.string(),
  });

  let { register, handleSubmit, setValue, errors } = useForm({
    validationSchema: schema,
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      await userService.updateProfile(data);
      history.replace({
        pathname: "/dashboard/user/profile",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div id="profile">
        <ProfileHeader title="My Profile" />

        <div className="container position-relative">
          <Loading isLoading={isLoading} />
          {profile && (
            <div className="row">
              <div className="col-12 col-md-6">
                <h6 className="pt-4 font-weight-bold">BASIC INFO</h6>
                <div className="container pt-2">
                  <div className="row">
                    <div className="col">
                      <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        {/* {loginError && <Error message={loginError} />} */}
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
                          disabled={true}
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
                        <div className="pt-4 ">
                          <Button
                            label="Update"
                            disabled={isLoading}
                            className="btn btn-red"
                          ></Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default EditProfile;
