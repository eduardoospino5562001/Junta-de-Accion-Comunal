import { DashBoard } from "@/components/svg";
import { Heroicon } from "@/components/svg";
import { User } from "@/components/svg";

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
    {
      title: "Administración",
      icon: DashBoard,
      href: "/administracion",
    },
    {
      title: "Propiedades",
      icon: DashBoard,
      href: "/propiedades",
    },
    {
      title: "Finanzas",
      icon: DashBoard,
      href: "/finanzas",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "Administración",
        icon: DashBoard,
        child: [
          {
            title: "Comites",
            href: "/administracion/usuarios",
          },
          
        ]
      },
      {
        title: "Propiedades",
        icon: DashBoard,
        child: [
          {
            title: "Propiedades",
            href: "/propiedades/propiedades",
          },
          {
            title: "Tipos de Propiedades",
            href: "/propiedades/tipos-de-propiedades",
          },
          {
            title: "Características",
            href: "/propiedades/caracteristicas",
          },
          {
            title: "Servicios",
            href: "/propiedades/servicios",
          },
        ]
      },
      {
        title: "Finanzas",
        icon: DashBoard,
        child: [
          {
            title: "Cuentas",
            href: "/finanzas/cuentas",
          },
          {
            title: "Transacciones",
            href: "/finanzas/transacciones",
          },
        ]
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "Administración",
        icon: User,
        child: [
          {
            title: "Comites",
            href: "/usuariospage",
          },
          
        ]
      },
      {
        title: "Propietarios",
        icon: Heroicon,
        child: [
          {
            title: "Propietarios",
            href: "/propiedades/propiedades",
          },
          {
            title: "Arrendatarios",
            href: "/propiedades/tipos-de-propiedades",
          },
          {
            title: "Propiedades",
            href: "/propiedades/caracteristicas",
          },
        ]
      },
      {
        title: "Finanzas",
        icon: DashBoard,
        child: [
          {
            title: "Tarifas",
            href: "/finanzas/cuentas",
          },
          {
            title: "Pagos",
            href: "/finanzas/transacciones",
          },
        ]
      },
    ],
  },
};
