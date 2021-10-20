import React from "react";
import { Card, Elevation, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { BlendModePicker } from "./pickers/BlendModePicker";
import { FilterPicker } from "./pickers/FilterPicker";

import "./EffectsPanel.css";

export function EffectsPanel() {
  return (
    <Card className="ShapePanel EffectsPanel" elevation={Elevation.ZERO}>
      <Icon icon={IconNames.CONTRAST} />
      <div className="ShapePanelContent">
        <BlendModePicker />
        <FilterPicker />
      </div>
    </Card>
  );
}
