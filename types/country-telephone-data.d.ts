declare module "country-telephone-data" {
  const countryData: {
    allCountries: Array<{
      name: string;
      dialCode: string;
      iso2: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  export default countryData;
}
