import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Edit2, LogOut, ChevronRight, Heart, CalendarDays, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MyPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "홍길동",
    email: "gildong@example.com",
    phone: "010-1234-5678",
    location: "서울특별시",
  });

  const handleSave = () => {
    // TODO: integrate with Lovable Cloud
    setIsEditing(false);
  };

  const menuItems = [
    { icon: CalendarDays, label: "나의 예약", description: "예약 내역을 확인하세요", href: "#" },
    { icon: Heart, label: "찜한 숙소", description: "관심 숙소를 모아보세요", href: "#" },
    { icon: Settings, label: "계정 설정", description: "비밀번호 및 알림 설정", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl space-y-8">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? "저장" : "편집"}
            </Button>
          </div>

          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{profile.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl shadow-lg border border-border divide-y divide-border">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-8 py-5 hover:bg-accent/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </a>
          ))}
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive rounded-xl py-5">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;
