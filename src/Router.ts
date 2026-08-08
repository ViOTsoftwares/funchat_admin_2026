export interface SubMenu {
  label: string;
  path: string;
}

export interface Menu {
  label: string;
  path?: string;
  subMenu?: SubMenu[];
}
export const menuList: Menu[] = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Content",
    subMenu: [
      { label: "All Testimonial", path: "/testimonial" },
      { label: "All Blogs", path: "/blogs" },
    ],
  },
  {
    label: "Communities",
    subMenu: [
      { label: "Categories", path: "/community-category" },
      { label: "Groups", path: "/community-group" },
    ],
  },
  {
    label: "Marketing",
    subMenu: [
      { label: "Advertisements", path: "/ads" },
    ],
  },
  {
    label: "Settings",
    subMenu: [
      { label: "CMS", path: "/cms" },
      { label: "Site Content", path: "/settings" },
      { label: "Email Templates", path: "/email-template" },
    ],
  },
  {
    label: "Admin Controller",
    subMenu: [
      { label: "Admin", path: "/admin" },
      { label: "Modules", path: "/module" },
    ],
  },
];
