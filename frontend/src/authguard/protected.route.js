import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

//accept a Component as an argument check whether the user is authorized to open that component 
export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        //if the user is authorized open that component else redirect it to the home page
        if (auth.isAuthenticated()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};