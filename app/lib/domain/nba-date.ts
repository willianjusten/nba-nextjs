// A calendar day in America/New_York, formatted YYYY-MM-DD. The NBA groups games by this date.
export type NbaDate = string & { readonly __brand: "NbaDate" };
