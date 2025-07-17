import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Link } from 'react-router-dom'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { format } from 'date-fns'


const SignUp = () => {
  const [userId, setUserId] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [userGender, setUserGender] = useState('')
  const [userBirth, setUserBirth] = useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const navigate = useNavigate();
  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId : userId,
          userPassword : userPassword,
          userName : userName,
          userRole : 'USER',
          userGender : userGender,
          userBirth : userBirth ? format(userBirth, 'yyyy-MM-dd') : null
        }),
      })

      if (response.ok) {
        alert('회원 가입 성공')
        navigate("/");
      } else {
        alert('회원 가입 실패')
      }
    } catch (error) {
      console.error('회원 가입 오류:', error)
    }
  }

  function checkId(){
        fetch("http://localhost/checkId?userId="+userId,{
            method: "GET"
        })
        .then((res) => {
          if (res.ok) {
            alert("사용 가능한 아이디입니다.");
          }
          else {
            alert("이미 사용 중인 아이디입니다.");
          }
      });
    }

  return (
    <div>
      <h1>회원 가입</h1>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="id">아이디</Label>
        <Input
          type="text"
          id="id"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button onClick={checkId}>중복조회</Button>

        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <Label htmlFor="name">이름</Label>
        <Input
          type="text"
          id="name"
          placeholder="이름을 입력하세요"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <Label htmlFor="gender">성별</Label>
        <RadioGroup onValueChange={(value) => setUserGender(value)} defaultValue="">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="M" id="male" />
            <Label htmlFor="male">남성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="F" id="female" />
            <Label htmlFor="female">여성</Label>
          </div>
        </RadioGroup>

        <Label htmlFor="birth">생년월일</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="birth"
              className="w-full justify-between text-left font-normal"
            >
              {userBirth ? format(userBirth, "yyyy-MM-dd") : "날짜를 선택하세요"}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={userBirth}
              captionLayout="dropdown"
              onSelect={(date) => {
                setUserBirth(date)
                setCalendarOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleSignUp}>회원 가입</Button>
      <br />
      이미 계정이 있으신가요? <Link to="/">로그인</Link>
    </div>
  )
}

export default SignUp
