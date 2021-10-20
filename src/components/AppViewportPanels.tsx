import React from "react";

import { LayersPanel } from "./panels/LayersPanel";

import { useApp } from "../Context";

export function AppViewportPanels() {
  const { objects } = useApp();
  return (
    <div className="AppViewportPanels">
      <LayersPanel objects={objects} />
    </div>
  );
}
