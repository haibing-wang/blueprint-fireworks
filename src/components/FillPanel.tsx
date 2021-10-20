import React from "react";
import { Card, Elevation, Icon } from "@blueprintjs/core";

import { IconNamesExtras } from "../Icons";
import { ColorStylePicker, ColorStyleResult } from "./pickers/ColorStylePicker";
import { EdgeStylePicker } from "./pickers/EdgeStylePicker";
import { TextureStylePicker } from "./pickers/TextureStylePicker";
import { TransparentPicker } from "./pickers/TransparentPicker";

import { Fill } from "../Types";
import { useApp } from "../Context";

import "./FillPanel.css";

export function FillPanel() {
  const { fill, setFill } = useApp();
  const onChange = (e: ColorStyleResult) => {
    const userValue: Fill = { color: e.color };
    setFill(userValue);
  };
  return (
    <Card className="ShapePanel FillPanel" elevation={Elevation.ZERO}>
      <Icon icon={IconNamesExtras.COLOR_FILL} />
      <div className="ShapePanelContent">
        <ColorStylePicker color={fill.color} onChange={onChange} />
        <EdgeStylePicker />
        <TextureStylePicker />
        <TransparentPicker />
      </div>
    </Card>
  );
}
