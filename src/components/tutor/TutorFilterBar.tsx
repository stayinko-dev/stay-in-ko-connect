import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LessonMode } from "@/types/tutor";

interface TutorFilterBarProps {
  subject: string;
  region: string;
  mode: LessonMode | "전체";
  onSubjectChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onModeChange: (value: LessonMode | "전체") => void;
}

const TutorFilterBar = ({
  subject,
  region,
  mode,
  onSubjectChange,
  onRegionChange,
  onModeChange,
}: TutorFilterBarProps) => {
  return (
    <section className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-3">
      <Input
        placeholder="과목 검색 (예: 수학, 영어)"
        value={subject}
        onChange={(event) => onSubjectChange(event.target.value)}
      />
      <Input
        placeholder="지역 검색 (예: 강남, 해운대)"
        value={region}
        onChange={(event) => onRegionChange(event.target.value)}
      />
      <Select value={mode} onValueChange={(value) => onModeChange(value as LessonMode | "전체")}>
        <SelectTrigger>
          <SelectValue placeholder="수업 방식" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="전체">전체</SelectItem>
          <SelectItem value="대면">대면</SelectItem>
          <SelectItem value="온라인">온라인</SelectItem>
          <SelectItem value="하이브리드">하이브리드</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
};

export default TutorFilterBar;
