import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [userPassword, setUserPassword] = useState('')

  useEffect(() => {
    document.title = '로그인 - ChatBot'
  }, [])

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, userPassword }),
      })

      if (response.ok) {
        navigate('/Dashboard')
      } else {
        alert('❌ 아이디 또는 비밀번호가 잘못되었습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">🔐 로그인</h1>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="id" className="text-sm font-medium text-gray-700">아이디</Label>
            <Input
              id="id"
              type="text"
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full mt-2" onClick={handleLogin}>
            로그인
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          아직 계정이 없으신가요?{' '}
          <Link to="/SignUp" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
