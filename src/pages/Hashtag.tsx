import React, { useEffect, useState } from 'react'

const Hashtag = () => {
  const [topHashtags, setTopHashtags] = useState([])

  useEffect(() => {
    fetch('http://localhost/topHashtag', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setTopHashtags(data))
      .catch(err => console.error('해시태그 불러오기 실패:', err))
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🔥 인기 해시태그</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {topHashtags.map((hashtag, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="text-blue-600 font-semibold text-lg">#{hashtag.tagText}</div>
            <div className="text-gray-500 text-sm mt-1">{hashtag.count}회 사용됨</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hashtag
