import { Link } from 'react-router-dom'
import { useAllUsersQuery } from '../hooks/allUsersQuery'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from './ui/Button'

const AllUsers = () => {
  const [allUsers, isPending] = useAllUsersQuery()

  if (isPending) {
    return <h2>Now loading...</h2>
  }

  return (
    <div>
      <h2 className='text-3xl font-bold'>Users</h2>
      <Table>
        <TableCaption>All users in the database.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="text-right font-bold">blogs created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Button asChild variant='link'>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </Button>
              </TableCell>
              <TableCell className='text-right'>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
          {/* <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
      {/* <table>
        <thead>
          <tr>
            <th></th>
            <th><strong>blogs created</strong></th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
}

export default AllUsers