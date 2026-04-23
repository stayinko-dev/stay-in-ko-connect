import { Badge } from "@/components/ui/badge";
import type { TutorProfile } from "@/types/tutor";

interface TutorCardProps {
  tutor: TutorProfile;
}

const currency = new Intl.NumberFormat("ko-KR");

const TutorCard = ({ tutor }: TutorCardProps) => {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-soft transition-base hover:shadow-elevated">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{tutor.name}</h3>
          <p className="text-sm text-muted-foreground">{tutor.subject}</p>
        </div>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">★ {tutor.rating}</Badge>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{tutor.intro}</p>

      <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <p className="rounded-lg bg-surface px-3 py-2">{tutor.region}</p>
        <p className="rounded-lg bg-surface px-3 py-2">{tutor.mode}</p>
        <p className="rounded-lg bg-surface px-3 py-2">
          경력 {tutor.experienceYears}년
        </p>
        <p className="rounded-lg bg-surface px-3 py-2 font-medium text-primary">
          시간당 {currency.format(tutor.hourlyRate)}원
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tutor.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export default TutorCard;
