import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Header from "../../../common/header/header";
const ProfileHeader = ({ location, title }) => {
  return (
    <Fragment>
      <Header title={title} />
      <div className="nav navbar pl-4 ">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div>
                <Link
                  to="/dashboard/user/profile"
                  className="btn btn-outline-danger font-small  text-underline btn-sm"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/user/profile/edit"
                  className="btn btn-default float-right btn-sm font-small font-weight-bold"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileHeader;
