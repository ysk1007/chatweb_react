import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [loginData, setLoginData] = useState({
    content: [],
    last: true,
  });
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchLoginInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        name: nameFilter,
        date: dateFilter,
        page: page.toString(),
      });

      const response = await fetch(`http://localhost/userLoginInfo?${queryParams.toString()}`);
      if (!response.ok) throw new Error("API 요청 실패");
      const data = await response.json();
      setLoginData(data);
    } catch (e) {
      setError(e.message || "알 수 없는 에러");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoginInfo();
  }, [page, nameFilter, dateFilter]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    // Spring Data Page 객체의 last가 true면 마지막 페이지임
    if (!loginData.last) setPage(page + 1);
  };

  const handleSearch = () => {
    setPage(1);
    // nameFilter, dateFilter 상태 변화에 따라 useEffect가 fetch 실행
  };
  
  const [chatCounts, setChatCounts] = useState([]);

  useEffect(() => {
    const fetchChatCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost/lastWeek");
        if (!res.ok) throw new Error("API 요청 실패");
        const data = await res.json();
        setChatCounts(data);
      } catch (e) {
        setError(e.message || "알 수 없는 에러");
      }
      setLoading(false);
    };

    fetchChatCounts();
  }, []);

  // 날짜 오름차순 정렬 (최근 날짜가 뒤로)
  const sortedData = [...chatCounts].sort(
    (a, b) => new Date(a.statDate).getTime() - new Date(b.statDate).getTime()
  );

  const categories = sortedData.map((item) =>
    new Date(item.statDate).toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    })
  );
  const counts = sortedData.map((item) => item.count || 0);

  const chartOptions = {
    chart: {
      id: "daily-chat-count",
      toolbar: { show: false },
    },
    xaxis: {
      categories: categories,
      title: { text: "날짜" },
    },
    yaxis: {
      title: { text: "대화 수" },
      min: 0,
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "solid",
      colors: ["#33945fff"]
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}건`,
      },
    },
  };

  const chartSeries = [
    {
      name: "대화 수",
      data: counts,
    },
  ];

  return (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto space-y-12">

      {/* 로그인 내역 섹션 */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">👤 사용자 로그인 내역</h1>

          {/* 필터 */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <Input
              type="text"
              placeholder="이름 검색"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSearch}>🔍 검색</Button>
          </div>

          {/* 상태 메시지 */}
          {loading && <div className="text-gray-500">⏳ 로딩 중...</div>}
          {error && <div className="text-red-500">❌ 에러: {error}</div>}
          {!loading && loginData.content.length === 0 && (
            <div className="text-gray-500">⚠️ 검색 결과가 없습니다.</div>
          )}

          {/* 테이블 */}
          {loginData.content.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>로그인 시간</TableHead>
                    <TableHead>로그아웃 시간</TableHead>
                    <TableHead>머문 시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginData.content.map((item) => (
                    <TableRow key={item.historyNo} className="even:bg-gray-50">
                      <TableCell>{item.historyNo}</TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>{new Date(item.loginAt).toLocaleString()}</TableCell>
                      <TableCell>{item.logoutAt ? new Date(item.logoutAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>{calculateSessionDuration(item.loginAt, item.logoutAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="mt-6 flex items-center justify-between">
            <Button onClick={handlePrevPage} disabled={page === 1 || loading}>
              ◀ 이전
            </Button>
            <span className="text-gray-700 font-medium">페이지 {page}</span>
            <Button onClick={handleNextPage} disabled={loginData.last || loading}>
              다음 ▶
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 대화량 통계 섹션 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">💬 최근 7일 대화량 통계</h2>

          {loading && <p className="text-gray-500">📊 로딩 중...</p>}
          {error && <p className="text-red-500">❗ 에러: {error}</p>}

          {!loading && !error && chatCounts.length > 0 && (
            <div className="overflow-x-auto">
              <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

};

export default AdminDashboard;
