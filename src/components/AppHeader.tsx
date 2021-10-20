import React from "react";

import { AppMenu } from "./AppMenu";
import { AppToolbar } from "./AppToolbar";

import "./AppHeader.css";

export const AppHeader = () => {
  return (
    <div className="AppHeader">
      <AppMenu />
      <AppToolbar />
    </div>
  );
};
