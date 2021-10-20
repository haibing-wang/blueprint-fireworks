// import React from "react";
import { IconNames } from "@blueprintjs/icons";
import { RGBColor } from "react-color";

import { IconNamesExtras } from "./Icons";
import { ITool } from "./Types";

const SELECT_1_TOOL = { name: "select.1", icon: IconNames.SELECT };

export const DEFAULT_TOOL = SELECT_1_TOOL;
export const DEFAULT_FILL_COLOR: RGBColor = { r: 0, g: 0, b: 0, a: 1 };
export const DEFAULT_STROKE_COLOR: RGBColor = { r: 255, g: 255, b: 255, a: 1 };
export const DEFAULT_STROKE_SIZE = 1;

export const groups: ITool[] = [
  {
    name: "select",
    title: "Select",
    tools: [
      SELECT_1_TOOL,
      { name: "select.2", icon: IconNames.SELECT },
      { name: "select.3", icon: IconNames.NEW_TEXT_BOX },
      { name: "select.4", icon: IconNames.NEW_TEXT_BOX }
    ]
  },
  {
    name: "bitmap",
    title: "Bitmap",
    tools: [
      { name: "bitmap.lasso", icon: IconNamesExtras.LASSO },
      { name: "bitmap.lasso.polygon", icon: IconNamesExtras.POLYGON_LASSO },
      { name: "bitmap.magic_wand", icon: IconNamesExtras.MAGIC_WAND },
      { name: "bitmap.fill_brush", icon: IconNamesExtras.FILL_BRUSH },
      { name: "bitmap.draw_pixel", icon: IconNamesExtras.DRAW_PIXEL },
      { name: "bitmap.eraser", icon: IconNamesExtras.ERASER },
      { name: "bitmap.select1", icon: IconNames.NEW_TEXT_BOX },
      { name: "bitmap.select2", icon: IconNames.NEW_TEXT_BOX }
    ]
  },
  {
    name: "vector",
    title: "Vector",
    tools: [
      { name: "vector.draw.line", icon: IconNamesExtras.DRAW_LINE },
      { name: "vector.draw", icon: IconNames.DRAW },
      {
        name: "vector.draw.shape",
        icon: IconNamesExtras.DRAW_RECTANGLE,
        tools: [
          { name: "vector.draw.shape.triangle", icon: IconNamesExtras.DRAW_TRIANGLE, title: "Triangle" },
          { name: "vector.draw.shape.rectangle", icon: IconNamesExtras.DRAW_RECTANGLE, title: "Rectangle" },
          { name: "vector.draw.shape.ellipse", icon: IconNamesExtras.DRAW_ELLIPSE, title: "Ellipse" },
          { name: "vector.draw.shape.polygon", icon: IconNamesExtras.DRAW_POLYGON, title: "Polygon" },
          null,
          { name: "vector.draw.shape.arrow", icon: IconNames.ARROW_RIGHT, title: "Arrow" },
          { name: "vector.draw.shape.spiral", icon: IconNamesExtras.DRAW_SPIRAL, title: "Spiral" },
          { name: "vector.draw.shape.star", icon: IconNamesExtras.DRAW_STAR, title: "Star" }
        ]
      },
      { name: "vector.draw.text", icon: IconNamesExtras.DRAW_TEXT },
      { name: "vector.draw.freehand", icon: IconNamesExtras.DRAW_FREEHAND },
      { name: "vector.knife", icon: IconNamesExtras.KNIFE }
    ]
  },
  {
    name: "web",
    title: "Web",
    tools: [
      { name: "web.1", icon: IconNames.NEW_TEXT_BOX },
      { name: "web.2", icon: IconNames.NEW_TEXT_BOX },
      { name: "web.3", icon: IconNames.NEW_TEXT_BOX },
      { name: "web.4", icon: IconNames.NEW_TEXT_BOX }
    ]
  },
  {
    name: "colors",
    title: "Colors",
    tools: [
      { name: "colors.1", icon: IconNamesExtras.COLOR_PICKER },
      { name: "colors.2", icon: IconNamesExtras.COLOR_FILL },
      { name: "colors.3", icon: IconNames.NEW_TEXT_BOX },
      { name: "colors.4", icon: IconNames.NEW_TEXT_BOX },
      { name: "colors.5", icon: IconNames.NEW_TEXT_BOX },
      { name: "colors.6", icon: IconNames.NEW_TEXT_BOX }
    ]
  },
  {
    name: "view",
    title: "View",
    tools: [
      { name: "view.1", icon: IconNames.TH },
      { name: "view.2", icon: IconNames.LIST_COLUMNS },
      { name: "view.3", icon: IconNames.LIST },
      { name: "view.4", icon: IconNames.HAND }
    ]
  }
];

const extractToolsMap = (items: (ITool | null)[]) => {
  let toolsMap: { [key: string]: { tool: ITool; parent?: ITool } } = {};
  const tools = items.reduce((acc, group) => {
    if (!group) {
      return acc;
    }
    if (group.tools) {
      group.tools.forEach((tool) => {
        if (tool) {
          const { name, tools } = tool;
          acc[name] = { tool, parent: group };
          if (tools) {
            const subtools = extractToolsMap(tools);
            acc = { ...toolsMap, ...subtools };
          }
        }
      });
    } else {
      acc[group.name] = { tool: group, parent: undefined };
    }
    return acc;
  }, toolsMap);
  return tools;
};

export const tools = extractToolsMap(groups);
