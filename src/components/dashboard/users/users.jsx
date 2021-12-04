import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../common/header/header";
import Loading from "../../../common/loading/loading";

import userService from "../../../services/userService";
import SubHeader from "./subheader";
import "./users.scss";
import { confirmAlert } from "react-confirm-alert";
import ConfirmDelete from "../../../common/confirmDelete/confirm-delete";
import { toast } from "react-toastify";
import authService from "../../../services/authService";

const Users = ({ match }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const { data } = await userService.getAllUsers();
      setUsers(data);
      setLoading(false);
    };

    getUsers();
  }, []);

  const confirmDelete = (userId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete
            onClose={onClose}
            message="Are you sure you want to delete this user?"
            handleDelete={() => handleDeletingUser(userId)}
          />
        );
      },
    });
  };

  const handleDeletingUser = async (userId) => {
    const _users = [...users];
    const filteredUsers = _users.filter((p) => p._id !== userId);

    try {
      setUsers(filteredUsers);
      await userService.deleteUser(userId);

      toast.info("Success Deleting User");
    } catch (e) {
      // revert back
      toast.error("Error deleting: " + e.message);
      return setUsers(_users);
    }
  };

  const loggedInUserId = authService.getCurrentUser()?._id;

  return (
    <Fragment>
      <div id="subscriptions">
        <Header title={"All Users"} />
        <SubHeader
          links={[
            {
              name: "Add User",
              url: "/dashboard/users/new",
              className: "btn-danger",
              icon: "fa-plus",
            },
          ]}
        />
        <div className="p-4">
          <div className="container">
            <Loading isLoading={isLoading} />
            <div className="row">
              <div className="col-12">
                {users.length > 0 && (
                  <table className="table table-hover custom-table-responsive  col-12 col-lg-10 ">
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(({ _id }) => _id !== loggedInUserId)
                        .map(({ _id, name }, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{name.firstName}</td>
                            <td>{name.lastName}</td>
                            <td>
                              <div className="button-group">
                                <Link
                                  to={"/dashboard/users/profile/" + _id}
                                  className="btn btn-sm btn-outline-danger font-small"
                                >
                                  Profile
                                </Link>{" "}
                                <Link
                                  className="btn btn-outline-danger btn-sm font-small"
                                  to={"/dashboard/subscriptions/" + _id}
                                >
                                  Subscriptions
                                </Link>{" "}
                                {authService.getCurrentUser()?._id !== _id && (
                                  <button
                                    className="btn btn-danger btn-sm font-small"
                                    onClick={() => confirmDelete(_id)}
                                  >
                                    <i className="fa fa-trash" /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {users.length === 0 && <p>No user has registered yet</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="spaces-5"></div>
      </div>
    </Fragment>
  );
};

export default Users;
