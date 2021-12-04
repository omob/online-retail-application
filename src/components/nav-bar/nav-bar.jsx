import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import "./nav-bar.scss";

const APP_NAME = "Retail App";

const Navbar = ({ user }) => {
  const [isVisible, setVisible] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [navDropdownToggled, setNavDropdownToggle] = useState(false);

  const userProfileNavLink = () => {
    return (
      <div
        className="dropdown z-index"
        onMouseEnter={() => setShowDropDown(true)}
        onMouseLeave={() => setShowDropDown(false)}
      >
        <NavLink
          activeClassName="is-active"
          className="nav-item nav-link "
          to="/dashboard/user/profile"
        >
          <i className="fa fa-user"></i>&nbsp;
          {user?.name?.firstName}
        </NavLink>
        {/* <div
          className={"dropdown-menu " + (showDropDown ? "show" : "")}
          aria-labelledby="dropdownMenuLink"
        >
          <Link to="/dashboard/user/profile" className="dropdown-item">
            My Profile
          </Link>
          <a className="dropdown-item" href="#">
            Accounts
          </a>
        </div> */}
      </div>
    );
  };

  const logoutNavLink = () => {
    return (
      <NavLink className="nav-item nav-link z-index" to="/logout">
        Logout
      </NavLink>
    );
  };
  return (
    <div className="container navdiv">
      <nav className="navbar navbar-expand-lg navbar-light">
        <NavLink className="navbar-brand" to="/">
          {/* <img
            src={process.env.PUBLIC_URL + "/logo.jpg"}
            className="img-fluid"
            alt={APP_NAME}
          /> */}
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setNavDropdownToggle(!navDropdownToggled)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={
            " navbar-collapse flex-row-reverse " +
            (navDropdownToggled ? " " : "collapse ")
          }
          id="navbarSupportedContent"
        >
          <ul
            className="navbar-nav"
            onClick={() => setNavDropdownToggle(false)}
          >
            {!user && (
              <Fragment>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/products"
                >
                  Products
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/login"
                >
                  LOGIN
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/register"
                >
                  SIGN UP
                </NavLink>
              </Fragment>
            )}

            {user?.roles?.admin && (
              <Fragment>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/dashboard/products"
                >
                  Products
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/dashboard/subscriptions"
                >
                  Subscriptions
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/dashboard/user/subscriptions"
                >
                  My Subscriptions
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/dashboard/users"
                >
                  All Users
                </NavLink>
                {userProfileNavLink()}
                {logoutNavLink()}
              </Fragment>
            )}

            {user && !user?.roles?.admin && (
              <Fragment>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/products"
                >
                  Products
                </NavLink>
                <NavLink
                  activeClassName="is-active"
                  className="nav-item nav-link z-index"
                  to="/dashboard/user/subscriptions"
                >
                  Subscriptions
                </NavLink>
                {userProfileNavLink()}
                {logoutNavLink()}
              </Fragment>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
