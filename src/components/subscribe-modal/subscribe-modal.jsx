import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Error from "../../common/error";
import Button from "../../common/forms/button";
import Input from "../../common/forms/input";
import Select from "../../common/forms/select";
import Loading from "../../common/loading/loading";
import authService from "../../services/authService";
import subscriptionService from "../../services/subscriptionService";
import userService from "../../services/userService";
import CreditCardForm from "../../shared/credit-card-form/credit-card-form";
import "./subscribe-modal.scss";

const SubscriptionModal = ({
  isVisible: visibility,
  handleVisibility,
  data: product,
}) => {
  const [isVisible, setVisibility] = useState(null);
  const [subscription_plans, setSubscriptionPlans] = useState(null);

  const [isCreditCardSet, setCreditCardSet] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState();
  const [switchChecked, setSwitch] = useState(false);
  const [showBillingDate, setShowBillingDate] = useState(false);
  const [showBillingDay, setShowBillingDay] = useState(false);

  useEffect(() => {
    if (authService.getCurrentUser() === null) window.location = "/";

    setVisibility(visibility);

    const getSubscriptionPlans = async () => {
      setLoading(true);
      const { data } = await subscriptionService.getSubscriptionPlans();
      setSubscriptionPlans(data);
      setLoading(false);
    };
    getSubscriptionPlans();

    const getCreditCardStatus = async () => {
      const { data: isSet } = await userService.getCreditCardStatus();
      setCreditCardSet(isSet);
      setValue("showCreditCardForm", isSet ? "off" : "on");
    };

    getCreditCardStatus();

    // if (authService.getToken()) getCreditCardStatus();
    console.log("Subscription Plan: ", getValues("subscriptionPlan"));
  }, []);

  // validation schema
  const schema = yup.object().shape({
    subscriptionPlan: yup.string().required("Subscription Plan is required"),
    showCreditCardForm: yup.string(),
    expirationMonth: yup.string().when("showCreditCardForm", {
      is: "on",
      then: yup.string().required().label("Expiration Month"),
    }),
    expirationYear: yup.string().when("showCreditCardForm", {
      is: "on",
      then: yup.string().required().label("Expiration Year"),
    }),
    cvc: yup.string().when("showCreditCardForm", {
      is: "on",
      then: yup.string().required().label("Security Code"),
    }),
    cardNo: yup.string().when("showCreditCardForm", {
      is: "on",
      then: yup.string().required().label("Card Number"),
    }),
    billingDay: yup.mixed().when("subscriptionPlan", {
      is: (value) =>
        value !== getDailySubscriptionPlanId() &&
        value !== getHourlySubscriptionPlanId(),
      then: yup.string().required().label("Billing Day"),
    }),
  });

  const form = useForm({ validationSchema: schema });
  let { register, handleSubmit, reset, errors, setValue, getValues } = form;

  const modalClass = isVisible ? "modal fade show" : "modal";

  const onSubmit = async (data) => {
    setLoading(true);

    const { showCreditCardForm, ...rest } = data;

    try {
      await userService.subscribeToProduct({ productId: product._id, ...rest });
      setLoading(false);
      handleModalClose();
      toast.error("Success subscribing to " + product.name);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setSubscribeError(ex.response.data);
      }
      if (ex.response && ex.response.status === 403) {
        setSubscribeError(ex.response.data);
      }
      setLoading(false);
    }
  };

  const handleModalBackgroundClick = ({ target }) => {
    if (target.classList.contains("modal")) handleModalClose();
  };

  const handleModalClose = () => {
    reset();
    handleVisibility();
  };

  const getHourlySubscriptionPlanId = () => {
    const plan = subscription_plans.find(
      (plan) => plan.name.toLowerCase() === "hourly"
    )?._id;
    return plan;
  };

  const getDailySubscriptionPlanId = () => {
    const plan = subscription_plans.find(
      (plan) => plan.name.toLowerCase() === "daily"
    )?._id;
    return plan;
  };

  const getWeeklySubscriptionPlanId = () => {
    const plan = subscription_plans.find(
      (plan) => plan.name.toLowerCase() === "weekly"
    )?._id;
    return plan;
  };
  const getMonthlySubscriptionPlanId = () => {
    const plan = subscription_plans.find(
      (plan) => plan.name.toLowerCase() === "monthly"
    )?._id;
    return plan;
  };
  const getBillingDays = () => {
    return [
      { _id: 0, name: "Sunday" },
      { _id: 1, name: "Monday" },
      { _id: 2, name: "Tuesday" },
      { _id: 3, name: "Wednesday" },
      { _id: 4, name: "Thursday" },
      { _id: 5, name: "Friday" },
      { _id: 6, name: "Saturday" },
    ];
  };

  const handleSubscriptionPlanChange = ({ currentTarget }) => {
    if (getWeeklySubscriptionPlanId() == currentTarget.value) {
      setShowBillingDate(false);
      setShowBillingDay(true);
      return;
    }
    if (getMonthlySubscriptionPlanId() == currentTarget.value) {
      setShowBillingDate(true);
      setShowBillingDay(false);
      return;
    }

    setShowBillingDay(false);
    setShowBillingDate(false);
  };

  const handleCardResponse = (response) => {
    if (!response) setCreditCardSet(false);

    setCreditCardSet(true);
    toast.info("Success adding Card");
  };

  return (
    <Fragment>
      <div
        className={modalClass}
        tabIndex="-1"
        role="dialog"
        onClick={handleModalBackgroundClick}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <Loading isLoading={isLoading} />
            <div className="modal-header">
              <h5 className="modal-title font-weight-bold text-transform-uppercase">
                CONFIRM SUBSCRIPTION
              </h5>
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
            {!isCreditCardSet && (
              <div className="font-small font-weight-bold alert-danger p-3">
                <p>
                  No credit card available. Please add your Credit Card Details
                  to proceed with subscriptions
                </p>
                <CreditCardForm
                  buttonText="Add with Paystack"
                  onResponse={handleCardResponse}
                />
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              {subscribeError && <Error message={subscribeError} />}
              <div className="modal-body ">
                <div className="row">
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col title">
                        <b>PRODUCT NAME</b>
                      </div>
                      <div className="col">{product?.name}</div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="row">
                      <div className="col title">
                        <b>SUBSCRIPTION PLAN</b>
                      </div>
                      <div className="col">
                        {subscription_plans && (
                          <Select
                            name="subscriptionPlan"
                            items={[
                              {
                                _id: "",
                                name: "Choose Preferred Subscription",
                              },
                              ...subscription_plans,
                            ]}
                            register={register}
                            errors={errors}
                            onChange={handleSubscriptionPlanChange}
                          />
                        )}
                      </div>
                    </div>
                    {(showBillingDate || showBillingDay) && (
                      <div className="row my-2">
                        <div className="col">
                          <b>BILLING DAYS</b>
                        </div>
                        <div className="col">
                          {showBillingDay && (
                            <Select
                              name="billingDay"
                              items={[
                                {
                                  _id: "",
                                  name: "Choose Day",
                                },
                                ...getBillingDays(),
                              ]}
                              register={register}
                              errors={errors}
                            />
                          )}
                          {showBillingDate && (
                            <Input
                              name="billingDay"
                              type="date"
                              register={register}
                              errors={errors}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-12 mt-3"></div>
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  label="Subscribe"
                  className="btn btn-danger btn-sm"
                  disabled={!isCreditCardSet}
                ></Button>
                <Button
                  type="button"
                  label="Close"
                  className="btn btn-sm"
                  onClick={handleModalClose}
                ></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SubscriptionModal;
