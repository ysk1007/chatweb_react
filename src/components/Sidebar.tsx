import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './mode-toggle'

const Sidebar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('http://localhost/api/userInfo', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null))
  }, [])

  function logout() {
    fetch('http://localhost/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      navigate('/')
    })
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-200 p-6 flex flex-col">
      <h2 className="text-3xl font-extrabold mb-8 tracking-wide text-white">
        메뉴
      </h2>

      <nav className="flex flex-col gap-4 flex-grow">
        <Link
          to="/Dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          대시보드
        </Link>

        {user?.userRole === 'ADMIN' && (
          <Link
            to="/AdminDashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            관리자 기능
          </Link>
        )}

        <Link
          to="/ChatBot"
          className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          챗봇과 대화하기
        </Link>

        <Link
          to="/Hashtag"
          className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          #해시태그
        </Link>
      </nav>

      <Button
        variant="destructive"
        className="mt-auto"
        onClick={logout}
      >
        로그아웃
      </Button>
    </aside>
  )
}

export default Sidebar
