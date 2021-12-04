import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import ProtectedRoute from "./common/protectedRoute/ProtectedRoute";
import ManageProduct from "./components/dashboard/products/manage-product";
import Products from "./components/dashboard/products/products";
import UserProfile from "./components/dashboard/profile/profile";
import UserSubscriptions from "./components/dashboard/users/subscription/user-subscriptions";
import Footer from "./components/footer/footer";
import LandingPage from "./components/landing-page/landing-page.jsx";
import LoginForm from "./components/login/login";
import Logout from "./components/logout/logout";
import Navbar from "./components/nav-bar/nav-bar";
import NotFound from "./components/not-found/not-found";
import RegisterForm from "./components/register/register";
import authService from "./services/authService";
import Subscriptions from "./components/dashboard/subscriptions/subscriptions";
import EditProfile from "./components/dashboard/profile/edit-profile/edit-profile";
import AboutPage from "./components/about/about";
import Users from "./components/dashboard/users/users";
import UserForm from "./components/dashboard/users/add-user/add-user";
import ProductsPage from "./components/products-page/products-page";

const App = ({ history }) => {
  // const [user, setUser] = useState(null);
  return (
    <Fragment>
      <Navbar user={authService.getCurrentUser()}></Navbar>
      <ToastContainer />
      <Switch>
        <Route path="/login" component={LoginForm}></Route>
        <Route path="/logout" component={Logout}></Route>
        <Route path="/register" component={RegisterForm}></Route>
        <Route path="/about" component={AboutPage}></Route>
        <Route path="/products" component={ProductsPage}></Route>

        {/* user routes */}
        <ProtectedRoute
          path="/dashboard/user/subscriptions"
          component={UserSubscriptions}
        />
        <ProtectedRoute
          path="/dashboard/user/profile/edit"
          component={EditProfile}
        />
        <ProtectedRoute
          path="/dashboard/user/profile"
          component={UserProfile}
        />

        {/* Admin Routes */}

        <ProtectedRoute
          path="/dashboard/users/profile/:id"
          component={UserProfile}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/users/new"
          component={UserForm}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/users"
          component={Users}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/subscriptions/:id"
          component={UserSubscriptions}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/subscriptions"
          component={Subscriptions}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/products/edit/:id"
          component={ManageProduct}
          role="admin"
        />
        <ProtectedRoute
          path="/dashboard/products/new"
          component={ManageProduct}
          role="admin"
        />

        <ProtectedRoute
          path="/dashboard/products"
          component={Products}
          role="admin"
        />

        <Route path="/not-found" component={NotFound}></Route>
        <Route path="/" exact component={ProductsPage}></Route>
        <Redirect to="/not-found"></Redirect>
      </Switch>
      <Footer></Footer>
    </Fragment>
  );
};

export default App;
