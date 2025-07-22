import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const Hashtag = () => {
  const [topHashtags, setTopHashtags] = useState([])
  const [allHashtags, setAllHashtags] = useState([]) // 전체 해시태그 리스트
  const [chatList, setChatList] = useState([])
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [hashtagPage, setHashtagPage] = useState(0) // 전체 해시태그 페이징용

  // 인기 해시태그 불러오기 (기존)
  useEffect(() => {
    fetch('http://localhost/topHashtag', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTopHashtags(data))
      .catch(err => console.error('해시태그 불러오기 실패:', err))
  }, [])

  // 전체 해시태그 리스트 불러오기 (검색 및 페이징)
  useEffect(() => {
    const encodedSearch = search.trim() === '' ? '_' : encodeURIComponent(search)
    fetch(`http://localhost/hashtag?page=${hashtagPage + 1}&search=${encodedSearch}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setAllHashtags(data.content || [])
        // 필요하면 전체 해시태그 총 페이지도 받아서 저장 가능
      })
      .catch(err => console.error('전체 해시태그 불러오기 실패:', err))
  }, [hashtagPage, search])

  // 대화 목록 불러오기 (기존)
  useEffect(() => {
    const encodedSearch = search.trim() === '' ? '_' : encodeURIComponent(search)
    fetch(`http://localhost/hashtagChatHistory?page=${page + 1}&search=${encodedSearch}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setChatList(data?.content || [])
        setTotalPages(data?.totalPages || 0)
      })
      .catch(err => console.error('대화 목록 불러오기 실패:', err))
  }, [page, search])

  // 해시태그 클릭 시 검색어 세팅 + 페이지 초기화 함수
  const onHashtagClick = (tagText: string) => {
    setSearch(tagText)
    setPage(0)
    setHashtagPage(0)
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900 max-w-7xl mx-auto">

  {/* 🔥 인기 해시태그 */}
  <h2 className="text-2xl font-bold mb-4">🔥 인기 해시태그</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
    {topHashtags.map((hashtag, idx) => (
      <div
        key={idx}
        className="bg-white border border-gray-200 text-gray-800 shadow-sm rounded-lg p-4 hover:bg-blue-50 hover:shadow transition cursor-pointer"
        onClick={() => onHashtagClick(hashtag.tagText)}
      >
        <div className="text-blue-600 font-semibold text-lg">#{hashtag.tagText}</div>
        <div className="text-sm text-gray-500 mt-1">{hashtag.count}회 사용됨</div>
      </div>
    ))}
  </div>

  {/* 🔎 전체 해시태그 */}
  <h3 className="text-xl font-semibold mb-2">전체 해시태그</h3>
  <div className="flex flex-wrap gap-3 mb-6">
    <span
      className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition text-sm"
      onClick={() => onHashtagClick('')}
    >
      #전체
    </span>
    {allHashtags.length > 0 ? (
      allHashtags.map((hashtag, idx) => (
        <span
          key={idx}
          className="cursor-pointer bg-gray-200 px-3 py-1 rounded-full hover:bg-blue-500 hover:text-white transition text-sm"
          onClick={() => onHashtagClick(hashtag.tagText)}
        >
          #{hashtag.tagText}
        </span>
      ))
    ) : (
      <div className="text-gray-500">검색 결과가 없습니다.</div>
    )}
  </div>

  {/* 🔍 검색창 */}
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
    <Input
      className="p-2 border border-gray-300 rounded w-full sm:w-64"
      placeholder="해시태그 검색"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Button
      onClick={() => {
        setPage(0)
        setHashtagPage(0)
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      검색
    </Button>
  </div>

  {/* 📋 대화 테이블 */}
  <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="w-32">해시태그</TableHead>
          <TableHead className="w-32">사용자</TableHead>
          <TableHead className="w-[300px]">질문</TableHead>
          <TableHead className="w-[300px]">응답</TableHead>
          <TableHead className="w-40">작성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chatList.length > 0 ? (
          chatList.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="break-words">#{item.tagText}</TableCell>
              <TableCell>{item.userName || '-'}</TableCell>
              <TableCell className="break-words">{item.userMsg}</TableCell>
              <TableCell className="whitespace-pre-wrap break-words max-w-[300px]">{item.aiReply}</TableCell>
              <TableCell>{item.createAt ? format(new Date(item.createAt), 'yyyy-MM-dd HH:mm') : ''}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
              결과가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>

  {/* ⏪ 페이지네이션 */}
  <div className="mt-6 flex justify-center gap-2 flex-wrap">
    <Button
      className="bg-gray-200 hover:bg-gray-300 text-sm"
      onClick={() => setPage(prev => Math.max(prev - 1, 0))}
      disabled={page === 0}
    >
      이전
    </Button>
    {[...Array(totalPages)].map((_, i) => (
      <Button
        key={i}
        onClick={() => setPage(i)}
        className={`text-sm px-3 py-1 rounded ${
          i === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {i + 1}
      </Button>
    ))}
    <Button
      className="bg-gray-200 hover:bg-gray-300 text-sm"
      onClick={() => setPage(prev => prev + 1)}
      disabled={page >= totalPages - 1}
    >
      다음
    </Button>
  </div>
</div>

  )
}

export default Hashtag
