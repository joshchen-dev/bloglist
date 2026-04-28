import { useContext } from 'react'
import NotificationContext from '../components/NotificationContext'

export const useNotification = () => {
  const { notificationDispatch } = useContext(NotificationContext)

  const setNotification = (type, content) => {
    const payload = { message: content }

    if (type === 'success') {
      payload.type = 'success'
    } else {
      payload.type = 'error'
    }

    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload
    })
    setTimeout(() => {
      notificationDispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, 5000)
  }

  return setNotification
}