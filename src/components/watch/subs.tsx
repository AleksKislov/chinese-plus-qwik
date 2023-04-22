import { component$, type Signal } from "@builder.io/qwik";
import { HideButtons } from "../hsk/hide-buttons";

type SubsProps = {
  hideBtnsSig: Signal<string[]>;
};
export const Subs = component$(({ hideBtnsSig }: SubsProps) => {
  // const mouseIn = useSignal(0);
  return (
    <>
      <div class='card card-compact w-full bg-neutral mb-3'>
        <div class='card-body items-center text-center'>
          <p>сабы</p>
          <p>сабы</p>
          <p>сабы</p>
        </div>
      </div>
      <HideButtons hideBtnsSig={hideBtnsSig} />
    </>
  );
});
