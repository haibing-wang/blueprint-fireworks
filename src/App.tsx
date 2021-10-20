import React, { useCallback, useState } from "react";
import { Classes } from "@blueprintjs/core";
import { fabric } from "fabric";

import { Fill, Stroke, Metadata, Geometry, ITool, CanvasInteractionMode } from "./Types";
import { ContextState, Context, ContextType, useApp } from "./Context";
import { AppViewportPanels } from "./components/AppViewportPanels";
import { AppViewportSidebar } from "./components/AppViewportSidebar";
import { AppHeader } from "./components/AppHeader";
import { AppFooter } from "./components/AppFooter";
import { DEFAULT_FILL_COLOR, DEFAULT_STROKE_COLOR, DEFAULT_STROKE_SIZE, DEFAULT_TOOL } from "./Tools";
import { Canvas, DocumentElement } from "./Canvas";

import "./App.css";

function AppContent() {
  const { fill, stroke, currentMode, currentTool, setGeometry, setMerged, objects, addObject } = useApp();
  const onToolChange = useCallback(
    (tool: ITool) => {
      let mode = CanvasInteractionMode.DRAW;
      if (tool.name.indexOf("select") === 0) {
        mode = CanvasInteractionMode.SELECT;
      }
      setMerged({ currentTool: tool, currentMode: mode });
    },
    [setMerged]
  );
  const onModeSwitch = useCallback(
    (mode: CanvasInteractionMode) => {
      setMerged({ currentTool: mode === CanvasInteractionMode.SELECT ? DEFAULT_TOOL : currentTool, currentMode: mode });
    },
    [currentTool, setMerged]
  );
  const onObjectChanged = useCallback(
    (opt: DocumentElement) => {
      let merged: Partial<ContextState> = {
        geometry: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        metadata: {
          generator: "canvas",
          shape: "Canvas"
        },
        fill: { color: DEFAULT_FILL_COLOR },
        stroke: { color: DEFAULT_STROKE_COLOR, size: DEFAULT_STROKE_SIZE }
      };
      if (opt && opt.target) {
        const { target } = opt;
        merged = {
          geometry: {
            x: target.left || 0,
            y: target.top || 0,
            width: (target.width || 0) * (target.scaleX || 1),
            height: (target.height || 0) * (target.scaleY || 1)
          },
          metadata: {
            ...merged.metadata,
            generator: "selection",
            shape: "Selection"
          },
          fill: {
            ...merged.fill,
            ...opt.fill
          },
          stroke: {
            ...merged.stroke,
            ...opt.stroke
          }
        };
      }
      setMerged(merged);
    },
    [setMerged]
  );
  const onResize = useCallback(
    (canvas: fabric.Canvas) => {
      setGeometry({
        x: 0,
        y: 0,
        width: canvas.getWidth(),
        height: canvas.getHeight()
      });
    },
    [setGeometry]
  );
  const onObjectAdded = useCallback(
    (opt: any) => {
      addObject(opt);
    },
    [addObject]
  );
  // console.debug({ currentMode, currentTool });
  return (
    <div className="AppContent">
      <div className="AppViewport">
        <AppViewportSidebar onToolChange={onToolChange} />
        <div className="AppViewportDocument">
          <Canvas
            mode={currentMode}
            tool={currentTool}
            fill={fill}
            stroke={stroke}
            onReady={onResize}
            onResize={onResize}
            onModeSwitch={onModeSwitch}
            onObjectChanged={onObjectChanged}
            onObjectAdded={onObjectAdded}
            objects={objects}
          />
        </div>
        <AppViewportPanels />
      </div>
    </div>
  );
}

interface AppProps {}

function AppContainer() {
  return (
    <div className="AppContainer">
      <AppHeader />
      <AppContent />
      <AppFooter />
    </div>
  );
}

function AppView() {
  return (
    <div className={`${Classes.DARK} App`}>
      <AppContainer />
    </div>
  );
}

export default function App(props: AppProps) {
  const [state, setState] = useState<ContextState>({
    objects: [],
    metadata: {
      generator: "canvas",
      shape: "Canvas"
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
    currentTool: DEFAULT_TOOL,
    currentMode: CanvasInteractionMode.SELECT
  });
  const context: ContextType = {
    ...state,
    setFill: (fill: Fill) => setState((prev) => ({ ...prev, fill })),
    setStroke: (stroke: Stroke) => setState((prev) => ({ ...prev, stroke })),
    setMetadata: (metadata: Metadata) => setState((prev) => ({ ...prev, metadata })),
    setGeometry: (geometry: Geometry) => setState((prev) => ({ ...prev, geometry })),
    setCurrentTool: (currentTool: ITool) => setState((prev) => ({ ...prev, currentTool })),
    setCurrentMode: (currentMode: CanvasInteractionMode) => setState((prev) => ({ ...prev, currentMode })),
    setMerged: (user: Partial<ContextState>) => setState((prev) => ({ ...prev, ...user })),
    addObject: (obj: any) => setState((prev) => ({ ...prev, objects: prev.objects.concat(obj) })),
    rmvObject: (obj: any) => {}
  };
  return (
    <Context.Provider value={context}>
      <AppView />
    </Context.Provider>
  );
}
