import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Home, CalendarDays, TrendingUp, Plus, MapPin, Users, Star,
  DollarSign, ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, ArrowLeft,
  MessageCircle, Send, CreditCard, UserCircle, CheckCircle, XCircle, Clock,
  ShieldCheck, Award, BarChart3, Building2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingWizard from "@/components/ListingWizard";
import { toast } from "sonner";

/* ── Mock Data ── */
const mockListings = [
  { id: 1, title: "코엑스 근처 모던 원룸", location: "서울 강남구", price: 850000, status: "occupied", views: 234, rating: 4.8, bookings: 12, tenant: "Emily Johnson", tenantSince: "2026-01-15", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop" },
  { id: 2, title: "해운대 오션뷰 스튜디오", location: "부산 해운대구", price: 650000, status: "available", views: 189, rating: 4.6, bookings: 8, tenant: null, tenantSince: null, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=150&fit=crop" },
  { id: 3, title: "홍대 아늑한 투룸", location: "서울 마포구", price: 720000, status: "pending", views: 45, rating: 0, bookings: 0, tenant: null, tenantSince: null, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop" },
];

const mockBookings = [
  { id: 1, guest: "Emily Johnson", listing: "코엑스 근처 모던 원룸", checkIn: "2026-04-15", checkOut: "2026-05-15", status: "pending", amount: 850000 },
  { id: 2, guest: "Tanaka Yuki", listing: "해운대 오션뷰 스튜디오", checkIn: "2026-04-20", checkOut: "2026-06-20", status: "pending", amount: 1300000 },
  { id: 3, guest: "David Kim", listing: "코엑스 근처 모던 원룸", checkIn: "2026-05-01", checkOut: "2026-07-31", status: "confirmed", amount: 2550000 },
  { id: 4, guest: "Maria Garcia", listing: "해운대 오션뷰 스튜디오", checkIn: "2026-03-01", checkOut: "2026-03-31", status: "completed", amount: 650000 },
  { id: 5, guest: "Chen Wei", listing: "코엑스 근처 모던 원룸", checkIn: "2026-02-10", checkOut: "2026-03-10", status: "rejected", amount: 850000 },
];

const mockMessages = [
  { id: 1, from: "Emily Johnson", avatar: "EJ", lastMessage: "안녕하세요, 세탁기 사용법 좀 알려주세요!", time: "10분 전", unread: true },
  { id: 2, from: "Tanaka Yuki", avatar: "TY", lastMessage: "체크인 시간 변경 가능할까요?", time: "1시간 전", unread: true },
  { id: 3, from: "David Kim", avatar: "DK", lastMessage: "감사합니다! 좋은 하루 되세요.", time: "어제", unread: false },
  { id: 4, from: "Maria Garcia", avatar: "MG", lastMessage: "리뷰 남겼습니다 :)", time: "3일 전", unread: false },
];

const chartData = [
  { month: "11월", revenue: 0 },
  { month: "12월", revenue: 500000 },
  { month: "1월", revenue: 1200000 },
  { month: "2월", revenue: 850000 },
  { month: "3월", revenue: 1500000 },
  { month: "4월", revenue: 2150000 },
];

const statusColors: Record<string, string> = {
  occupied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-muted text-muted-foreground",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  occupied: "입주중", available: "공실", pending: "대기중",
  confirmed: "승인", completed: "완료", rejected: "거절",
};

const formatKRW = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

const HostDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Record<number, { text: string; from: "host" | "guest" }[]>>({
    1: [{ text: "안녕하세요, 세탁기 사용법 좀 알려주세요!", from: "guest" }],
    2: [{ text: "체크인 시간 변경 가능할까요?", from: "guest" }],
    3: [{ text: "감사합니다! 좋은 하루 되세요.", from: "guest" }],
    4: [{ text: "리뷰 남겼습니다 :)", from: "guest" }],
  });
  const [showWizard, setShowWizard] = useState(false);

  const handleBookingAction = (id: number, action: "confirmed" | "rejected") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: action } : b))
    );
    toast.success(action === "confirmed" ? "예약이 승인되었습니다" : "예약이 거절되었습니다");
  };

  const sendChat = () => {
    if (!chatMessage.trim() || selectedChat === null) return;
    setChatHistory((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), { text: chatMessage, from: "host" }],
    }));
    setChatMessage("");
    toast.success("메시지를 전송했습니다");
  };

  const monthlyRevenue = 2150000;
  const prevMonthRevenue = 1500000;
  const changePercent = Math.round(((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <a href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" /> 홈으로
            </a>
            <h1 className="text-3xl font-bold text-foreground font-display">호스트 대시보드</h1>
            <p className="text-muted-foreground mt-1 font-body">숙소를 관리하고 예약 및 수익을 확인하세요</p>
          </div>
          <Button className="gap-2 self-start" onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4" /> 새 숙소 등록
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="h-4 w-4" /> 수익 현황</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5"><CalendarDays className="h-4 w-4" /> 예약 관리</TabsTrigger>
            <TabsTrigger value="listings" className="gap-1.5"><Home className="h-4 w-4" /> 내 매물</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5"><MessageCircle className="h-4 w-4" /> 메시지</TabsTrigger>
            <TabsTrigger value="settlement" className="gap-1.5"><CreditCard className="h-4 w-4" /> 정산</TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5"><UserCircle className="h-4 w-4" /> 프로필</TabsTrigger>
          </TabsList>

          {/* ───── 수익 현황 ───── */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={DollarSign} label="월 수익" value={formatKRW(monthlyRevenue)} badge={`+${changePercent}%`} badgeUp />
              <StatCard icon={Building2} label="활성 매물" value="3개" />
              <StatCard icon={Clock} label="신규 요청" value={`${bookings.filter((b) => b.status === "pending").length}건`} />
              <StatCard icon={Star} label="평균 평점" value="4.7 / 5" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">월별 수익 차트</CardTitle>
                <CardDescription>최근 6개월 수익 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₩${(v / 10000).toFixed(0)}만`} />
                    <Tooltip formatter={(v: number) => formatKRW(v)} labelStyle={{ color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="revenue" name="수익" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── 예약 관리 ───── */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">예약 요청</CardTitle>
                <CardDescription>승인 또는 거절하여 예약을 관리하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>게스트</TableHead>
                      <TableHead className="hidden sm:table-cell">숙소</TableHead>
                      <TableHead>체크인</TableHead>
                      <TableHead className="hidden md:table-cell">체크아웃</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.guest}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{b.listing}</TableCell>
                        <TableCell>{b.checkIn}</TableCell>
                        <TableCell className="hidden md:table-cell">{b.checkOut}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatKRW(b.amount)}</TableCell>
                        <TableCell className="text-right">
                          {b.status === "pending" ? (
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleBookingAction(b.id, "confirmed")}>
                                <CheckCircle className="h-3 w-3" /> 승인
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleBookingAction(b.id, "rejected")}>
                                <XCircle className="h-3 w-3" /> 거절
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── 내 매물 ───── */}
          <TabsContent value="listings">
            <div className="grid gap-4">
              {mockListings.map((l) => (
                <Card key={l.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <img src={l.image} alt={l.title} className="w-full sm:w-48 h-36 object-cover" />
                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{l.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[l.status]}`}>
                            {statusLabels[l.status] || l.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {l.location}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">{formatKRW(l.price)} / 월</p>
                        {l.tenant && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Users className="h-3 w-3" /> 세입자: {l.tenant} (입주: {l.tenantSince})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {l.views}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {l.bookings}</span>
                        {l.rating > 0 && (
                          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-star fill-star" /> {l.rating}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3.5 w-3.5" /> 수정</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ───── 메시지 ───── */}
          <TabsContent value="messages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
              {/* Message list */}
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">받은 메시지</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {mockMessages.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedChat(m.id)}
                      className={`w-full text-left px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors ${
                        selectedChat === m.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {m.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{m.from}</span>
                            <span className="text-xs text-muted-foreground">{m.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{m.lastMessage}</p>
                        </div>
                        {m.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Chat area */}
              <Card className="md:col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    <CardHeader className="pb-3 border-b border-border">
                      <CardTitle className="text-base">
                        {mockMessages.find((m) => m.id === selectedChat)?.from}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {(chatHistory[selectedChat] || []).map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === "host" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                            msg.from === "host"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-4 border-t border-border flex gap-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      />
                      <Button size="icon" onClick={sendChat}><Send className="h-4 w-4" /></Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    왼쪽에서 대화를 선택해주세요
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* ───── 정산 설정 ───── */}
          <TabsContent value="settlement">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> 은행 계좌 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">은행명</label>
                    <Input defaultValue="신한은행" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">계좌번호</label>
                    <Input defaultValue="110-***-***890" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">예금주</label>
                    <Input defaultValue="홍길동" />
                  </div>
                  <Button className="w-full">저장</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> 사업자 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">사업자 등록번호</label>
                    <Input defaultValue="123-45-67890" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">대표자명</label>
                    <Input defaultValue="홍길동" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">정산일</label>
                    <Input defaultValue="매월 15일" />
                  </div>
                  <Button className="w-full">저장</Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">최근 정산 내역</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>정산일</TableHead>
                        <TableHead>기간</TableHead>
                        <TableHead className="text-right">금액</TableHead>
                        <TableHead className="text-right">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2026-04-15</TableCell>
                        <TableCell>3월 정산</TableCell>
                        <TableCell className="text-right font-medium">₩1,500,000</TableCell>
                        <TableCell className="text-right"><Badge variant="secondary">완료</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2026-03-15</TableCell>
                        <TableCell>2월 정산</TableCell>
                        <TableCell className="text-right font-medium">₩850,000</TableCell>
                        <TableCell className="text-right"><Badge variant="secondary">완료</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ───── 호스트 프로필 ───── */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <UserCircle className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">홍길동</h3>
                    <p className="text-sm text-muted-foreground">호스트 since 2025</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0 gap-1">
                      <Award className="h-3 w-3" /> 슈퍼호스트
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-0 gap-1">
                      <ShieldCheck className="h-3 w-3" /> 인증완료
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">호스트 성과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground font-display">96%</p>
                      <p className="text-xs text-muted-foreground mt-1">응답률</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground font-display">92%</p>
                      <p className="text-xs text-muted-foreground mt-1">승인율</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground font-display">4.7</p>
                      <p className="text-xs text-muted-foreground mt-1">평균 평점</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground font-display">1시간</p>
                      <p className="text-xs text-muted-foreground mt-1">평균 응답 시간</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">획득 뱃지</h4>
                    <div className="flex flex-wrap gap-2">
                      {["슈퍼호스트", "빠른응답", "친절호스트", "청결관리", "인기매물"].map((badge) => (
                        <Badge key={badge} variant="outline" className="gap-1 text-xs">
                          <Award className="h-3 w-3 text-primary" /> {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Listing Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">새 매물 등록</DialogTitle>
          </DialogHeader>
          <ListingWizard
            onClose={() => setShowWizard(false)}
            onSubmit={() => {
              setShowWizard(false);
              toast.success("매물이 등록되었습니다! 🎉");
            }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, badge, badgeUp }: {
  icon: React.ElementType; label: string; value: string; badge?: string; badgeUp?: boolean;
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {badge && (
          <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${badgeUp ? "text-emerald-600" : "text-destructive"}`}>
            {badgeUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {badge}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default HostDashboard;
