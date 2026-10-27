import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryOption } from "@/types/reservation";

interface ClientInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate: string;
  vehicleModel: string;
  selectedCountry: CountryOption;
  setSelectedCountry: (country: CountryOption) => void;
  countryOptions: CountryOption[];
  isNameValid: (name: string) => boolean;
  isEmailValid: (email: string) => boolean;
  isPhoneValid: (phone: string) => boolean;
  onChange: (
    field:
      | "firstName"
      | "lastName"
      | "email"
      | "phone"
      | "licensePlate"
      | "vehicleModel",
    value: string
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched?: {
    licensePlate?: boolean;
    vehicleModel?: boolean;
  };
}

export function ClientInfoForm({
  firstName,
  lastName,
  email,
  phone,
  licensePlate,
  vehicleModel,
  selectedCountry,
  setSelectedCountry,
  countryOptions,
  isNameValid,
  isEmailValid,
  isPhoneValid,
  onChange,
  onBlur,
  touched,
}: ClientInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div>
          <Label htmlFor="firstName" className="text-xs md:text-sm">
            Nome
          </Label>
          <Input
            id="firstName"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || isNameValid(value)) {
                onChange("firstName", value);
              }
            }}
            className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
          />
          {!isNameValid(firstName) && firstName && (
            <span className="text-xs md:text-sm text-destructive mt-1 block">
              Inserisci un nome valido (solo lettere)
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="text-xs md:text-sm">
            Cognome
          </Label>
          <Input
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || isNameValid(value)) {
                onChange("lastName", value);
              }
            }}
            className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
          />
          {!isNameValid(lastName) && lastName && (
            <span className="text-xs md:text-sm text-destructive mt-1 block">
              Inserisci un cognome valido (solo lettere)
            </span>
          )}
        </div>
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="email" className="text-xs md:text-sm">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3 w-full"
          />
          {!isEmailValid(email) && email && (
            <span className="text-xs md:text-sm text-destructive mt-1 block">
              Inserisci una email valida
            </span>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="phone" className="text-xs md:text-sm">
          Numero di Telefono
        </Label>
        <div className="flex gap-1 md:gap-2">
          <Select
            name="phone"
            value={selectedCountry.iso2}
            onValueChange={(iso2) => {
              const found = countryOptions.find((c) => c.iso2 === iso2);
              if (found) setSelectedCountry(found);
            }}
          >
            <SelectTrigger
              id="country_code"
              name="country_code"
              className="w-14 md:w-20 min-w-0 h-8 md:h-10 text-xs md:text-sm px-1 md:px-2"
            >
              <SelectValue>{`+${selectedCountry.dialCode}`}</SelectValue>
            </SelectTrigger>
            <SelectContent className="text-xs md:text-sm max-h-56 md:max-h-80">
              {countryOptions.map((option) => (
                <SelectItem key={option.iso2} value={option.iso2}>
                  {option.name} (+{option.dialCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              onChange("phone", value);
            }}
            className="flex-1 min-w-0 h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
          />
        </div>
        {!isPhoneValid(phone) && phone && (
          <span className="text-xs md:text-sm text-destructive mt-1 block">
            Numero non valido (minimo 7 cifre, solo numeri)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-4 pt-4 border-t">
        <div>
          <Label htmlFor="licensePlate" className="text-xs md:text-sm">
            Targa
          </Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            required
            value={licensePlate}
            onChange={(e) => onChange("licensePlate", e.target.value)}
            onBlur={onBlur}
            className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
          />
          {touched?.licensePlate && !licensePlate && (
            <span className="text-xs md:text-sm text-destructive mt-1 block">
              Devi inserire la targa
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="vehicleModel" className="text-xs md:text-sm">
            Modello Veicolo
          </Label>
          <Input
            id="vehicleModel"
            name="vehicleModel"
            required
            value={vehicleModel}
            onChange={(e) => onChange("vehicleModel", e.target.value)}
            onBlur={onBlur}
            className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
          />
          {touched?.vehicleModel && !vehicleModel && (
            <span className="text-xs md:text-sm text-destructive mt-1 block">
              Devi inserire il modello del veicolo
            </span>
          )}
        </div>
      </div>
    </>
  );
}
