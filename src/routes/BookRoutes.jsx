import React from 'react'
import Books from '../pages/book/Books'
import BookDetail from '../pages/book/BookDetail'
import { Route, Routes } from 'react-router-dom'

const BookRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="/:name" element={<BookDetail />} />
    </Routes>
  )
}

export default BookRoutes