// Map vehicle types to Italian (Admin)
export const VEHICLE_TYPE_IT_MAP: Record<string, string> = {
  car: "Auto",
  motorcycle: "Motocicletta",
  sedan: "Berlina", suv: "SUV", electric_bicycle: "Bicicletta elettrica",
};

export function getVehicleTypeItalian(name: string): string {
  return VEHICLE_TYPE_IT_MAP[name] || name;
}

// Mapa para traducir estado de reserva a italiano (Admin)
export const RESERVATION_STATUS_IT_MAP: Record<string, string> = {
  active: "Attiva",
  pending: "In attesa",
  finished: "Completata",
  canceled: "annullata",
};

export function getReservationStatusItalian(status: string): string {
  return RESERVATION_STATUS_IT_MAP[status] || status;
}

// Mapa para traducir método de pago a italiano (Admin)
export const PAYMENT_METHOD_IT_MAP: Record<string, string> = {
  online: "In linea",
  onsite: "In loco",
};

export function getPaymentMethodItalian(method: string): string {
  return PAYMENT_METHOD_IT_MAP[method.toLowerCase()] || method;
}

// Mapa para traducir estado de pago a italiano (Admin)
export const PAYMENT_STATUS_IT_MAP: Record<string, string> = {
  succeeded: "riuscita",
  refunded: "Rimborsata",
  pending: "In attesa di",
};

export function getPaymentStatusItalian(status: string): string {
  return PAYMENT_STATUS_IT_MAP[status] || status;
}

export const VEHICLE_TYPE_ID_TO_KEY_MAP: Record<number, string> = {
  1: "car",
  2: "motorcycle",
};

export const PAYMENT_METHOD_ID_TO_KEY_MAP: Record<number, string> = {
  1: "payOnSite", // Pago en sitio
  2: "payOnline", // Pago online
};

// Función helper para obtener la clave de traducción desde el ID del tipo de vehículo (Se usa)
export const getVehicleTypeKeyFromId = (vehicleTypeId: number): string => {
  return VEHICLE_TYPE_ID_TO_KEY_MAP[vehicleTypeId] || "-";
};

// Función helper para obtener la clave de traducción del método de pago desde el ID (Se usa)
export const getPaymentMethodKeyFromId = (paymentMethodId: number): string => {
  return PAYMENT_METHOD_ID_TO_KEY_MAP[paymentMethodId] || "-";
};

export const RESERVATION_DURATIONS = ["hour", "daily"] as const;

// Función para mapear ReservationDashboard a MappedReservation
import { ReservationDashboard, MappedReservation } from "@/types/reservation";
import { convertUTCToItaly } from "@/lib/italy-time";

export function mapReservationToPresentable(data: ReservationDashboard): MappedReservation {
  const startDateTime = convertUTCToItaly(data.start_time);
  const endDateTime = convertUTCToItaly(data.end_time);
  
  return {
    code: data.code,
    firstName: data.user_name?.split(" ")[0] || "",
    lastName: data.user_name?.split(" ").slice(1).join(" ") || "",
    email: data.user_email,
    vehicleType: data.vehicle_type_name || getVehicleTypeKeyFromId(data.vehicle_type_id),
    entryDate: startDateTime.date,
    entryTime: startDateTime.time,
    exitDate: endDateTime.date,
    exitTime: endDateTime.time,
    licensePlate: data.vehicle_plate,
    vehicleModel: data.vehicle_model,
    paymentMethod: getPaymentMethodKeyFromId(data.payment_method_id),
    totalPrice: data.total_price,
    depositPayment: data.deposit_payment || undefined,
    paymentMethodId: data.payment_method_id,
  };
}

