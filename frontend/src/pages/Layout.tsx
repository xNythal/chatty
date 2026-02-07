import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from '../store/useThemeStore'

function Layout() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()
  useEffect(
    () => document.documentElement.setAttribute('data-theme', theme),
    [theme],
  )
  useEffect(() => {
    checkAuth()
  }, [])
  console.log(authUser)

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div>
      <Toaster />
      <Navbar /> <Outlet />
    </div>
  )
}
export default Layout
