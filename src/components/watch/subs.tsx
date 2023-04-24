import { component$, type Signal } from "@builder.io/qwik";
import { WordTooltip } from "../common/tooltips/word-tooltip";
import { HideButtons } from "../hsk/hide-buttons";

type SubsProps = {
  hideBtnsSig: Signal<string[]>;
  ru: string;
  py: string;
  main: (string | DictWord)[];
};
export const Subs = component$(({ hideBtnsSig, ru, py, main }: SubsProps) => {
  // const mouseIn = useSignal(0);
  return (
    <>
      <div class='card card-compact w-full bg-neutral mb-3'>
        <div class='card-body items-center text-center'>
          <p>
            {main.map((word, ind) => (
              <WordTooltip key={ind} word={word} />
            ))}
          </p>
          <p>{py}</p>
          <p>{ru}</p>
        </div>
      </div>
      <HideButtons hideBtnsSig={hideBtnsSig} />
    </>
  );
});
