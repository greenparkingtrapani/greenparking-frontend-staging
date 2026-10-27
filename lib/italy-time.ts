
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export const ITALY_TIMEZONE = "Europe/Rome";

const compareCalendarDates = (first: Date, second: Date): number => {
  const firstKey = [first.getFullYear(), first.getMonth(), first.getDate()];
  const secondKey = [second.getFullYear(), second.getMonth(), second.getDate()];

  for (let i = 0; i < firstKey.length; i++) {
    if (firstKey[i] !== secondKey[i]) return firstKey[i] > secondKey[i] ? 1 : -1;
  }
  return 0;
};

// Compara componentes de calendario italiano, no instantes Date del navegador.
export const compareItalyDateTime = (
  firstDate: Date,
  firstTime: string,
  secondDate: Date,
  secondTime: string
): number => {
  const dateComparison = compareCalendarDates(firstDate, secondDate);
  if (dateComparison !== 0) return dateComparison;

  const [firstHour, firstMinute] = firstTime.split(":").map(Number);
  const [secondHour, secondMinute] = secondTime.split(":").map(Number);
  return firstHour * 60 + firstMinute - (secondHour * 60 + secondMinute);
};

export const getMinimumExitDate = (
  entryDate: Date | undefined,
  entryTime: string
): Date | undefined => {
  if (!entryDate) return undefined;
  return entryTime === "23:00"
    ? new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + 1)
    : entryDate;
};

//Retorna la fecha y hora actual en Italia, independientemente del lugar desde donde se acceda
export const getCurrentItalyTime = (): Date => {
  const utcNow = new Date();
  return toZonedTime(utcNow, ITALY_TIMEZONE);
};

//Retorna la fecha de hoy en Italia, sin hora
export const getTodayInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  return new Date(
    nowInItaly.getFullYear(),
    nowInItaly.getMonth(),
    nowInItaly.getDate()
  );
};


// Retorna la fecha en italia, pero siempre en 00::00:00
export const getMinSelectableDateInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  const todayInItaly = getTodayInItaly();

  // Si es después de las 23:00 en Italia, la fecha mínima es mañana, la hora siempre será 00:00:00
  if (nowInItaly.getHours() >= 23) {
    return new Date(
      nowInItaly.getFullYear(),
      nowInItaly.getMonth(),
      nowInItaly.getDate() + 1
    );
  }

  return todayInItaly;
};

export const isItalyDateTimeAvailable = (
  date: Date | string,
  time: string
): boolean => {
  const dateStr = date instanceof Date ? format(date, "yyyy-MM-dd") : date;
  const wallTime = `${dateStr}T${time}:00`;
  const utcDate = fromZonedTime(new Date(wallTime), ITALY_TIMEZONE);
  const roundTrip = toZonedTime(utcDate, ITALY_TIMEZONE);

  if (format(roundTrip, "yyyy-MM-dd'T'HH:mm:ss") !== wallTime) return false;

  return ![-60, 60].some((offset) =>
    format(
      toZonedTime(new Date(utcDate.getTime() + offset * 60_000), ITALY_TIMEZONE),
      "yyyy-MM-dd'T'HH:mm:ss"
    ) === wallTime
  );
};

export const getAvailableItalyHours = (date: Date | string): string[] =>
  Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, "0")}:00`).filter(
    (time) => isItalyDateTimeAvailable(date, time)
  );

// Convierte una fecha y hora de Italia a UTC ISO string
export const convertItalyToUTC = (
  date: Date | string,
  time: string
): string => {
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = format(date, "yyyy-MM-dd");
  } else {
    dateStr = date;
  }

  const utcDate = fromZonedTime(new Date(`${dateStr}T${time}:00`), ITALY_TIMEZONE);
  return utcDate.toISOString();
};

// Convierte una fecha UTC ISO string a fecha y hora de Italia
export const convertUTCToItaly = (
  utcDateTime: string
): { date: string; time: string } => {
  //Se usa
  if (!utcDateTime) return { date: "", time: "" };

  // Convertir la fecha UTC a la zona horaria de Italia
  const italyDate = toZonedTime(utcDateTime, ITALY_TIMEZONE);

  return {
    date: format(italyDate, "dd-MM-yyyy"),
    time: format(italyDate, "HH:mm"),
  };
};

//Formatea una fecha UTC para mostrar en la zona horaria de Italia
export const formatDateTimeForDisplay = (
  utcDateTime: string,
  includeTime = true
): string => {
  const { date, time } = convertUTCToItaly(utcDateTime);
  return includeTime ? `${date} ${time}` : date;
};

export const getElapsedHours = (
  startTime: string,
  endTime: string
): number | null => {
  const elapsedHours = (Date.parse(endTime) - Date.parse(startTime)) / 3_600_000;
  if (!Number.isFinite(elapsedHours) || elapsedHours <= 0) return null;
  return Math.floor(elapsedHours);
};
