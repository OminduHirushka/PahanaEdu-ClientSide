import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BookDetail from '../pages/app/book/BookDetail'
import Books from '../pages/app/book/Books'

const BookRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="/:name" element={<BookDetail />} />
    </Routes>
  )
}

export default BookRoutes