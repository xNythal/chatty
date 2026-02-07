import { createBrowserRouter } from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedPage from './pages/ProtectedPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: 'settings', element: <SettingsPage /> },
      {
        children: [
          { path: 'signup', element: <SignUpPage /> },
          { path: 'login', element: <LoginPage /> },
        ],
        element: <ProtectedPage isPublic={true} />,
      },
    ],
  },
])

export default router
