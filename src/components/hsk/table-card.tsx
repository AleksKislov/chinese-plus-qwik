import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { CardInfo } from "./card-info";
import CONSTANTS from "~/misc/consts/consts";
import type { HskLvlSizeMap } from "~/misc/consts/consts";
export const hskInfo = CONSTANTS.hskInfo;

type TabelCardProps = {
  level: string;
  isOldHsk: boolean;
  isForTests: boolean;
};

export const TableCard = component$(({ level, isOldHsk, isForTests }: TabelCardProps) => {
  const infoToUse: HskLvlSizeMap = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;

  const levels = Object.keys(infoToUse);
  const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

  const rmHyphen = (str: string): string => str.replaceAll("-", "");
  return (
    <div class='card bg-primary-focus text-primary-content'>
      <div class='card-body'>
        <CardInfo isForTests={isForTests} isOldHsk={isOldHsk} />

        <ul class='menu rounded-box bg-primary'>
          {levels.map((lvl) => (
            <li class={level === lvl ? "active bg-primary-focus" : ""} key={lvl}>
              <Link class='flex' href={`?lvl=${rmHyphen(lvl)}&pg=0`}>
                <span class='flex-1'>
                  {isOldHsk ? "HSK " : "Band "} {lvl}
                </span>
                <span class='badge bg-warning text-warning-content'>{infoToUse[lvl]}</span>
              </Link>
            </li>
          ))}
          <li>
            <div class='flex'>
              <span class='text-success flex-1'>Всего слов </span>
              <span class='badge bg-warning text-warning-content'>{allWordsNum}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
});
