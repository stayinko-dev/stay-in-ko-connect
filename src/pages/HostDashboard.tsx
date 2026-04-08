import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Home, CalendarDays, TrendingUp, Plus, MapPin, Users, Star,
  DollarSign, ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, ArrowLeft
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockListings = [
  { id: 1, title: "코엑스 근처 모던 원룸", location: "서울 강남구", price: 850000, status: "active", views: 234, rating: 4.8, bookings: 12, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop" },
  { id: 2, title: "해운대 오션뷰 스튜디오", location: "부산 해운대구", price: 650000, status: "active", views: 189, rating: 4.6, bookings: 8, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=150&fit=crop" },
  { id: 3, title: "홍대 아늑한 투룸", location: "서울 마포구", price: 720000, status: "draft", views: 0, rating: 0, bookings: 0, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop" },
];

const mockBookings = [
  { id: 1, guest: "Emily Johnson", listing: "코엑스 근처 모던 원룸", checkIn: "2026-04-15", checkOut: "2026-05-15", status: "confirmed", amount: 850000 },
  { id: 2, guest: "Tanaka Yuki", listing: "해운대 오션뷰 스튜디오", checkIn: "2026-04-20", checkOut: "2026-06-20", status: "pending", amount: 1300000 },
  { id: 3, guest: "David Kim", listing: "코엑스 근처 모던 원룸", checkIn: "2026-05-01", checkOut: "2026-07-31", status: "confirmed", amount: 2550000 },
  { id: 4, guest: "Maria Garcia", listing: "해운대 오션뷰 스튜디오", checkIn: "2026-03-01", checkOut: "2026-03-31", status: "completed", amount: 650000 },
  { id: 5, guest: "Chen Wei", listing: "코엑스 근처 모던 원룸", checkIn: "2026-02-10", checkOut: "2026-03-10", status: "completed", amount: 850000 },
];

const revenueData = {
  totalRevenue: 6200000,
  monthlyRevenue: 2150000,
  prevMonthRevenue: 1500000,
  occupancyRate: 78,
  avgRating: 4.7,
  totalBookings: 24,
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  draft: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  active: "운영중", draft: "임시저장", confirmed: "확정", pending: "대기중", completed: "완료",
};

const formatKRW = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

const HostDashboard = () => {
  const [tab, setTab] = useState("overview");
  const changePercent = Math.round(((revenueData.monthlyRevenue - revenueData.prevMonthRevenue) / revenueData.prevMonthRevenue) * 100);

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
            <h1 className="text-3xl font-bold text-foreground">호스트 대시보드</h1>
            <p className="text-muted-foreground mt-1">숙소를 관리하고 예약 및 수익을 확인하세요</p>
          </div>
          <Button className="gap-2 self-start">
            <Plus className="h-4 w-4" /> 새 숙소 등록
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-1.5"><TrendingUp className="h-4 w-4" /> 수익 현황</TabsTrigger>
            <TabsTrigger value="listings" className="gap-1.5"><Home className="h-4 w-4" /> 내 숙소</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5"><CalendarDays className="h-4 w-4" /> 예약 관리</TabsTrigger>
          </TabsList>

          {/* ───── 수익 현황 ───── */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={DollarSign} label="총 수익" value={formatKRW(revenueData.totalRevenue)} />
              <StatCard
                icon={TrendingUp}
                label="이번 달 수익"
                value={formatKRW(revenueData.monthlyRevenue)}
                badge={changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
                badgeUp={changePercent > 0}
              />
              <StatCard icon={Users} label="총 예약 수" value={`${revenueData.totalBookings}건`} />
              <StatCard icon={Star} label="평균 평점" value={`${revenueData.avgRating} / 5`} />
            </div>

            {/* Monthly breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">월별 수익 요약</CardTitle>
                <CardDescription>최근 6개월 수익 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: "4월 2026", amount: 2150000 },
                    { month: "3월 2026", amount: 1500000 },
                    { month: "2월 2026", amount: 850000 },
                    { month: "1월 2026", amount: 1200000 },
                    { month: "12월 2025", amount: 500000 },
                    { month: "11월 2025", amount: 0 },
                  ].map((m) => (
                    <div key={m.month} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground w-28">{m.month}</span>
                      <div className="flex-1 mx-4 h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(m.amount / 2150000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-32 text-right">{formatKRW(m.amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── 내 숙소 ───── */}
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
                            {statusLabels[l.status]}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {l.location}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">{formatKRW(l.price)} / 월</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {l.views}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {l.bookings}</span>
                        {l.rating > 0 && (
                          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-[hsl(var(--star))]" /> {l.rating}</span>
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

          {/* ───── 예약 관리 ───── */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">예약 목록</CardTitle>
                <CardDescription>모든 예약 내역을 확인하고 관리하세요</CardDescription>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map((b) => (
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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
