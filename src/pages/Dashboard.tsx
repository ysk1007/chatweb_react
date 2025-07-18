import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Dashboard = () => {
  const [user, setUser] = useState(null)

  // 로그인 이력 리스트
  const [loginHistoryList, setLoginHistoryList] = useState([])
  const [LH_pageNumber, setLhPageNumber] = useState(1)
  const [LH_totalPages, setLhTotalPages] = useState(0)
  const [LH_nav, setLhNav] = useState([])

  // 대화 저장 리스트
  const [chatHistoryList, setChatHistoryList] = useState([])
  const [CH_pageNumber, setChPageNumber] = useState(1)
  const [CH_totalPages, setChTotalPages] = useState(0)
  const [CH_nav, setChNav] = useState([])

  // 유저 정보
  useEffect(() => {
    fetch('http://localhost/api/userInfo', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  // 로그인 이력
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost/loginHistory/${user.userNo}/${LH_pageNumber}`)
      .then(res => res.json())
      .then(data => {
        setLoginHistoryList(data.content)
        setLhTotalPages(data.totalPages)

        const navSize = 10
        const startNav = Math.floor((LH_pageNumber - 1) / navSize) * navSize + 1
        const arr = []

        for (let i = startNav; i < startNav + navSize; i++) {
          if (i > data.totalPages) break
          arr.push(i)
        }

        setLhNav(arr)
      })
  }, [user, LH_pageNumber])

  // 대화 저장 이력
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost/userChatHistory/${user.userNo}/${CH_pageNumber}`)
      .then(res => res.json())
      .then(data => {
        setChatHistoryList(data.content)
        setChTotalPages(data.totalPages)

        const navSize = 10
        const startNav = Math.floor((CH_pageNumber - 1) / navSize) * navSize + 1
        const arr = []

        for (let i = startNav; i < startNav + navSize; i++) {
          if (i > data.totalPages) break
          arr.push(i)
        }

        setChNav(arr)
      })
  }, [user, CH_pageNumber])

  function calculateSessionDuration(loginAt, logoutAt) {
    if (!loginAt || !logoutAt) return '-'

    const loginDate = new Date(loginAt)
    const logoutDate = new Date(logoutAt)

    const diffMs = logoutDate - loginDate
    if (diffMs < 0) return '-'

    const seconds = Math.floor(diffMs / 1000) % 60
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60
    const hours = Math.floor(diffMs / (1000 * 60 * 60))

    return `${hours}시간 ${minutes}분 ${seconds}초`
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📊 내 로그인 이력</h1>

        {/* 유저 정보 */}
        {user ? (
          <div className="bg-white shadow-md rounded-xl p-4 mb-6">
            <p className="text-lg font-medium">👤 이름: {user.userName}</p>
            {/* 추가 정보 필요 시 여기에 */}
          </div>
        ) : (
          <div className="bg-red-100 text-red-800 rounded p-4 mb-6">
            로그인이 필요합니다.
          </div>
        )}

        {/* 로그인 이력 테이블 */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>로그인 시간</TableHead>
                <TableHead>로그아웃 시간</TableHead>
                <TableHead className="text-right">머문 시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistoryList && loginHistoryList.length > 0 ? (
                loginHistoryList.map((l) => (
                  <TableRow key={l.historyNo}>
                    <TableCell>{l.loginAt}</TableCell>
                    <TableCell>{l.logoutAt}</TableCell>
                    <TableCell className="text-right">
                      {calculateSessionDuration(l.loginAt, l.logoutAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    로그인 이력이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지 네비게이션 */}
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {LH_nav[0] > 1 && (
            <Button variant="outline" onClick={() => setLhPageNumber(LH_nav[0] - 1)}>
              ◀ 이전
            </Button>
          )}

          {LH_nav.map((i) => (
            <Button
              key={i}
              onClick={() => setLhPageNumber(i)}
              variant={i === LH_pageNumber ? 'default' : 'outline'}
            >
              {i}
            </Button>
          ))}

          {LH_nav[LH_nav.length - 1] < LH_totalPages && (
            <Button variant="outline" onClick={() => setLhPageNumber(LH_nav[LH_nav.length - 1] + 1)}>
              다음 ▶
            </Button>
          )}
        </div>


        {/* 대화 내용 테이블 */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜/시간</TableHead>
                <TableHead>세션 ID</TableHead>
                <TableHead>사용자 질문</TableHead>
                <TableHead>AI 응답</TableHead>
                <TableHead>즐겨찾기</TableHead>
                <TableHead>#</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chatHistoryList && chatHistoryList.length > 0 ? (
                chatHistoryList.map((c) => (
                  <TableRow key={c.chatNo}>
                    <TableCell>{c.createAt}</TableCell>
                    <TableCell>{c.sessionId}</TableCell>
                    <TableCell>{c.userMsg}</TableCell>
                    <TableCell>{c.aiReply}</TableCell>
                    <TableCell>{c.bookmark}</TableCell>
                    <TableCell><Button>해시태그 추가</Button></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    아직 저장한 대화가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지 네비게이션 */}
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {CH_nav[0] > 1 && (
            <Button variant="outline" onClick={() => setChPageNumber(CH_nav[0] - 1)}>
              ◀ 이전
            </Button>
          )}

          {CH_nav.map((i) => (
            <Button
              key={i}
              onClick={() => setChPageNumber(i)}
              variant={i === CH_pageNumber ? 'default' : 'outline'}
            >
              {i}
            </Button>
          ))}

          {CH_nav[CH_nav.length - 1] < CH_totalPages && (
            <Button variant="outline" onClick={() => setChPageNumber(CH_nav[CH_nav.length - 1] + 1)}>
              다음 ▶
            </Button>
          )}
        </div>
        

      </div>
    </div>
  )
}

export default Dashboard
