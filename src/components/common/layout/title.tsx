import { component$ } from "@builder.io/qwik";

export const PageTitle = component$(({ txt }: { txt: string }) => {
  return (
    <div class='prose mb-3'>
      <h1>{txt}</h1>
    </div>
  );
});
