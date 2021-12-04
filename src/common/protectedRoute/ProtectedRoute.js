import React from "react";
import { Route, Redirect } from "react-router";
import authService from "../../services/authService";

export default function ProtectedRoute({
  path,
  component: Component,
  render,
  role,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            ></Redirect>
          );
        }

        switch (role) {
          case "admin":
            {
              if (currentUser?.roles?.admin)
                return Component ? <Component {...props} /> : render(props);
              else {
                console.log("Not admin");
                return <Redirect to={{ pathname: "/" }}></Redirect>;
              }
            }
            break;
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
}
