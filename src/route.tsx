import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";
import { useAuth } from "./contexts/auth";
import { useCallback, useEffect, useMemo } from "react";

export const AuthRoute = ({
  children,
  isAuthed,
  ...rest
}: RouteProps & { isAuthed: boolean }) => {
  const render = useCallback(
    (routeProps: RouteComponentProps) => {
      return isAuthed ? (
        (children as React.ReactNode)
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: routeProps.location } }}
        />
      );
    },
    [isAuthed]
  );

  return <Route {...rest} render={render} />;
};

export const PublicOnlyRoute = ({
  children,
  isAuthed,
  ...rest
}: RouteProps & { isAuthed: boolean }) => {
  const render = useCallback(
    (routeProps: RouteComponentProps) => {
      return !isAuthed ? (
        (children as React.ReactNode)
      ) : (
        <Redirect
          to={{ pathname: "/home", state: { from: routeProps.location } }}
        />
      );
    },
    [isAuthed]
  );

  return <Route {...rest} render={render} />;
};
