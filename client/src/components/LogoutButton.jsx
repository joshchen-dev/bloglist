import { useContext } from 'react'
import UserContext from './UserContext'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'


const LogoutButton = () => {
  const { userDispatch } = useContext(UserContext)
  const navigate = useNavigate()
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    userDispatch({
      type: 'LOGOUT'
    })
    navigate('/')
  }

  return (
    <Button onClick={handleLogout} style={{ margin: 5 }}>
      logout
    </Button>
  )
}

export default LogoutButton