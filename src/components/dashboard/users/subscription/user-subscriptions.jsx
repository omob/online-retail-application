import React, { Fragment, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import ConfirmDelete from "../../../../common/confirmDelete/confirm-delete";
import Header from "../../../../common/header/header";
import authService from "../../../../services/authService";
import subscriptionService from "../../../../services/subscriptionService";
import userService from "../../../../services/userService";
import {
  getDayOfTheWeekFromNumber,
  formatNumberWithComma,
} from "../../../../common/functions";
import "./user-subscriptions.scss";
import Loading from "../../../../common/loading/loading";

const UserSubscriptions = ({ match, history }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSubscriptions = async () => {
      setLoading(true);
      if (match.params && match.params.id) {
        try {
          const { data } = await subscriptionService.getUserSubscriptions(
            match.params.id
          );
          const { user, subscriptions } = data;
          setSubscriptions(subscriptions || []);
          setUser(user);
          setLoading(false);
          return;
        } catch (e) {
          // todo - add error message to be displayed
          setLoading(false);
          return;
        }
      }

      const { data: subscriptions } = await userService.getSubscriptions();
      setSubscriptions(subscriptions);
      setLoading(false);
    };
    getSubscriptions();
  }, []);

  const unsubscribe = (subscriptionId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete
            onClose={onClose}
            message="You want to unsubscribe from this product?"
            handleDelete={() => handleUnsubscribe(subscriptionId)}
          />
        );
      },
    });
  };

  const handleUnsubscribe = async (subscriptionId) => {
    const _subscriptions = [...subscriptions];
    const filteredSubscriptions = _subscriptions.filter(
      (s) => s._id !== subscriptionId
    );
    try {
      setSubscriptions(filteredSubscriptions);
      await userService.unsubscribe(subscriptionId);
      toast.info("Success!!!");
    } catch (e) {
      // revert back
      toast.error("Error unsubscribing. Please try again later: " + e.message);
      return setSubscriptions(_subscriptions);
    }
  };

  const getBillingDay = (billingDay) => {
    if (!billingDay) return "Everyday";

    if (Number(billingDay) !== 0 && !Number(billingDay))
      return new Date(billingDay).toDateString();

    return getDayOfTheWeekFromNumber(Number(billingDay)) + "s";
  };

  const unsubscribeButton = (_id) => {
    return (
      <td>
        <div className="button-group">
          <button
            className="btn btn-red btn-sm font-small"
            onClick={() => unsubscribe(_id)}
          >
            Unsubscribe
          </button>
        </div>
      </td>
    );
  };
  return (
    <Fragment>
      <div id="subscriptions">
        <Header
          title={
            (user && user.firstName + " " + user.lastName) || "My Subscriptions"
          }
        />
        <Loading isLoading={isLoading} />
        {authService.getCurrentUser()?.roles?.admin && (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <button
                  onClick={() => {
                    history.goBack();
                  }}
                  className="ml-3 mt-2 btn btn-outline-danger font-small btn-sm"
                >
                  <i className="fa fa-caret-left"></i> Go back{" "}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {subscriptions && subscriptions.length > 0 && (
                  <table className="table table-hover custom-table-responsive  col-12 col-lg-10 ">
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Plan</th>
                        <th>Billing Day</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map(
                        (
                          {
                            _id,
                            productId: product,
                            subscriptionPlan,
                            billingDay,
                          },
                          index
                        ) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <img src={product.imageUrl} alt={product.name} />
                            </td>
                            <td>{product.name}</td>
                            <td>
                              &#x20a6;{formatNumberWithComma(product.price)}
                            </td>
                            <td>{subscriptionPlan.name}</td>
                            <td>{getBillingDay(billingDay)}</td>
                            {/* {authService.getCurrentUser()?.roles?.admin ||
                              (authService.getCurrentUser()._id ===
                                match.params.id && ( */}
                            {match.params.id &&
                              authService.getCurrentUser()._id ===
                                match.params.id &&
                              unsubscribeButton(_id)}
                            {!match.params.id && unsubscribeButton(_id)}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
                {subscriptions && subscriptions.length === 0 && (
                  <p>You have not subscribed to any product.</p>
                )}
                <div className="spaces-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserSubscriptions;
