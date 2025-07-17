import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 이거 붙여야 계속 세션,쿠키 유지
        body: JSON.stringify({
          userId : userId,
          userPassword : userPassword
        }),
      })

      if (response.ok) {
        // 로그인 성공 처리
        navigate('/Dashboard')
      } else {
        // 로그인 실패 처리
        alert('로그인 실패')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
    }
  }

  return (
    <div>
      <h1>회원 로그인</h1>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="id">아이디</Label>
        <Input
          type="text"
          id="id"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </div>

      <Button onClick={handleLogin}>로그인</Button>
      <br />
      아직 계정이 없으신가요? <Link to="/SignUp">회원 가입</Link>
    </div>
  )
}

export default SignIn
