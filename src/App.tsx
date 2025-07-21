import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import ChatBot from './pages/ChatBot'
import Hashtag from './pages/Hashtag'

function App() {
  // 페이지 제목 설정
  useEffect(() => {
    document.title = 'ChatWeb'
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* 사이드바 없는 페이지 */}
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        {/* 사이드바 포함 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ChatBot" element={<ChatBot />} />
          <Route path="/Hashtag" element={<Hashtag />} />
          {/* 필요한 다른 페이지도 여기에 추가 */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
