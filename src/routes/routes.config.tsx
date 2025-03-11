import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Login from "@/pages/Login";
import Calendar from "@/pages/Calendar";
import CalendarPage from "@/pages/CalendarPage";
import Production from "@/pages/Production";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Verify from "@/pages/Verify";
import Home from "@/pages/Home";
import ProductionBoard from "@/pages/ProductionBoard";
import ProductionOrderDetails from "@/pages/ProductionOrderDetails";
import NotificationsCenter from "@/pages/NotificationsCenter";
import ClientDetails from "@/pages/ClientDetails";
import Customers from "@/pages/Customers";
import CompanyDetails from "@/pages/CompanyDetails";
import CustomerDetails from "@/pages/CustomerDetails";
import ProductDelivery from "@/pages/ProductDelivery";
import ProductionUpload from "@/pages/ProductionUpload";
import PropertyWebsite from "@/pages/PropertyWebsite";
import Debug from "@/pages/Debug";
import IconTest from "@/pages/IconTest";
import FileDownloads from "@/pages/FileDownloads";
import OrderSinglePage from "@/pages/OrderSinglePage";
import LearningHub from "@/pages/LearningHub";
import GenerateData from "@/pages/GenerateData";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/customers",
    element: <ProtectedRoute><Customers /></ProtectedRoute>,
  },
  {
    path: "/customers/:id",
    element: <ProtectedRoute><CustomerDetails /></ProtectedRoute>,
  },
  {
    path: "/clients/:id",
    element: <ProtectedRoute><ClientDetails /></ProtectedRoute>,
  },
  {
    path: "/companies/:id",
    element: <ProtectedRoute><CompanyDetails /></ProtectedRoute>,
  },
  {
    path: "/orders",
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
  {
    path: "/orders/:id",
    element: <ProtectedRoute><OrderDetails /></ProtectedRoute>,
  },
  {
    path: "/order/:id",
    element: <ProtectedRoute><OrderSinglePage /></ProtectedRoute>,
  },
  {
    path: "/calendar",
    element: <ProtectedRoute><Calendar /></ProtectedRoute>,
  },
  {
    path: "/calendar-page",
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>,
  },
  {
    path: "/production",
    element: <ProtectedRoute><Production /></ProtectedRoute>,
  },
  {
    path: "/production/board",
    element: <ProtectedRoute><ProductionBoard /></ProtectedRoute>,
  },
  {
    path: "/production/order/:id",
    element: <ProtectedRoute><ProductionOrderDetails /></ProtectedRoute>,
  },
  {
    path: "/production/upload/:id",
    element: <ProtectedRoute><ProductionUpload /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/notifications",
    element: <ProtectedRoute><NotificationsCenter /></ProtectedRoute>,
  },
  {
    path: "/delivery/:id",
    element: <ProtectedRoute><ProductDelivery /></ProtectedRoute>,
  },
  {
    path: "/property-website/:id",
    element: <ProtectedRoute><PropertyWebsite /></ProtectedRoute>,
  },
  {
    path: "/debug",
    element: <ProtectedRoute><Debug /></ProtectedRoute>,
  },
  {
    path: "/icons",
    element: <ProtectedRoute><IconTest /></ProtectedRoute>,
  },
  {
    path: "/downloads/:id",
    element: <ProtectedRoute><FileDownloads /></ProtectedRoute>,
  },
  {
    path: "/learning",
    element: <ProtectedRoute><LearningHub /></ProtectedRoute>,
  },
  {
    path: "/generate-data",
    element: <ProtectedRoute><GenerateData /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);
