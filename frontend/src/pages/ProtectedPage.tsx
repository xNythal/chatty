import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

function ProtectedRoute({ isPublic }: { isPublic?: boolean }) {
  let { authUser } = useAuthStore()
  if (!authUser && !isPublic) {
    return <Navigate to='/login' replace />
  }

  if (authUser && isPublic) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
export default ProtectedRoute
