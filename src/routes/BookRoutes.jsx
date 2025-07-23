import React from 'react'
import Books from '../pages/book/Books'
import { Route, Routes } from 'react-router-dom'

const BookRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Books />} />
    </Routes>
  )
}

export default BookRoutes