import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Events, News, Company } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Supplier from "./pages/dashboard/Supplier";
import { HiBuildingOffice } from "react-icons/hi2";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Events",
        path: "/events",
        element: <Events />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "News",
        path: "/news",
        element: <News />,
      },
      {
        icon: <HiBuildingOffice {...icon} />,
        name: "Company",
        path: "/company",
        element: <Company />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Supplier",
        path: "/supplier",
        element: <Supplier />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign out",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
