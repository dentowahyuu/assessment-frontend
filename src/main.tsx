import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// Hapus './src/', cukup './' saja
import FilterPage, { regionLoader } from './FilterPage' 
import './index.css'

const router = createBrowserRouter([
  { path: "/", element: <FilterPage />, loader: regionLoader },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)