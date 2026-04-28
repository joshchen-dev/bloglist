import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

export const useAllUsersQuery = () => {
  const { data, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  })

  return [data, isPending]
}