import { createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { JoinPage, User } from '../pages';
import { AdminDashboard } from '../pages/admin';
import {
  Dashboard,
  FutureSecureWallet,
  WinningReward,
  Team,
  Transactions,
  UserIDDisplay,
} from '../pages/User';
import { UserDashboard } from '../pages/User/Dashboard/UserDashboard/UserDashboard';
import { TopUpID } from '../pages/User/TopUpID/TopUpID';
import { ProtectedNavigation } from './ProtectedNavigation';

export const Routes = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedNavigation>
            <JoinPage />
          </ProtectedNavigation>
        ),
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: '/:referrerAddress',
        element: (
          <ProtectedNavigation>
            <JoinPage />
          </ProtectedNavigation>
        ),
      },
      {
        path: 'user',
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
            path: ':userAddress',
            element: <UserIDDisplay />,
          },
          {
            path: 'dashboard/:userID',
            element: <Dashboard />,
            children: [
              {
                index: true,
                element: <UserDashboard />,
              },
              {
                path: 'winning-rewards',
                element: <WinningReward />,
              },
              {
                path: 'future-secure-wallet',
                element: <FutureSecureWallet />,
              },

              {
                path: 'team',
                element: <Team />,
              },
              {
                path: 'top-up-id',
                element: <TopUpID />,
              },
              {
                path: 'transactions',
                element: <Transactions />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
