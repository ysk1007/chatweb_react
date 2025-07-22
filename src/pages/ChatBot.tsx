import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from "react-router-dom"

const ChatBot = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [chatHistory, setChatHistory] = useState<{ content: string; messageType: 'USER' | 'ASSISTANT' }[]>([])
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('http://localhost/api/userInfo', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  useEffect(() => {
    fetch('http://localhost/getChatHistory', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setChatHistory(data.filter(msg => msg.messageType !== 'SYSTEM'))
      })
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatHistory])

  function chat() {
    const userMessage = input.trim()
    if (!userMessage) return

    setMessages(prev => [...prev, { from: 'user', text: userMessage }])
    setInput('')

    fetch('http://localhost/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userMsg: userMessage }),
    })
      .then(res => res.text())
      .then(text => {
        setMessages(prev => [...prev, { from: 'ai', text }])
      })
      .catch(err => {
        console.error('AI 응답 오류:', err)
      })
  }

  function chatHistorySave() {
    if (!confirm("현재까지 대화 내용을 저장할까요?")) return
    fetch('http://localhost/chatHistorySave', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.text())
      .then(alert)
      .then(() => window.location.reload())
  }

  function chatHistoryReset() {
    if (!confirm("현재 ChatBot과 대화한 내용을 리셋할까요?")) return
    fetch('http://localhost/chatHistoryReset', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.text())
      .then(alert)
      .then(() => window.location.reload())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    chat()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 상단 바 */}
      <div className="bg-white px-6 py-4 shadow-md flex justify-between items-center border-b">
        <div className="text-lg font-bold text-gray-800">👤 {user?.userName || "익명"}님</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={chatHistorySave}>💾 저장</Button>
          <Button variant="destructive" onClick={chatHistoryReset}>🗑️ 리셋</Button>
        </div>
      </div>

      {/* 채팅 내역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        {[...chatHistory.map(msg => ({
          from: msg.messageType === 'USER' ? 'user' : 'ai',
          text: msg.text
        })), ...messages].map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md p-3 text-sm rounded-2xl shadow-md whitespace-pre-wrap ${
                msg.from === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 하단 입력창 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border-t shadow flex gap-2"
      >
        <Input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" className="min-w-[80px]">전송</Button>
      </form>
    </div>
  )
}

export default ChatBot
