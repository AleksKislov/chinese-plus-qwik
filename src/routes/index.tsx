import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div>
      <h1>
        Chinese+ <span class='lightning'>⚡️</span>
      </h1>

      <ul>
        <li>
          Check out the <code>src/routes</code> directory to get started.
        </li>
        <li>
          Add integrations with <code>npm run qwik add</code>.
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>

        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>

        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
        <li>
          More info about development in <code>README.md</code>
        </li>
      </ul>

      <h2>Commands</h2>

      <h2>Add Integrations</h2>

      <h2>Community</h2>

      <ul>
        <li>
          <span>Questions or just want to say hi? </span>
          <a href='https://qwik.builder.io/chat' target='_blank'>
            Chat on discord!
          </a>
        </li>
        <li>
          <span>Follow </span>
          <a href='https://twitter.com/QwikDev' target='_blank'>
            @QwikDev
          </a>
          <span> on Twitter</span>
        </li>
        <li>
          <span>Open issues and contribute on </span>
          <a href='https://github.com/BuilderIO/qwik' target='_blank'>
            GitHub
          </a>
        </li>
        <li>
          <span>Watch </span>
          <a href='https://qwik.builder.io/media/' target='_blank'>
            Presentations, Podcasts, Videos, etc.
          </a>
        </li>
      </ul>
      <Link class='mindblow' href='/flower/'>
        Blow my mind 🤯
      </Link>
    </div>
  );
});

export const head: DocumentHead = {
  title: "ChinesePlus",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
