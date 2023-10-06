import { component$ } from "@builder.io/qwik";
import MenuLink from "./menu-link";
import type { MenuLinkProps } from "./menu-link";
import { dropdownArrowBottom } from "../../media/svg";

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

export default component$(({ links, name }: MenuItemProps) => {
  return (
    <li tabIndex={0} class='dropdown dropdown-hover'>
      <label>
        {name}
        {dropdownArrowBottom}
      </label>
      <ul class='dropdown-content menu shadow bg-neutral rounded-box p-2 w-52 z-40'>
        {links.map((link, ind) => (
          <MenuLink href={link.href} text={link.text} key={ind} />
        ))}
      </ul>
    </li>
  );
});
