import { createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { User } from '../pages';
import { AdminDashboard } from '../pages/admin';
import { JoinPage } from '../pages/JoinPage/JoinPage';
import { Dashboard, FutureSecureWallet, Team, TopUpID, Transactions, UserDashboard, UserIDDisplay, WalletPage, WinningReward } from '../pages/User';
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
            path: 'info',
            element: <Dashboard />,
            children: [
              {
                path: 'dashboard/:userID',
                element: <UserDashboard />,
              },
              {
                path: 'winning-rewards/:userID',
                element: <WinningReward />,
              },
              {
                path: 'future-secure-wallet/:userID',
                element: <FutureSecureWallet />,
              },

              {
                path: 'team/:userID',
                element: <Team />,
              },
              {
                path: 'top-up-id/:userID',
                element: <TopUpID />,
              },
              {
                path: 'wallet-page/:userID',
                element: <WalletPage />,
              },
              {
                path: 'transactions/:userID',
                element: <Transactions />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <App />,
  },
]);
