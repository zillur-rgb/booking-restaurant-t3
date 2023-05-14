import { categories } from "~/constants/config";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const selectOptions = categories.map((cat) => ({
  value: cat,
  Label: capitalize(cat),
}));
