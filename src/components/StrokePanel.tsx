import React from "react";
import { Card, Elevation, Icon } from "@blueprintjs/core";

import { IconNamesExtras } from "../Icons";
import { ColorStylePicker, ColorStyleResult } from "./pickers/ColorStylePicker";
import { EdgeStylePicker } from "./pickers/EdgeStylePicker";
import { TextureStylePicker } from "./pickers/TextureStylePicker";
import { RectangleRoundnessPicker } from "./pickers/RectangleRoundnessPicker";

import { Stroke } from "../Types";
import { useApp } from "../Context";

import "./StrokePanel.css";

export function StrokePanel() {
  const { stroke, setStroke } = useApp();
  const onChange = (e: ColorStyleResult) => {
    const userValue: Stroke = { color: e.color, size: e.size };
    setStroke(userValue);
  };
  return (
    <Card className="ShapePanel StrokePanel" elevation={Elevation.ZERO}>
      <Icon icon={IconNamesExtras.DRAW_PIXEL} />
      <div className="ShapePanelContent">
        <ColorStylePicker color={stroke.color} size={stroke.size} onChange={onChange} withSize />
        <EdgeStylePicker />
        <TextureStylePicker />
        <RectangleRoundnessPicker />
      </div>
    </Card>
  );
}
