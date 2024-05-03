import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Events, Company } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Supplier from "./pages/dashboard/Supplier";
import { HiBuildingOffice } from "react-icons/hi2";
import Emergency from "./pages/dashboard/Emergency";
import Component from "./pages/dashboard/Component";
import Discount from "./pages/dashboard/Discount";
import Banner from "./pages/dashboard/Banner";
import { FaShoppingCart } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import { BiSolidComponent } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { PiFlagBannerFill } from "react-icons/pi";
import Home from "./pages/dashboard/Home";
import Service from "./pages/dashboard/Service";
import { RiCustomerServiceFill } from "react-icons/ri";

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
        name: "News & Events",
        path: "/events",
        element: <Events />,
      },
      {
        icon: <HiBuildingOffice {...icon} />,
        name: "Company",
        path: "/company",
        element: <Company />,
      },
      {
        icon: <MdDiscount {...icon} />,
        name: "Discount",
        path: "/discount",
        element: <Discount />,
      },
      {
        icon: <IoLogoFirebase {...icon} />,
        name: "Emergency",
        path: "/emergency",
        element: <Emergency />,
      },
      {
        icon: <BiSolidComponent {...icon} />,
        name: "Component",
        path: "/component",
        element: <Component />,
      },
      {
        icon: <PiFlagBannerFill {...icon} />,
        name: "Banner",
        path: "/banner",
        element: <Banner />,
      },
      {
        icon: <FaShoppingCart {...icon} />,
        name: "Supplier",
        path: "/supplier",
        element: <Supplier />,
      },
      {
        icon: <RiCustomerServiceFill {...icon} />,
        name: "Service",
        path: "/service",
        element: <Service />,
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
