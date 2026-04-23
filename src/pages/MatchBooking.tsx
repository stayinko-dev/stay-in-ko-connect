import { ArrowLeft, CalendarCheck2, CheckCircle2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MatchBooking = () => {
  return (
    <main className="min-h-screen bg-gradient-surface py-10">
      <section className="container">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            메인으로 돌아가기
          </Link>
        </Button>

        <div className="mt-4 rounded-2xl border bg-card p-6 shadow-soft">
          <p className="text-xs font-semibold text-primary">STEP 2</p>
          <h1 className="mt-2 text-3xl">매칭/예약</h1>
          <p className="mt-3 text-muted-foreground">
            요청 정보 기반으로 도우미를 추천하고 예약 상태를 관리합니다.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <Star className="mb-2 h-4 w-4 text-primary" />
              추천 기준: 위치, 언어, 가능 시간, 가격, 후기 점수
            </div>
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <CalendarCheck2 className="mb-2 h-4 w-4 text-primary" />
              예약 상태: 요청 접수 - 제안 도착 - 확정 - 완료
            </div>
          </div>

          <div className="mt-6 rounded-xl border p-4 text-sm text-muted-foreground">
            실제 구현 단계에서는 추천 리스트, 채팅, 결제, 일정 확정 컴포넌트를 이 페이지에 붙이면 됩니다.
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            사업 KPI: 유료 매칭 반복률 추적
          </div>
        </div>
      </section>
    </main>
  );
};

export default MatchBooking;
