import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'

const SignUp = () => {
  const [userId, setUserId] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [userGender, setUserGender] = useState('')
  const [userBirth, setUserBirth] = useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          userPassword,
          userName,
          userRole: 'USER',
          userGender,
          userBirth: userBirth ? format(userBirth, 'yyyy-MM-dd') : null,
        }),
      })

      if (response.ok) {
        alert('회원 가입 성공')
        navigate('/')
      } else {
        alert('회원 가입 실패')
      }
    } catch (error) {
      console.error('회원 가입 오류:', error)
    }
  }

  const checkId = () => {
    fetch('http://localhost/checkId?userId=' + userId, { method: 'GET' }).then(res => {
      if (res.ok) alert('사용 가능한 아이디입니다.')
      else alert('이미 사용 중인 아이디입니다.')
    })
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">회원 가입</h1>

        <div className="space-y-6">
          {/* 아이디 + 중복확인 */}
          <div>
            <Label htmlFor="id" className="block mb-1 font-semibold text-gray-700">
              아이디
            </Label>
            <div className="flex gap-2">
              <Input
                id="id"
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={checkId} className="whitespace-nowrap">
                중복조회
              </Button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <Label htmlFor="password" className="block mb-1 font-semibold text-gray-700">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={userPassword}
              onChange={e => setUserPassword(e.target.value)}
            />
          </div>

          {/* 이름 */}
          <div>
            <Label htmlFor="name" className="block mb-1 font-semibold text-gray-700">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={userName}
              onChange={e => setUserName(e.target.value)}
            />
          </div>

          {/* 성별 */}
          <div>
            <Label className="block mb-2 font-semibold text-gray-700">성별</Label>
            <RadioGroup onValueChange={setUserGender} defaultValue="">
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="male" />
                  <Label htmlFor="male" className="cursor-pointer select-none">
                    남성
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="female" />
                  <Label htmlFor="female" className="cursor-pointer select-none">
                    여성
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 생년월일 */}
          <div>
            <Label htmlFor="birth" className="block mb-1 font-semibold text-gray-700">
              생년월일
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="birth"
                  className="w-full justify-between text-left font-normal"
                >
                  {userBirth ? format(userBirth, 'yyyy-MM-dd') : '날짜를 선택하세요'}
                  <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={userBirth}
                  captionLayout="dropdown"
                  onSelect={date => {
                    setUserBirth(date)
                    setCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 회원가입 버튼 */}
          <Button className="w-full" onClick={handleSignUp}>
            회원 가입
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
