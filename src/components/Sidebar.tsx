import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  function logout(){
    
    fetch('http://localhost/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(()=>{
    navigate('/')
  })
  ;
  }

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl mb-4">메뉴</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/Dashboard">대시보드</Link>
        <Link to="/ChatBot">챗봇과 대화하기</Link>
        <Button onClick={logout}>로그아웃</Button>
      </nav>
    </aside>
  )
}

export default Sidebar
