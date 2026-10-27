import { getElapsedHours } from "@/lib/italy-time";

interface ReservationDurationProps {
  startTime: string;
  endTime: string;
  label: string;
  unit: string;
}

export default function ReservationDuration({
  startTime,
  endTime,
  label,
  unit,
}: ReservationDurationProps) {
  const duration = getElapsedHours(startTime, endTime);
  if (duration === null) return null;

  return (
    <div className="rounded-md border border-border p-3">
      <span className="text-sm font-medium text-muted-foreground">{label}: </span>
      <span className="text-sm font-semibold text-primary">{duration} {unit}</span>
    </div>
  );
}
