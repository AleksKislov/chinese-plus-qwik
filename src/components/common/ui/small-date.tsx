import { component$ } from "@builder.io/qwik";
import { dateToStr } from "~/misc/helpers/tools";

type SmallDateProps = { date: string; onlyDate: boolean };

export const SmallDate = component$(({ date, onlyDate }: SmallDateProps) => {
  return <small class={"text-neutral-500 ml-1"}>{dateToStr(date, onlyDate)}</small>;
});
