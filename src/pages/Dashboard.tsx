import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

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

  // 해시태그 입력폼
  const [tagText, setTagText] = useState('')
  const [chatNo, setChatNo] = useState('')

  // 선택된 채팅내역 리스트
  const [selectedChats, setSelectedChats] = useState<number[]>([]);

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

  // 체크박스 선택했을때 선택 배열 업데이트
  const toggleSelectChat = (chatNo: number) => {
    console.log("Checkbox clicked for chatNo:", chatNo);
    setSelectedChats(prev =>
      prev.includes(chatNo)
        ? prev.filter(no => no !== chatNo)
        : [...prev, chatNo]
    );
  };

  // 대화 저장 삭제
  const deleteSelectedChats = () => {
  if (selectedChats.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  fetch(`http://localhost/deleteChatHistories`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedChats),
  })
  .then(res => {
    if (!res.ok) throw new Error("삭제 실패");
    return res.text();
  })
  .then(() => {
    alert("삭제 완료");
    // 삭제 후 화면에서 리스트 갱신
    setChatHistoryList(prevList =>
      prevList.filter(item => !selectedChats.includes(item.chatNo))
    );
    setSelectedChats([]);  // 선택 초기화
  })
  .catch(console.error);
};

  // 머문 시간 계산 (로그아웃 시점 - 로그인 시점)
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

  // 즐겨찾기 설정 변경
  const updateBookmark = (chatNo: number) => {
    fetch(`http://localhost/updateBookmark/${chatNo}`, {
      method: 'PATCH',
      credentials: 'include',
    })
    .then(res => {
      if (!res.ok) throw new Error('서버 응답 에러');
      return res.text();
    })
    .then(text => {
    window.location.reload()})
  };

  // 해시 태그 추가
  function addHashtag(){
      fetch(`http://localhost/addHashtag/${chatNo}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                chatHistory : {chatNo : chatNo},
                tagText : tagText,
              }),
            }).then()
              .then(()=>{
                window.location.reload();
              }
            );
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
                    <TableCell>{format(new Date(l.loginAt),'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{l.logoutAt == null ? '' : format(new Date(l.logoutAt),'yyyy-MM-dd HH:mm')}</TableCell>
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
          <Table className="table-auto min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="w-32">날짜/시간</TableHead>
                <TableHead className="w-32">세션 ID</TableHead>
                <TableHead className="w-[250px]">사용자 질문</TableHead>
                <TableHead className="w-[250px]">AI 응답</TableHead>
                <TableHead className="w-20">즐겨찾기</TableHead>
                <TableHead className="w-40">#</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chatHistoryList && chatHistoryList.length > 0 ? (
                chatHistoryList.map((c) => (
                  <TableRow key={c.chatNo}>
                    <TableCell>
                        <Checkbox 
                          id={c.chatNo.toString()} 
                          checked={selectedChats.includes(c.chatNo)} 
                          onClick={() => toggleSelectChat(c.chatNo)} 
                        />
                    </TableCell>
                    <TableCell>{format(new Date(c.createAt),'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{c.sessionId}</TableCell>
                    <TableCell>{c.userMsg}</TableCell>
                    <TableCell>{c.aiReply}</TableCell>
                    <TableCell>
                      {c.bookmark === 1 ? (
                        <Switch
                          id={c.chatNo}
                          checked
                          onClick={() => updateBookmark(c.chatNo)}
                        />
                      ) : (
                        <Switch
                          id={c.chatNo}
                          onClick={() => updateBookmark(c.chatNo)}
                        />
                      )}
                    </TableCell>
                    <TableCell>{c.tagText}
                      <Dialog>
                        <form>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setChatNo(c.chatNo)}>
                              # 해시태그 추가
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>해시태그 추가</DialogTitle>
                              <DialogDescription>
                                해시태그 목록 : {tagText}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Input id="chatNo" name="chatNo" value={c.chatNo} hidden/>
                                <Input id="tagText" name="tagText" placeholder='#태그를 입력 해주세요 (쉼표로 여러개 구분)' onChange={(e) => {setTagText(e.target.value.replace(/[^a-zA-Z0-9가-힣,]/g,'')); }}/>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">취소</Button>
                              </DialogClose>
                              <Button onClick={addHashtag}>저장</Button>
                            </DialogFooter>
                          </DialogContent>
                          </form>
                        </Dialog>
                      </TableCell>
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

          <Button variant="destructive" onClick={deleteSelectedChats} className="mb-4">
            선택 삭제
          </Button>
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
