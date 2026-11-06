import React from 'react'

const Error = ({ message }) => {
  return (
    <div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-center px-4'>
       <div className='text-3xl text-white'>
         {message || "Error - 404 Not Found"}
       </div>
    </div>
  )
}

export default Error