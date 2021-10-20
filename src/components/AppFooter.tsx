import React from "react";

import { GeometryPanel } from "./GeometryPanel";
import { FillPanel } from "./FillPanel";
import { StrokePanel } from "./StrokePanel";
import { EffectsPanel } from "./EffectsPanel";

import "./AppFooter.css";

export function AppFooter() {
  return (
    <div className="AppFooter">
      <h1>Properties</h1>
      <div className="AppFooterViewport">
        <GeometryPanel />
        <FillPanel />
        <StrokePanel />
        <EffectsPanel />
      </div>
    </div>
  );
}
