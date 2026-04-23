import { ArrowRight, CheckCircle2, CircleDot, Globe2, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mainEntryCards = [
  {
    id: "request",
    path: "/request/new",
    title: "도움 요청",
    description: "병원 동행, 관공서 동행, 집보기/이사보조를 즉시 요청합니다.",
    tag: "유료 매칭 핵심",
  },
  {
    id: "match",
    path: "/match",
    title: "매칭/예약",
    description: "위치, 언어, 시간, 가격, 후기 기반으로 도우미를 자동 추천합니다.",
    tag: "요청과 예약 통합",
  },
  {
    id: "community",
    path: "/community",
    title: "커뮤니티",
    description: "지역별/언어별 게시판에서 질문답변과 후기 공유를 진행합니다.",
    tag: "정보 공유 허브",
  },
  {
    id: "safety",
    path: "/safety",
    title: "검증/안전",
    description: "본인인증, 언어검증, 후기, 블랙리스트로 신뢰도를 관리합니다.",
    tag: "사업 리스크 방어",
  },
] as const;

const duplicateCleanup = [
  {
    before: "도움 요청 + 예약/매칭이 분리되어 중복 흐름 발생",
    after: "도움 요청 생성 시 동일 화면에서 매칭 후보와 예약까지 연결",
  },
  {
    before: "커뮤니티 후기와 매칭 후기의 저장 위치가 분산",
    after: "후기는 단일 리뷰 도메인으로 통합하고 노출 위치만 분기",
  },
  {
    before: "언어 게시판과 통역 요청 게시판이 유사 기능으로 중복",
    after: "게시판은 정보 공유만, 통역은 도움 요청 폼으로 단일화",
  },
] as const;

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-surface">
      <section className="border-b bg-gradient-hero">
        <div className="container py-16">
          <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Korea Help Community - Business Ready MVP
          </p>
          <h1 className="max-w-4xl text-4xl leading-tight md:text-5xl">
            한국 생활이 낯선 외국인을 위해
            <span className="text-primary"> 도움 요청, 매칭, 커뮤니티를 메인페이지에서 바로 연결</span>합니다
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">
            PDF 제안 내용을 기준으로 기능 중복을 제거했습니다. 정보형 커뮤니티와 유료 매칭 흐름을 분리하되,
            사용자는 메인페이지에서 한 번에 진입할 수 있게 구조화했습니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-card px-3 py-2 shadow-soft">서울/수도권 한정 MVP</span>
            <span className="rounded-full bg-card px-3 py-2 shadow-soft">영어 + 한국어</span>
            <span className="rounded-full bg-card px-3 py-2 shadow-soft">병원/관공서/집보기 3종</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gradient">
              <Link to="/request/new">
                지금 도움 요청하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/community">커뮤니티 바로가기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainEntryCards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className="group rounded-2xl border bg-card p-5 shadow-soft transition-base hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <p className="text-xs font-semibold text-primary">{card.tag}</p>
              <h2 className="mt-2 text-xl">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                바로 이동
                <ArrowRight className="ml-1 h-4 w-4 transition-base group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="request" className="container pb-8">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-2xl">1) 도움 요청</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                고빈도/고불편 업무를 먼저 처리하도록 설계합니다. 현재 MVP는 병원 동행, 관공서 동행,
                집보기/이사보조만 받습니다.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {["지역: 서울/수도권", "언어: 영어/한국어", "서비스: 3종", "예산/시간 입력"].map((item) => (
              <div key={item} className="rounded-xl bg-secondary p-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="match" className="container pb-8">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <Globe2 className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-2xl">2) 매칭/예약</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                도움 요청 이후 별도 메뉴 이동 없이 후보 도우미를 추천하고, 바로 예약 상태까지 연결합니다.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["추천 기준: 위치/언어/시간/가격/후기", "예약 상태: 요청 접수 → 제안 도착 → 확정 → 완료"].map((item) => (
              <div key={item} className="rounded-xl bg-secondary p-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="container pb-8">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <CircleDot className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-2xl">3) 커뮤니티</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정보 공유는 커뮤니티에서 해결하고, 실제 유료 도움은 요청 플로우로 유도해 기능 역할을 분리합니다.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["지역 게시판", "언어 게시판", "질문답변/후기"].map((item) => (
              <div key={item} className="rounded-xl bg-secondary p-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="safety" className="container pb-8">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-2xl">4) 검증/안전</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                본인인증, 프로필 검증, 리뷰, 비상연락, 블랙리스트를 운영해 플랫폼 신뢰를 확보합니다.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["도우미 검증: 본인인증/언어검증/교육 이수", "안전 운영: 신고/분쟁처리/비상연락"].map((item) => (
              <div key={item} className="rounded-xl bg-secondary p-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="text-2xl">중복 기능 제거 결과</h3>
          </div>
          <div className="mt-4 space-y-3">
            {duplicateCleanup.map((row) => (
              <div key={row.before} className="rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Before: {row.before}</p>
                <p className="mt-1 text-sm font-medium">After: {row.after}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            법적 안정성을 위해 도우미는 독립 사업자/프리랜서 구조로 운영하고, 플랫폼은 결제, 매칭, 평판관리
            중심 역할로 제한하는 것을 기본 원칙으로 둡니다.
          </div>
          <div className="mt-4 flex items-start gap-2 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
            MVP 목표: 커뮤니티 활성화보다 먼저 유료 매칭 반복 여부를 검증
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
