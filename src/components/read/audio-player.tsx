import { component$, useVisibleTask$ } from "@builder.io/qwik";
// import { isServer } from "@builder.io/qwik/build";

// @ts-ignore
import Shikwasa from "shikwasa";
import CONST_URLS from "~/misc/consts/urls";

export const AudioPlayer = component$(({ title, textId }) => {
  // useEffect(() => {
  useVisibleTask$(() => {
    // if (isServer) return;
    new Shikwasa({
      container: () => document.querySelector("#audioContainer"),
      audio: {
        title,
        artist: "Chinese+",
        cover: "1.png",
        src: `${CONST_URLS.textsAudioUrl}636646f0b717c333321c9312.mp3`,
      },
      speedOptions: [0.5, 0.75, 1.25, 1.5, 1.75, 2],
      fixed: {
        type: "static",
        position: "bottom",
      },
      themeColor: "#3498db",
      theme: "dark",
    });
  });
  // }, [title, textId]);

  return <div class='my-2 card  h-36' id='audioContainer'></div>;
});
