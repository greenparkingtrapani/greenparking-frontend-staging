import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVehicleTypeItalian, getReservationStatusItalian, getPaymentMethodItalian, getPaymentStatusItalian } from "@/hooks/reservations/create/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { convertUTCToItaly } from "@/lib/italy-time";
import { ReservationDashboard } from "@/types/reservation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Bike, Car, Wallet, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export type SortKey =
  | "code"
  | "status"
  | "customer"
  | "vehicle"
  | "payment"
  | "amount"
  | "start"
  | "end";

export type SortDirection = "asc" | "desc";
export type ReservationSort = { key: SortKey; direction: SortDirection } | null;

const sortableHeaders: { key: SortKey; label: string }[] = [
  { key: "code", label: "Codice" },
  { key: "status", label: "Stato" },
  { key: "customer", label: "Cliente" },
  { key: "vehicle", label: "Veicolo" },
  { key: "payment", label: "Pagamento" },
  { key: "amount", label: "Importo" },
  { key: "start", label: "Inizio" },
  { key: "end", label: "Fine" },
];

interface TableDashboardReservationsProps {
  reservations: ReservationDashboard[];
  onCancelReservation: (reservation: ReservationDashboard, refund: boolean) => void;
  // GREENPARKING_DELETE_V1
  onPurgeReservation: (reservation: ReservationDashboard) => void;
  getStatusBadge: (status: string) => string;
  sort: ReservationSort;
  onSortChange: (sort: ReservationSort) => void;
}

export function TableDashboardReservations({
  reservations,
  onCancelReservation,
  onPurgeReservation,
  getStatusBadge,
  sort,
  onSortChange,
}: TableDashboardReservationsProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [refund, setRefund] = useState(false);
  const [purgeCode, setPurgeCode] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState("");

  const handleSort = (key: SortKey) => {
    if (sort?.key !== key) return onSortChange({ key, direction: "asc" });
    if (sort.direction === "asc") return onSortChange({ key, direction: "desc" });
    onSortChange(null);
  };

  return (
    <div className="overflow-x-auto ">
      <Table className="min-w-[900px] md:min-w-[1100px] whitespace-nowrap [&_th]:px-1 [&_td]:px-1 md:[&_th]:px-4 md:[&_td]:px-4">
        <TableHeader>
          <TableRow>
            {sortableHeaders.map(({ key, label }) => {
              const active = sort?.key === key;
              const Icon = active ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <TableHead key={key} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"} className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center text-[10px] md:text-sm p-2 md:p-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-auto p-0 inline-flex justify-center text-center text-[10px] md:text-sm font-medium ${
                      active ? "text-primary font-semibold" : ""
                    }`}
                    onClick={() => handleSort(key)}
                    aria-label={`${label}${active ? `, ordinamento ${sort.direction === "asc" ? "crescente" : "decrescente"}` : ""}`}
                  >
                    {label}
                    <Icon aria-hidden="true" className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
              );
            })}
            <TableHead className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center text-[10px] md:text-sm p-2 md:p-4">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation: ReservationDashboard) => (
            <TableRow key={reservation.code}>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle font-medium text-[10px] md:text-sm p-2 md:p-4">{reservation.code}</TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                <Badge className={getStatusBadge(reservation.status) + ' text-[10px] md:text-sm'}>
                  {getReservationStatusItalian(reservation.status)}
                </Badge>
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">{reservation.user_name}</div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.user_email}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.user_phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">
                    {["motorcycle", "electric_bicycle"].includes(reservation.vehicle_type_name.toLowerCase()) ? (
                      <Bike aria-hidden="true" className="mr-1 inline h-3 w-3 text-vehicle-motorcycle md:h-4 md:w-4" />
                    ) : (
                      <Car aria-hidden="true" className="mr-1 inline h-3 w-3 text-vehicle-car md:h-4 md:w-4" />
                    )}
                    {getVehicleTypeItalian(reservation.vehicle_type_name.toLowerCase())}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.vehicle_plate}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.vehicle_model}
                  </div>
                </div>
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">
                    {reservation.payment_method_name.toLowerCase() === "online" ? (
                      <Wallet aria-hidden="true" className="mr-1 inline h-3 w-3 text-payment-online md:h-4 md:w-4" />
                    ) : (
                      <Coins aria-hidden="true" className="mr-1 inline h-3 w-3 text-payment-onsite md:h-4 md:w-4" />
                    )}
                    {getPaymentMethodItalian(reservation.payment_method_name)}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {getPaymentStatusItalian(reservation.payment_status)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                <div>
                  <div className="font-medium text-reservation-active text-[10px] md:text-sm">
                    â‚¬{(reservation.total_price || 0).toFixed(2)}
                  </div>
                  {reservation.payment_method_id === 1 && reservation.deposit_payment !== undefined ? (
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      <div>SeÃ±a: â‚¬{reservation.deposit_payment.toFixed(2)}</div>
                      <div>Sito: â‚¬{(reservation.total_price - reservation.deposit_payment).toFixed(2)}</div>
                    </div>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                {(() => {
                  const startTimeItaly = convertUTCToItaly(
                    reservation.start_time
                  );
                  return (
                    <div>
                      <div className="text-[10px] md:text-sm font-medium ">
                        {startTimeItaly.date}
                      </div>
                      <div className="text-[10px] md:text-sm text-muted-foreground">
                        {startTimeItaly.time}
                      </div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                {(() => {
                  const endTimeItaly = convertUTCToItaly(reservation.end_time);
                  return (
                    <div>
                      <div className="text-[10px] md:text-sm font-medium ">
                        {endTimeItaly.date}
                      </div>
                      <div className="text-[10px] md:text-sm text-muted-foreground">
                        {endTimeItaly.time}
                      </div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="first:border-l-0 border-l border-border/40 md:border-l-0 text-center align-middle p-2 md:p-4">
                {reservation.status == "active" && (
                  <AlertDialog
                    open={openDialog === reservation.code}
                    onOpenChange={(open) =>
                      setOpenDialog(open ? reservation.code : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="mobile"
                        onClick={() => setOpenDialog(reservation.code)}
                      >
                        Annulla
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Conferma cancellazione
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Vuoi cancellare la prenotazione{" "}
                          <b>{reservation.code}</b>?<br />
                          Seleziona se vuoi rimborsare il cliente:
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {reservation.payment_method_name !== "onsite" && (
                        <div className="flex gap-4 my-4 items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                              id={`refund-switch-${reservation.code}`}
                              checked={refund}
                              onCheckedChange={setRefund}
                            />
                            <span>{refund ? "Rimborsa" : "Non rimborsare"}</span>
                          </label>
                        </div>
                      )}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setOpenDialog(null);
                            onCancelReservation(reservation, refund);
                          }}
                          className="bg-destructive hover:bg-destructive/80"
                        >
                          Conferma
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {/* GREENPARKING_DELETE_V1: do not offer physical deletion for paid bookings */}
                {["pending", "finished", "canceled"].includes(reservation.status) && !reservation.stripe_session_id &&
                  !["succeeded", "refunded", "paid"].includes((reservation.payment_status || "").toLowerCase()) && (
                  <AlertDialog open={purgeCode === reservation.code} onOpenChange={(open) => {
                    setPurgeCode(open ? reservation.code : null);
                    setTypedCode("");
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="outline" size="mobile" className="ml-2 text-destructive border-destructive/50" onClick={() => setPurgeCode(reservation.code)}>
                        Elimina definitivamente
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminazione definitiva</AlertDialogTitle>
                        <AlertDialogDescription>
                          Eliminerai definitivamente la prenotazione {reservation.code}. Non Ã¨ un annullamento e non genera rimborsi.
                          Questa operazione non si puÃ² annullare. Digita il codice per confermare.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <input aria-label="Digita il codice prenotazione" className="w-full rounded border bg-background p-2" value={typedCode} onChange={(e) => setTypedCode(e.target.value.trim())} placeholder={reservation.code} />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction disabled={typedCode !== reservation.code} className="bg-destructive text-destructive-foreground hover:bg-destructive/80" onClick={() => {
                          setPurgeCode(null);
                          setTypedCode("");
                          onPurgeReservation(reservation);
                        }}>Elimina per sempre</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
