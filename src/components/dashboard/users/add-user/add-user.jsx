import React, { Fragment, useEffect, useState } from "react";
import Error from "../../../../common/error";
import Header from "../../../../common/header/header";
import userService from "../../../../services/userService";
import UserRegistrationForm from "../../../register/user-registration-form/user-registration-form";
import SubHeader from "./../subheader";
import "./add-user.scss";
import { toast } from "react-toastify";

const UserForm = ({ match, history }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const { data } = await userService.getAllUsers();
      setUsers(data);
      setLoading(false);
    };

    getUsers();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const { confirmPassword, ...user } = data;
      await userService.registerUser(user);
      toast.info("Success adding user");
      history.replace({
        pathname: "/dashboard/users",
      });
      setLoading(false);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setRegisterError(ex.response.data);
      }
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div id="users">
        <Header title={"All Users"} />
        <SubHeader
          links={[
            { name: "Users", url: "/dashboard/users", className: "btn-danger" },
            { name: "Add User", url: "/dashboard/users/new" },
          ]}
        />
        <div className="p-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-8">
                {registerError && <Error message={registerError} />}
                <UserRegistrationForm
                  handleFormSubmit={onSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="spaces-5"></div>
    </Fragment>
  );
};

export default UserForm;
