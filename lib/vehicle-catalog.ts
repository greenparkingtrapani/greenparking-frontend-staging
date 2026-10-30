// Initial curated catalogue; lengths are indicative and vary by year/trim.
// No licensed model photography has been added yet. Optional imageUrl supports
// future original/licensed assets. Existing backend keeps vehicleModel as text.
export type CatalogVehicle = {
  kind: "car" | "motorcycle";
  brand: string;
  model: string;
  category: string;
  length: number;
  imageUrl?: string;
};

export const vehicleCatalog: CatalogVehicle[] = [
  {
    "kind": "car",
    "brand": "Fiat",
    "model": "Panda",
    "category": "car",
    "length": 3.69
  },
  {
    "kind": "car",
    "brand": "Fiat",
    "model": "500",
    "category": "car",
    "length": 3.57
  },
  {
    "kind": "car",
    "brand": "Fiat",
    "model": "Tipo",
    "category": "sedan",
    "length": 4.37
  },
  {
    "kind": "car",
    "brand": "Fiat",
    "model": "600",
    "category": "suv",
    "length": 4.17
  },
  {
    "kind": "car",
    "brand": "Fiat",
    "model": "500X",
    "category": "suv",
    "length": 4.27
  },
  {
    "kind": "car",
    "brand": "Volkswagen",
    "model": "Polo",
    "category": "car",
    "length": 4.07
  },
  {
    "kind": "car",
    "brand": "Volkswagen",
    "model": "Golf",
    "category": "sedan",
    "length": 4.28
  },
  {
    "kind": "car",
    "brand": "Volkswagen",
    "model": "T-Roc",
    "category": "suv",
    "length": 4.24
  },
  {
    "kind": "car",
    "brand": "Volkswagen",
    "model": "Tiguan",
    "category": "suv",
    "length": 4.51
  },
  {
    "kind": "car",
    "brand": "Toyota",
    "model": "Yaris",
    "category": "car",
    "length": 3.94
  },
  {
    "kind": "car",
    "brand": "Toyota",
    "model": "Corolla",
    "category": "sedan",
    "length": 4.37
  },
  {
    "kind": "car",
    "brand": "Toyota",
    "model": "RAV4",
    "category": "suv",
    "length": 4.6
  },
  {
    "kind": "car",
    "brand": "Renault",
    "model": "Clio",
    "category": "car",
    "length": 4.05
  },
  {
    "kind": "car",
    "brand": "Renault",
    "model": "Captur",
    "category": "suv",
    "length": 4.23
  },
  {
    "kind": "car",
    "brand": "Renault",
    "model": "Megane",
    "category": "sedan",
    "length": 4.36
  },
  {
    "kind": "car",
    "brand": "Ford",
    "model": "Fiesta",
    "category": "car",
    "length": 4.04
  },
  {
    "kind": "car",
    "brand": "Ford",
    "model": "Focus",
    "category": "sedan",
    "length": 4.38
  },
  {
    "kind": "car",
    "brand": "Ford",
    "model": "Puma",
    "category": "suv",
    "length": 4.19
  },
  {
    "kind": "car",
    "brand": "Peugeot",
    "model": "208",
    "category": "car",
    "length": 4.06
  },
  {
    "kind": "car",
    "brand": "Peugeot",
    "model": "308",
    "category": "sedan",
    "length": 4.37
  },
  {
    "kind": "car",
    "brand": "Peugeot",
    "model": "2008",
    "category": "suv",
    "length": 4.3
  },
  {
    "kind": "car",
    "brand": "Opel",
    "model": "Corsa",
    "category": "car",
    "length": 4.06
  },
  {
    "kind": "car",
    "brand": "Opel",
    "model": "Astra",
    "category": "sedan",
    "length": 4.37
  },
  {
    "kind": "car",
    "brand": "BMW",
    "model": "Serie 1",
    "category": "sedan",
    "length": 4.32
  },
  {
    "kind": "car",
    "brand": "BMW",
    "model": "Serie 3",
    "category": "sedan",
    "length": 4.71
  },
  {
    "kind": "car",
    "brand": "BMW",
    "model": "X3",
    "category": "suv",
    "length": 4.71
  },
  {
    "kind": "car",
    "brand": "Mercedes-Benz",
    "model": "Classe A",
    "category": "sedan",
    "length": 4.42
  },
  {
    "kind": "car",
    "brand": "Mercedes-Benz",
    "model": "Classe C",
    "category": "sedan",
    "length": 4.75
  },
  {
    "kind": "car",
    "brand": "Mercedes-Benz",
    "model": "GLA",
    "category": "suv",
    "length": 4.41
  },
  {
    "kind": "car",
    "brand": "Audi",
    "model": "A3",
    "category": "sedan",
    "length": 4.34
  },
  {
    "kind": "motorcycle",
    "brand": "Honda",
    "model": "SH 125",
    "category": "scooter",
    "length": 2.09
  },
  {
    "kind": "motorcycle",
    "brand": "Honda",
    "model": "Forza 350",
    "category": "maxi-scooter",
    "length": 2.15
  },
  {
    "kind": "motorcycle",
    "brand": "Honda",
    "model": "CB500F",
    "category": "naked",
    "length": 2.08
  },
  {
    "kind": "motorcycle",
    "brand": "Honda",
    "model": "Shadow 600",
    "category": "custom",
    "length": 2.35
  },
  {
    "kind": "motorcycle",
    "brand": "Honda",
    "model": "Africa Twin",
    "category": "adventure",
    "length": 2.33
  },
  {
    "kind": "motorcycle",
    "brand": "Yamaha",
    "model": "MT-07",
    "category": "naked",
    "length": 2.09
  },
  {
    "kind": "motorcycle",
    "brand": "Yamaha",
    "model": "Ténéré 700",
    "category": "adventure",
    "length": 2.37
  },
  {
    "kind": "motorcycle",
    "brand": "Yamaha",
    "model": "XMAX 300",
    "category": "maxi-scooter",
    "length": 2.19
  },
  {
    "kind": "motorcycle",
    "brand": "Yamaha",
    "model": "Drag Star 650",
    "category": "custom",
    "length": 2.45
  },
  {
    "kind": "motorcycle",
    "brand": "Ducati",
    "model": "Monster",
    "category": "naked",
    "length": 2.11
  },
  {
    "kind": "motorcycle",
    "brand": "Ducati",
    "model": "Multistrada V4",
    "category": "adventure",
    "length": 2.35
  },
  {
    "kind": "motorcycle",
    "brand": "Aprilia",
    "model": "Tuareg 660",
    "category": "adventure",
    "length": 2.22
  },
  {
    "kind": "motorcycle",
    "brand": "Aprilia",
    "model": "RS 660",
    "category": "sport",
    "length": 2
  },
  {
    "kind": "motorcycle",
    "brand": "BMW",
    "model": "R 1250 GS",
    "category": "adventure",
    "length": 2.21
  },
  {
    "kind": "motorcycle",
    "brand": "BMW",
    "model": "R 18",
    "category": "custom",
    "length": 2.44
  },
  {
    "kind": "motorcycle",
    "brand": "Harley-Davidson",
    "model": "Sportster 883",
    "category": "custom",
    "length": 2.25
  },
  {
    "kind": "motorcycle",
    "brand": "Harley-Davidson",
    "model": "Fat Boy",
    "category": "custom",
    "length": 2.37
  },
  {
    "kind": "motorcycle",
    "brand": "Kawasaki",
    "model": "Z650",
    "category": "naked",
    "length": 2.06
  },
  {
    "kind": "motorcycle",
    "brand": "Piaggio",
    "model": "Beverly 300",
    "category": "maxi-scooter",
    "length": 2.11
  },
  {
    "kind": "motorcycle",
    "brand": "Triumph",
    "model": "Bonneville T120",
    "category": "custom",
    "length": 2.17
  }
];

export const categoryLabels: Record<string, Record<string,string>> = {
  it: { car: "Utilitaria", sedan: "Berlina", suv: "SUV", naked: "Naked", custom: "Custom / Cruiser", adventure: "Adventure / Enduro", sport: "Sportiva", scooter: "Scooter", "maxi-scooter": "Maxi scooter" },
  en: { car: "Compact car", sedan: "Sedan", suv: "SUV", naked: "Naked", custom: "Custom / Cruiser", adventure: "Adventure", sport: "Sport bike", scooter: "Scooter", "maxi-scooter": "Maxi scooter" },
  es: { car: "Utilitario", sedan: "Berlina", suv: "SUV", naked: "Naked", custom: "Custom / Cruiser", adventure: "Adventure", sport: "Deportiva", scooter: "Scooter", "maxi-scooter": "Maxi scooter" },
};
