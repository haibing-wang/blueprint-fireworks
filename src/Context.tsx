import { createContext, useContext } from "react";

import { Fill, Stroke, Geometry, Metadata, ITool, CanvasInteractionMode } from "./Types";
import { DEFAULT_TOOL, DEFAULT_FILL_COLOR, DEFAULT_STROKE_COLOR, DEFAULT_STROKE_SIZE } from "./Tools";

export interface ContextState {
  objects: any[];
  metadata: Metadata;
  geometry: Geometry;
  fill: Fill;
  stroke: Stroke;
  currentTool: ITool;
  currentMode: CanvasInteractionMode;
}

export type ContextType = {
  setMetadata: (metadata: Metadata) => void;
  setGeometry: (geo: Geometry) => void;
  setFill: (fill: Fill) => void;
  setStroke: (stroke: Stroke) => void;
  setCurrentTool: (tool: ITool) => void;
  setCurrentMode: (mode: CanvasInteractionMode) => void;
  setMerged: (state: Partial<ContextState>) => void;
  addObject: (obj: any) => void;
  rmvObject: (obj: any) => void;
} & ContextState;

export const Context = createContext<ContextType>({
  objects: [],
  metadata: {
    generator: "",
    shape: ""
  },
  geometry: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  fill: {
    color: DEFAULT_FILL_COLOR
  },
  stroke: {
    color: DEFAULT_STROKE_COLOR,
    size: DEFAULT_STROKE_SIZE
  },
  setMetadata: (metadata: Metadata) => console.warn("No metadata", metadata),
  setGeometry: (geo: Geometry) => console.warn("No geometry", geo),
  setFill: (fill: Fill) => console.warn("No fill", fill),
  setStroke: (stroke: Stroke) => console.warn("No stroke", stroke),
  //
  currentTool: DEFAULT_TOOL,
  setCurrentTool: (tool: ITool) => console.warn("No tool", tool),
  //
  currentMode: CanvasInteractionMode.SELECT,
  setCurrentMode: (mode: CanvasInteractionMode) => console.warn("No mode", mode),
  setMerged: (state: Partial<ContextState>) => console.warn("No state", state),
  // objects
  addObject: (obj: any) => console.warn("No add", obj),
  rmvObject: (obj: any) => console.warn("No rmv", obj)
});
export const useApp = () => useContext(Context);
