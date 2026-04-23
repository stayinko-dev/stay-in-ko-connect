import { AlertTriangle, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SafetyTrust = () => {
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
          <p className="text-xs font-semibold text-primary">MODULE</p>
          <h1 className="mt-2 text-3xl">검증/안전</h1>
          <p className="mt-3 text-muted-foreground">
            사업화 리스크를 줄이기 위한 검증과 운영 정책 화면입니다.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <UserCheck className="mb-2 h-4 w-4 text-primary" />
              도우미 검증: 본인인증, 언어검증, 교육, 후기 기반 신뢰 점수
            </div>
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <ShieldCheck className="mb-2 h-4 w-4 text-primary" />
              운영 안전: 신고/분쟁 처리, 비상연락, 블랙리스트 관리
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
              <p>
                법적 안정성 원칙: 플랫폼은 중개/결제/평판관리 중심 역할을 유지하고, 의료행위/법률자문/금융대리
                같은 고위험 업무는 범위에서 제외합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SafetyTrust;
