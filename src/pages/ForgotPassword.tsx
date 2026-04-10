import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoImg from "@/assets/logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with Lovable Cloud auth
    console.log("Password reset requested for", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/">
            <img src={logoImg} alt="StayInKo" className="h-14 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold font-display text-foreground">비밀번호 찾기</h1>
          <p className="mt-2 text-muted-foreground">
            가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-5">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full text-base py-5 rounded-xl">
                재설정 링크 보내기
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">이메일을 확인해주세요</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{email}</span>으로 비밀번호 재설정 링크를 보냈습니다.
                메일함을 확인해주세요.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setSubmitted(false)}
              >
                다른 이메일로 다시 시도
              </Button>
            </div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
