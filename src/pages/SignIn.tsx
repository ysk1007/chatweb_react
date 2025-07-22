import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

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
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl space-y-6">
        <CardHeader className="text-center text-2xl font-bold">
          🔐 로그인
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="id">아이디</Label>
            <Input
              id="id"
              type="text"
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
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
        </CardContent>

        <div className="text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link to="/SignUp" className="text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default SignIn
