import React, { Fragment, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./subscriptions.scss";
import ConfirmDelete from "../../../common/confirmDelete/confirm-delete";
import Header from "../../../common/header/header";
import userService from "../../../services/userService";
import subscriptionService from "../../../services/subscriptionService";
import Loading from "../../../common/loading/loading";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getSubscriptions = async () => {
      setLoading(true);
      const {
        data: subscriptions,
      } = await subscriptionService.getSubscriptions();

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

  return (
    <Fragment>
      <div id="subscriptions">
        <Header title="Users Subscriptions" />
        <div className="p-4">
          <div className="container">
            <div className="row">
              <Loading isLoading={isLoading} />
              <div className="col-12">
                {subscriptions.length > 0 && (
                  <table className="table table-hover custom-table-responsive  col-12 col-lg-10 ">
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>Users</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions &&
                        subscriptions.map(
                          ({ userId: user, subscriptions }, index) =>
                            user && (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  {user?.name?.firstName} {user?.name?.lastName}
                                </td>
                                <td>{subscriptions.length}</td>

                                <td>
                                  <div className="button-group">
                                    <Link
                                      to={
                                        "/dashboard/users/profile/" + user._id
                                      }
                                      className="btn btn-sm btn-outline-danger font-small"
                                    >
                                      Profile
                                    </Link>{" "}
                                    <Link
                                      className="btn btn-danger btn-sm font-small"
                                      to={
                                        "/dashboard/subscriptions/" + user._id
                                      }
                                    >
                                      Subscriptions
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            )
                        )}
                    </tbody>
                  </table>
                )}
                {subscriptions.length === 0 && (
                  <p>No user has subscribed to a product yet</p>
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

export default Subscriptions;
