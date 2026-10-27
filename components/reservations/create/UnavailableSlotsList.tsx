import { AlertCircleIcon } from "lucide-react";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { convertUTCToItaly } from "@/lib/italy-time";
import { Slot } from "@/types/reservation";

interface UnavailableSlotsListProps {
  slotDetails: Slot[];
  t: (key: string) => string;
}

function groupConsecutiveUnavailable(slots: Slot[]) {
  const unavailable = slots.filter((s) => !s.is_available);
  if (!unavailable.length) return [];
  return unavailable.reduce<{ start_time: string; end_time: string }[]>(
    (groups, slot, i) => {
      if (i === 0) {
        groups.push({ start_time: slot.start_time, end_time: slot.end_time });
      } else {
        const last = groups[groups.length - 1];
        if (
          new Date(slot.start_time).getTime() ===
          new Date(last.end_time).getTime()
        ) {
          last.end_time = slot.end_time;
        } else {
          groups.push({ start_time: slot.start_time, end_time: slot.end_time });
        }
      }
      return groups;
    },
    []
  );
}

const UnavailableSlotsList: React.FC<UnavailableSlotsListProps> = ({
  slotDetails,
  t,
}) => {
  const unavailableGroups = groupConsecutiveUnavailable(slotDetails);
  if (!unavailableGroups.length) return null;

  return (
    <Alert
      variant="default"
      className="mt-5 border-destructive/40 bg-destructive/5"
    >
      <AlertCircleIcon className="h-5 w-5 text-destructive" />
      <AlertDescription className="text-foreground">
        <ul className="space-y-1">
          {unavailableGroups.map((group, index) => {
            const start = convertUTCToItaly(group.start_time);
            const end = convertUTCToItaly(group.end_time);

            return (
              <React.Fragment key={`unavailable-${index}`}>
                {index > 0 && <hr className="my-1 border-border" />}
                <li className="flex items-center justify-between gap-3 rounded-md py-2 text-sm">
                  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span className="text-muted-foreground">{start.date}</span>
                    <span className="font-semibold text-foreground">{start.time}</span>
                    <span className="text-muted-foreground">–</span>
                    <span className="text-muted-foreground">{end.date}</span>
                    <span className="font-semibold text-foreground">{end.time}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                    {t("unavailable")}
                  </span>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default UnavailableSlotsList;
