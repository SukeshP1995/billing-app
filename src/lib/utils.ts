import { useWritable } from "./use-shared-store";
import { persisted } from "./use-persisted-store";

// place files you want to import through the `$lib` alias in this folder.
export const isType = <Type>(thing: unknown): thing is Type => true;
export type JSONRecord = { [key: string]: JSONObject };
export type JSONObject = boolean | number | string | null | JSONRecord | Array<JSONObject>;

function pad(s: number) { return (s < 10) ? '0' + s : s; }

export function convertDate(inputFormat: number): string {
  const date = new Date(inputFormat);
  return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/');
}

export function formatPrice(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2)
}

export const useBillStore = () => persisted<JSONObject>('bill', {});
