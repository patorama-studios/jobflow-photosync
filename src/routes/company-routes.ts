
import { RouteObject } from "react-router-dom";

export const companyRoutes: RouteObject[] = [
  {
    path: "/companies/:id",
    lazy: async () => {
      const { CompanyDetails } = await import("../pages/CompanyDetails");
      return { Component: CompanyDetails };
    }
  }
];
