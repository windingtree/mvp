import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const RootBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>This page doesn't exist!</div>;
    }

    if (error.status === 401) {
      return <div>You aren't authorized to see this</div>;
    }
  }

  return <div>Something went wrong</div>;
};
