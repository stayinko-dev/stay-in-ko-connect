import { ArrowLeft, MessageCircleQuestion, MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Community = () => {
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
          <h1 className="mt-2 text-3xl">커뮤니티</h1>
          <p className="mt-3 text-muted-foreground">
            정보 공유와 Q&A 중심 공간입니다. 유료 요청은 도움 요청 화면으로 분리합니다.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {["지역 게시판", "언어 게시판", "질문답변/후기"].map((item) => (
              <div key={item} className="rounded-xl bg-secondary p-4 text-sm">
                <MessagesSquare className="mb-2 h-4 w-4 text-primary" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border p-4 text-sm text-muted-foreground">
            중복 제거 원칙: 커뮤니티 게시글에서 유료 업무를 직접 접수하지 않고, 도움 요청 페이지로 유도합니다.
          </div>

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/request/new">
                <MessageCircleQuestion className="h-4 w-4" />
                도움 요청 페이지로 이동
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Community;
