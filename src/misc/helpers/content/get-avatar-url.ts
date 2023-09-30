export const getAvatarUrl = (avatarUrl: string): string => {
  // avatarUrl = "//avatars.dicebear.com/api/avataaars/w3wji.svg?skin[]=pale&mouth[]=twinkle&clothes[]=blazer&clothesColor[]=heather&accessoriesChance=100&accessories[]=kurt&accessoriesColor[]=white&topChance=100&top[]=hat&hatColor[]=heather&style=circle"

  const dicebear = "//avatars.dicebear.com/api/avataaars/w3wji.svg";
  const dicebearHttps = "";
  const newUrl = avatarUrl.replace(dicebear, dicebearHttps);

  const url = new URL(newUrl, "https://api.dicebear.com/7.x/avataaars/svg");
  url.searchParams.forEach((_val, name) => {
    // @todo hack! change later
    if (name.includes("Color[]")) url.searchParams.set(name, "123123");
  });

  return url.toString();
};
