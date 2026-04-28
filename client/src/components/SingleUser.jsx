import { useParams, Link } from 'react-router-dom'
import { useAllUsersQuery } from '../hooks/allUsersQuery'

const SingleUser = () => {
  const [users, isPending] = useAllUsersQuery()
  const { id } = useParams()

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse text-gray-500 font-medium">Loading user profile...</div>
      </div>
    )
  }

  const selectedUser = users?.find(user => user.id === id)

  if (!selectedUser) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
        <Link title="Go back" to="/users" className="text-indigo-600 hover:underline">Return to user list</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Section */}
      <header className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {selectedUser.name}
        </h2>
        <p className="text-gray-500 mt-2">
          Viewing all contributions and activity
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-indigo-50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Stats</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold text-indigo-700">{selectedUser.blogs.length}</span>
              <p className="text-indigo-600 text-sm">Total blogs published</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Added Blogs</h3>

          {selectedUser.blogs.length > 0 ? (
            <ul className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {selectedUser.blogs.map(blog => (
                <li key={blog.id} className="group hover:bg-gray-50 transition-all duration-200">
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        {blog.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">Published by {selectedUser.name}</p>
                    </div>
                    {/* Minimal Arrow Icon */}
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-50 rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 italic">This user hasn't added any blogs yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleUser