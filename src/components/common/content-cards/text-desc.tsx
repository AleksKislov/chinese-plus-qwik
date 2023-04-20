import { component$ } from "@builder.io/qwik";

export const TextDesc = component$(({ desc }: { desc: string }) => {
  return (
    <div class='lg:h-20'>
      <div>
        <p>{desc}</p>
      </div>
    </div>
  );
});
