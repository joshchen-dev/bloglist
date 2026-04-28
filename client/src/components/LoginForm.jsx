import { useContext } from 'react'
import loginService from '../services/login'
import UserContext from './UserContext'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'

const LoginForm = ({ username, setUsername, password, setPassword, showNotification }) => {
  const { userDispatch } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      userDispatch({
        type: 'LOGIN',
        payload: user
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      showNotification('success', `logged in as ${user.username} successfully`)
      navigate('/blogs')
    } catch (error) {
      console.error('wrong credentials', error)
      showNotification('error', 'wrong username or password')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <Button type="submit">login</Button>
    </form>
  )
}

export default LoginForm