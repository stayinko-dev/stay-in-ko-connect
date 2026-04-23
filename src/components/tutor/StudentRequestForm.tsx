import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const StudentRequestForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-soft">
      <h2 className="text-2xl font-semibold">무료 매칭 요청</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        학년, 목표, 예산을 남겨주시면 24시간 내 추천 선생님을 보내드립니다.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <Input required name="studentName" placeholder="학생 이름" />
        <Input required name="grade" placeholder="학년 / 수준 (예: 중2, 직장인)" />
        <Input required name="budget" placeholder="예산 (예: 시간당 4만원)" />
        <Textarea
          required
          name="goal"
          placeholder="학습 목표와 희망 시간대를 적어주세요"
          className="min-h-28"
        />
        <Button type="submit" className="w-full md:w-fit">
          매칭 요청 보내기
        </Button>
      </form>

      {isSubmitted && (
        <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          요청이 접수되었습니다. 샘플 단계에서는 화면 확인용 메시지만 표시됩니다.
        </p>
      )}
    </section>
  );
};

export default StudentRequestForm;
