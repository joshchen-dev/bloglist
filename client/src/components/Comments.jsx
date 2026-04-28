import CreateCommentForm from './CreateCommentForm'

const Comments = ({ comments, blogId }) => {
  const hasComments = comments && comments.length > 0

  return (
    <div className="space-y-8">
      {/* Header & Form Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Comments</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
            {comments?.length || 0}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <CreateCommentForm blogId={blogId} />
        </div>
      </section>

      {/* List Section */}
      <section>
        {hasComments ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Visual Avatar Placeholder */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {/* Generates a generic initial or icon */}
                    💬
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                    {/* Optional: Add a timestamp if your data supports it */}
                    <p className="mt-2 text-xs text-gray-400 uppercase tracking-wider font-medium">
                      time...
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Comments