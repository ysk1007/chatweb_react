import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [loginHistoryList, setLoginHistoryList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nav, setNav] = useState([]);

    // 유저 정보 가져오기
    useEffect(() => {
    fetch('http://localhost/api/userInfo', {
        credentials: 'include' // 중요: 쿠키(세션) 전달
    })
        .then(res => res.json())
        .then(data=> setUser(data));
    }, []);

    // 로그인 이력 가져오기
    useEffect(() => {
        if (!user) return; // user가 null이면 실행하지 않음

        fetch(`http://localhost/loginHistory/${user.userNo}/${pageNumber}`)
            .then((res) => res.json())
            .then((data) => {
                setLoginHistoryList(data.content);
                setTotalPages(data.totalPages);

                // 페이지 네비게이션 계산
                const navSize = 10;
                const startNav = Math.floor((pageNumber - 1) / navSize) * navSize + 1;
                const arr = [];

                for (let i = startNav; i < startNav + navSize; i++) {
                    if (i > data.totalPages) break;
                    arr.push(i);
                }

                setNav(arr);
            });
    }, [user, pageNumber]); // 🔑 user와 pageNumber가 바뀔 때 실행


    function calculateSessionDuration(loginAt, logoutAt) {
        if (!loginAt || !logoutAt) return '-';

        const loginDate = new Date(loginAt);
        const logoutDate = new Date(logoutAt);

        const diffMs = logoutDate - loginDate;
        if (diffMs < 0) return '-';

        // 밀리초 -> 시, 분, 초 변환
        const seconds = Math.floor(diffMs / 1000) % 60;
        const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        return `${hours}시간 ${minutes}분 ${seconds}초`;
    }
  return (
    <div>
      <h1>내 로그인 이력</h1>
      {user ? (
        <div>
          <p>이름: {user.userName}</p>
          {/* 필요한 정보 추가 */}
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}

    <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead>
            <tr>
            <th>로그인 시간</th>
            <th>로그아웃 시간</th>
            <th>머문 시간</th>
            </tr>
        </thead>
        <tbody>
            {loginHistoryList && loginHistoryList.length > 0 ? (
            loginHistoryList.map((l) => (
                <tr key={l.historyNo}>
                <td>{l.loginAt}</td>
                <td>{l.logoutAt}</td>
                <td>{calculateSessionDuration(l.loginAt, l.logoutAt)}</td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan={2}>로그인 이력이 없습니다.</td>
            </tr>
            )}
        </tbody>
    </table>


    {/* 페이지 네비 */}
    <div>
        {
            nav[0] > 1 ? <button onClick={() => setPageNumber(nav[0] - 1)}>이전</button> : <span></span>
        }

        {
            nav.map((i) => (
                <button key={i} onClick={() => setPageNumber(i)}>{i}</button>
            ))
        }

        {
            nav[nav.length - 1] < totalPages ? <button onClick={() => setPageNumber(nav[nav.length - 1] + 1)}>다음</button> : <span></span>
        }
    </div>

    </div>
  )
}

export default Dashboard
