// Menú principal del sitio. Editar aquí para cambiar la navegación.
export type MenuItem = { label: string; href: string };

export const MENU: MenuItem[] = [
  { label: "Noticias", href: "/" },
  { label: "Reseñas", href: "/categoria/resenas/" },
  { label: "Motores", href: "/categoria/motores/" },
  { label: "Tecnología", href: "/categoria/tecnologia/" },
];

export const LOGO_SRC = "/assets/uploads/2023/03/motorslogo.svg";
export const SITE_NAME = "Revista Motors";
