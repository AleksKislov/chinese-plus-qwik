import { component$ } from "@builder.io/qwik";
import MenuLink from "./menu-link";
import type { MenuLinkProps } from "./menu-link";

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

export default component$(({ links, name }: MenuItemProps) => {
  return (
    <li tabIndex={0} class='dropdown dropdown-hover'>
      <label>
        {name}
        <svg
          class='fill-current'
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
        >
          <path d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' />
        </svg>
      </label>
      <ul class='dropdown-content menu shadow bg-neutral rounded-box p-2'>
        {links.map((link, ind) => (
          <MenuLink href={link.href} text={link.text} key={ind} />
        ))}
      </ul>
    </li>
  );
});
