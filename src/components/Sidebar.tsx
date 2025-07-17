import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl mb-4">메뉴</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/Dashboard">대시보드</Link>
        
      </nav>
    </aside>
  )
}

export default Sidebar
