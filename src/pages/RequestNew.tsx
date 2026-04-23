import { ArrowLeft, ArrowRight, Clock3, Globe2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RequestNew = () => {
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
          <p className="text-xs font-semibold text-primary">STEP 1</p>
          <h1 className="mt-2 text-3xl">도움 요청 생성</h1>
          <p className="mt-3 text-muted-foreground">
            MVP 범위는 서울/수도권, 영어/한국어, 병원 동행·관공서 동행·집보기/이사보조입니다.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <MapPin className="mb-2 h-4 w-4 text-primary" />
              지역: 서울/수도권
            </div>
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <Globe2 className="mb-2 h-4 w-4 text-primary" />
              언어: 영어/한국어
            </div>
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <Clock3 className="mb-2 h-4 w-4 text-primary" />
              일정/예산 입력
            </div>
          </div>

          <div className="mt-6 rounded-xl border p-4 text-sm text-muted-foreground">
            실제 구현 단계에서는 이 영역에 요청 폼(서비스 종류, 날짜/시간, 예산, 상세 설명, 위치)을 연결하면
            됩니다.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="gradient">
              <Link to="/match">
                매칭/예약으로 이동
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/community">커뮤니티 먼저 보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RequestNew;
