import React, { Fragment, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { toast } from "react-toastify";
import * as yup from "yup";
import ConfirmDelete from "../../../common/confirmDelete/confirm-delete";
import Header from "../../../common/header/header";
import Loading from "../../../common/loading/loading";
import authService from "../../../services/authService";
import userService from "../../../services/userService";
import CreditCardForm from "../../../shared/credit-card-form/credit-card-form";
import ChangePassword from "./change-password/change-password";
import "./profile.scss";

const UserProfile = ({ history, match }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(null);
  const [showCardCreditForm, setShowCardCreditForm] = useState(false);
  const [user, setUser] = useState(null);
  const [canLogin, setCanLogin] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        if (match.params && match.params.id) {
          const { data } = await userService.getUserProfile(match.params.id);
          setUser({
            fullname: data?.name?.firstName + " " + data?.name?.lastName,
            _id: data._id,
          });

          setProfile(data);
          setCanLogin(data.canLogin);
          setLoading(false);
          return;
        }
        const { data: profile } = await userService.getProfile();
        setProfile(profile);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getProfile();
  }, [canLogin]);

  // validation schema
  const schema = yup.object().shape({
    expirationMonth: yup.string().required().label("Expiration Month"),
    expirationYear: yup.string().required().label("Expiration Year"),
    cvc: yup.string().required().label("Security Code"),
    cardNo: yup.string().required().label("Card Number"),
  });

  let { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userService.addCreditCardDetails(data);
      toast.info("Success adding Card");
      setLoading(false);
      setCardSuccess(true);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCardResponse = (response) => {
    if (!response) setCardSuccess(false);

    setCardSuccess(true);
    toast.info("Success adding Card");
  };

  const creditCardForm = () => {
    return (
      <CreditCardForm
        buttonText="Add with Paystack"
        onResponse={handleCardResponse}
      />
      // <form onSubmit={handleSubmit(onSubmit)}>
      //   <Button
      //     label="Submit"
      //     className="btn btn-sm btn-danger pull-right mr-3 mt-3"
      //   />
      // </form>
    );
  };

  const revokeUserAccess = (email) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete
            onClose={onClose}
            message={
              profile.canLogin
                ? `You want to revoke ${profile.name.firstName}' Access?. ${profile.name.firstName} will not be able to login`
                : `You are about to enable login`
            }
            handleDelete={() => handleUserAccessRevoke(email)}
          />
        );
      },
    });
  };

  const handleUserAccessRevoke = async (email) => {
    const initialStateOfCanLogin = canLogin;

    try {
      await userService.revokeUserAccess({
        email,
        canLogin: !initialStateOfCanLogin,
      });

      setCanLogin(!initialStateOfCanLogin);
    } catch (error) {
      setCanLogin(initialStateOfCanLogin);
    }
  };

  return (
    <Fragment>
      <div id="profile">
        <Header title={(user && user.fullname) || "My Profile"} />
        {user && (
          <div className="container">
            <div className="row">
              <div className="col-12 p-0">
                <button
                  onClick={() => {
                    history.goBack();
                  }}
                  className="btn btn-outline-danger font-small btn-sm"
                >
                  <i className="fa fa-caret-left"></i> Go back{" "}
                </button>
              </div>
            </div>
          </div>
        )}
        <Loading isLoading={isLoading} />
        <div className="container position-relative">
          {profile && (
            <div className="row">
              <div className="col-12 col-md-6">
                <h6 className="pt-4 font-weight-bold">BASIC INFO</h6>
                <div className="container pt-2">
                  <div className="row">
                    <div className="col-12 ">
                      {user && user._id !== authService.getCurrentUser()?._id && (
                        <label className="position-absolute font-weight-bold revoke-access font-small">
                          Enable Login
                          <Switch
                            onChange={() => revokeUserAccess(profile.email)}
                            checked={canLogin || profile.canLogin}
                          />
                        </label>
                      )}
                      {!user && (
                        <Link
                          className="btn btn-default btn-sm btn-red font-small position-absolute"
                          to="/dashboard/user/profile/edit"
                        >
                          {"Edit Profile "}
                          <i className="fa fa-edit font-weight-bolder"></i>
                          &nbsp;
                        </Link>
                      )}
                      <div className="row bg-gray px-4 pt-5">
                        <div className="col">
                          <h6 className="font-weight-bold ">
                            {profile.name.firstName} {profile.name.lastName}
                          </h6>
                          <p className="font-small mb-1">
                            <span className="font-weight-bold">Email: </span>{" "}
                            <span>{profile.email}</span>
                          </p>
                          <p className="font-small mt-1">
                            <span className="font-weight-bold">Phone: </span>{" "}
                            <span>{profile.phoneNumber} </span>
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3 bg-gray p-4">
                        <div className="col">
                          <h6 className="font-weight-bold ">Address</h6>
                          <p className="font-small mb-1">
                            <span className="font-weight-bold">Street: </span>{" "}
                            <span>{profile.address.line1} </span>
                          </p>
                          <p className="font-small mb-1">
                            <span className="font-weight-bold">City: </span>{" "}
                            <span>{profile.address.city} </span>
                          </p>
                          <p className="font-small mt-1">
                            <span className="font-weight-bold">State: </span>{" "}
                            <span>{profile.address.state} </span>
                          </p>
                        </div>
                      </div>
                      {!user && (
                        <div className="row mt-3 bg-gray p-4">
                          <div className="col">
                            <h6 className="font-weight-bold pb-2">
                              Change Password
                            </h6>
                            <ChangePassword />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col"></div>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="col-12 col-md-6">
                  <h6 className=" font-weight-bold mt-4">ACCOUNT DETAILS</h6>
                  <div className="container pt-2">
                    <div className="row">
                      <div className="col-12">
                        <button
                          className="btn btn-default btn-sm btn-red position-absolute font-small"
                          onClick={() =>
                            setShowCardCreditForm(!showCardCreditForm)
                          }
                        >
                          {"Edit Card "}
                          <i className="fa fa-edit font-weight-bolder"></i>
                          &nbsp;
                        </button>
                        <div className="row bg-gray p-4 ">
                          {profile.creditCard?.cardNo && !cardSuccess && (
                            <div className="col">
                              <h6 className="font-weight-bold ">
                                Card Details
                              </h6>

                              <p className="font-small mt-3">
                                <span className="font-weight-normal spacing-2 credit-card">
                                  <i
                                    className={`fa fa-cc-${profile.creditCard?.brand}`}
                                  />{" "}
                                  {profile.creditCard?.cardNo}
                                </span>{" "}
                              </p>

                              {showCardCreditForm && creditCardForm()}
                            </div>
                          )}
                          {!cardSuccess && !profile?.creditCard?.cardNo && (
                            <div className="col">
                              <p className="font-small font-weight-bold alert-danger p-2">
                                No Card available, please fill in your Card
                                details to proceed with subscriptions
                              </p>
                              {creditCardForm()}
                            </div>
                          )}
                          {cardSuccess && (
                            <p className="font-small font-weight-bold">
                              Card Details Added.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UserProfile;
