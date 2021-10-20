import { RGBColor } from "react-color";

export interface IPoint {
  x: number;
  y: number;
}

export interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Fill {
  color: RGBColor;
}

export interface Stroke {
  color: RGBColor;
  size: number;
}

export interface Metadata {
  generator: string;
  shape: string;
}

export interface ITool {
  name: string;
  title?: string;
  icon?: any;
  tools?: (ITool | null)[];
  default?: boolean;
}

export enum CanvasInteractionMode {
  SELECT = "mode.select",
  DRAW = "mode.draw"
}
