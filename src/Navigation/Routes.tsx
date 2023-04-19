import { createHashRouter } from "react-router-dom";
import { App } from "../App";
import { JoinPage, Stake, User } from "../pages";
import {
  Dashboard,
  FutureSecureWallet,
  Staking,
  Team,
  Transactions,
  UserIDDisplay,
} from "../pages/User";
import { UserDashboard } from "../pages/User/Dashboard/UserDashboard/UserDashboard";
import { ProtectedNavigation } from "./ProtectedNavigation";

export const Routes = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <JoinPage />,
      },
      {
        path: "/:referrerAddress",
        element: <JoinPage />,
      },
      {
        path: "user",
        element: (
          <ProtectedNavigation>
            <User />
          </ProtectedNavigation>
        ),
        children: [
          {
            index: true,
            element: <UserIDDisplay />,
          },
          {
            path: "dashboard/:userID",
            element: <Dashboard />,
            children: [
              {
                index: true,
                element: <UserDashboard />,
              },
              {
                path: "stakings",
                element: <Staking />,
              },
              {
                path: "future-secure-wallet",
                element: <FutureSecureWallet />,
              },

              {
                path: "team",
                element: <Team />,
              },
              {
                path: "transactions",
                element: <Transactions />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
