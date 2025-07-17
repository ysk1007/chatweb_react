import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 사이드바 없는 페이지 */}
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        {/* 사이드바 포함 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          {/* 필요한 다른 페이지도 여기에 추가 */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
