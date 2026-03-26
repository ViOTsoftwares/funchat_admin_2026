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
    label: "Projects",
    subMenu: [
      { label: "All Testimonial", path: "/testimonial" },
      { label: "All Projects", path: "/projects" },
      { label: "All Products", path: "/products" },
      { label: "All Blogs", path: "/blogs" },
    ],
  },
  {
    label: "Settings",
    subMenu: [
      { label: "CMS", path: "/cms" },
      { label: "Site Content", path: "/settings" },
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
