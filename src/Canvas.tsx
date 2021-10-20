import React, { createRef, PureComponent, useEffect } from "react";
import { fabric } from "fabric";
import { v4 } from "uuid";
import { RGBColor } from "react-color";

import { IPoint, ITool, CanvasInteractionMode, Fill, Stroke, Metadata } from "./Types";
import useWindowSize from "./hooks/useWidnowSize";

export interface ICanvas {
  canvas: fabric.Canvas;
}

interface CanvasDrawingProps {
  objects: any[];
  mode: CanvasInteractionMode;
  tool: ITool;
  fill: Fill;
  stroke: Stroke;
}

interface CanvasProps extends CanvasDrawingProps {
  onModeSwitch?: (mode: CanvasInteractionMode, api?: API) => void;
  onObjectChanged?: (object: DocumentElement, api?: API) => void;
  onObjectAdded?: (object: DocumentElement, api?: API) => void;
  onReady?: (canvas: fabric.Canvas, api?: API) => void;
  onResize?: (canvas: fabric.Canvas, api?: API) => void;
}

interface CanvasState {
  isDown: boolean;
  pointer: {
    start: IPoint;
    current: IPoint;
    end: IPoint;
  };
}

export const toRGBA = (color: RGBColor) => {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

export interface DocumentElement {
  target: fabric.Object;
  uuid: string;
  metadata: Metadata;
  fill: Fill;
  stroke: Stroke;
}

export class ActiveDocument {
  private static instance: ActiveDocument;
  private current?: string;
  private registry: { [key: string]: DocumentElement } = {};
  constructor() {
    if (ActiveDocument.instance) {
      throw new Error("Cannot have multiple instances");
    }
    ActiveDocument.instance = this;
  }
  static getInstance(): ActiveDocument {
    if (!ActiveDocument.instance) {
      ActiveDocument.instance = new ActiveDocument();
    }
    return ActiveDocument.instance;
  }
  setCurrent(uuid?: string) {
    this.current = uuid;
    return this;
  }
  getCurrent() {
    return this.current ? this.registry[this.current] : undefined;
  }
  getById(id: string) {
    return this.registry[id];
  }
  register(uuid: string, element: DocumentElement) {
    this.registry[uuid] = element;
    return this;
  }
  unregister(uuid: string) {
    delete this.registry[uuid];
    return this;
  }
}

// common shape properties
export const csp = (props: any) => ({
  selectable: false,
  objectCaching: false,
  hasBorders: false,
  centeredScaling: true,
  centeredRotation: true,
  transparentCorners: true,
  hasRotatingPoint: false,
  cornerSize: 5,
  cornerStyle: "cornerStyle1",
  originX: "left",
  originY: "top",
  ...props
});

interface CanvasDrawing {
  start: () => fabric.Object;
  update: () => fabric.Object;
  end: () => fabric.Object;
}

class LineDrawing implements CanvasDrawing {
  start: () => fabric.Line;
  update: () => fabric.Line;
  end: () => fabric.Line;
}

class API {
  private canvas: fabric.Canvas;
  private element: HTMLCanvasElement;
  constructor(canvas: fabric.Canvas, element: HTMLCanvasElement) {
    this.canvas = canvas;
    this.element = element;
  }
}

export const observeCanvas = (
  canvas: fabric.Canvas,
  observer: React.MutableRefObject<CanvasDrawingProps>,
  api: API
) => {
  // DO NOT unwrap observer outside handlers
  const pointer = {
    down: { x: 0, y: 0 },
    move: { x: 0, y: 0 },
    up: { x: 0, y: 0 }
  };
  let isDrawing = false;
  let current: fabric.Object | undefined = undefined;
  const operations = {
    list: [],
    beginDrawing(opt: fabric.IEvent) {
      const { tool, stroke, fill } = observer.current;
      console.debug("Must begin", tool);
      if (tool.name === "vector.draw.line") {
        const points = [pointer.down.x, pointer.down.y, pointer.down.x, pointer.down.y];
        current = new fabric.Line(
          points,
          csp({
            left: pointer.down.x,
            top: pointer.down.y,
            fill: toRGBA(fill.color),
            stroke: toRGBA(stroke.color),
            strokeWidth: stroke.size
          })
        );
        canvas.add(current);
      }
    },
    updateDrawing(opt: fabric.IEvent) {
      const { tool } = observer.current;
      console.debug("Must update", tool);
      if (tool.name === "vector.draw.line" && current) {
        (current as fabric.Line).set({ x2: pointer.move.x, y2: pointer.move.y });
        canvas.requestRenderAll();
      }
    },
    endDrawing(opt: fabric.IEvent) {
      const { tool } = observer.current;
      console.debug("Must end", tool);
      if (tool.name === "vector.draw.line" && current) {
        (current as fabric.Line).set({ x2: pointer.move.x, y2: pointer.move.y });
        canvas.requestRenderAll();
      }
      current = undefined;
    }
  };
  canvas.on("mouse:wheel", (opt: fabric.IEvent) => {
    const native: any = opt.e;
    const delta = native.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    const point = new fabric.Point(native.offsetX, native.offsetY);
    canvas.zoomToPoint(point, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
  // mouse interaction
  canvas.on("mouse:down", (opt: fabric.IEvent) => {
    const current: IPoint = canvas.getPointer(opt.e);
    pointer.down.x = current.x;
    pointer.down.y = current.y;
    if (observer.current.mode === CanvasInteractionMode.DRAW) {
      isDrawing = true;
    }
    if (isDrawing) {
      operations.beginDrawing(opt);
    }
  });
  canvas.on("mouse:move", (opt: fabric.IEvent) => {
    const current: IPoint = canvas.getPointer(opt.e);
    pointer.move.x = current.x;
    pointer.move.y = current.y;
    if (isDrawing) {
      operations.updateDrawing(opt);
    }
  });
  canvas.on("mouse:up", (opt: fabric.IEvent) => {
    const current: IPoint = canvas.getPointer(opt.e);
    pointer.up.x = current.x;
    pointer.up.y = current.y;
    if (isDrawing) {
      operations.endDrawing(opt);
      isDrawing = false;
    }
  });
  //
  canvas.on("selection:created", (opt: fabric.IEvent) => {});
  canvas.on("selection:updated", (opt: fabric.IEvent) => {});
  canvas.on("selection:cleared", (opt: fabric.IEvent) => {});
  //
  canvas.on("object:modified", (opt: fabric.IEvent) => {});
  canvas.on("object:scaling", (opt: fabric.IEvent) => {});
  canvas.on("object:moving", (opt: fabric.IEvent) => {});
};

export const Canvas: React.FC<CanvasProps> = (props) => {
  const { objects, mode, tool, fill, stroke, onReady, onResize } = props;
  const size = useWindowSize();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = React.useRef<fabric.Canvas>();
  const observerRef = React.useRef<CanvasDrawingProps>({ objects, mode, tool, fill, stroke });
  useEffect(() => {
    const { current } = canvasRef;
    if (current && current.parentNode && size.width && size.height) {
      const bounds = (current.parentNode as HTMLElement).getBoundingClientRect();
      current.setAttribute("width", `${bounds.width}`);
      current.setAttribute("height", `${bounds.height}`);
      if (!fabricRef.current) {
        fabricRef.current = new fabric.Canvas(current, {
          preserveObjectStacking: true,
          selection: false
        });
        const api = new API(fabricRef.current, current);
        observeCanvas(fabricRef.current, observerRef, api);
        if (onReady) {
          onReady(fabricRef.current, api);
        }
      }
      fabricRef.current.setWidth(bounds.width);
      fabricRef.current.setHeight(bounds.height);
      fabricRef.current.requestRenderAll();
    }
  }, [size, onReady, onResize]);
  // Observe differently on mode change
  useEffect(() => {
    observerRef.current = {
      objects,
      mode,
      tool,
      fill,
      stroke
    };
  }, [objects, mode, tool, fill, stroke]);
  return <canvas className="AppViewportDocumentCanvas" ref={canvasRef} />;
};

export class Canvas2 extends PureComponent<CanvasProps, CanvasState> implements ICanvas {
  private canvasRef: any;
  private ready: boolean = false;
  // @ts-ignore
  public canvas: fabric.Canvas;
  // @ts-ignore
  private currentShape?: fabric.Object;
  private registry: ActiveDocument = ActiveDocument.getInstance();
  constructor(props: CanvasProps) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();
    this.state = {
      isDown: false,
      pointer: {
        start: { x: 0, y: 0 },
        current: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
      }
    };
  }
  componentDidUpdate(prevProps: CanvasProps, prevState: CanvasState) {
    if (!this.canvas) return;
    if (prevProps.mode !== this.props.mode || prevProps.tool !== this.props.tool) {
      console.debug("must update mode", this.props.mode);
      this.canvas.selection = this.props.mode === CanvasInteractionMode.SELECT;
    }
    if (prevProps.fill.color !== this.props.fill.color || prevProps.stroke.color !== this.props.stroke.color) {
      const current = this.registry.getCurrent();
      if (!current) {
        console.warn("No current");
        return;
      }
      const fill = toRGBA(this.props.fill.color);
      const stroke = toRGBA(this.props.stroke.color);
      current.target.set({ fill, stroke });
      current.fill = { ...this.props.fill };
      current.stroke = { ...this.props.stroke };
      this.canvas.requestRenderAll();
    }
    if (prevProps.stroke.size !== this.props.stroke.size) {
      const current = this.registry.getCurrent();
      if (!current) {
        console.warn("No current");
        return;
      }
      current.target.set({ strokeWidth: this.props.stroke.size });
      current.stroke = { ...this.props.stroke };
      this.canvas.requestRenderAll();
    }
  }
  componentDidMount() {
    window.removeEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }
  onResize = () => {
    const { current } = this.canvasRef;
    const bounds = current.parentNode.getBoundingClientRect();
    current.setAttribute("width", bounds.width);
    current.setAttribute("height", bounds.height);
    if (!this.canvas) {
      this.canvas = new fabric.Canvas(current, {
        preserveObjectStacking: true,
        selection: false
      });
      this.canvas.on("mouse:wheel", this.onMouseWheel);
      this.canvas.on("mouse:down", this.onMouseDown);
      this.canvas.on("mouse:move", this.onMouseMove);
      this.canvas.on("mouse:up", this.onMouseUp);
      this.canvas.on("selection:created", this.onObjectSelected);
      this.canvas.on("selection:updated", this.onObjectSelected);
      this.canvas.on("selection:cleared", this.onObjectCleared);
      this.canvas.on("object:modified", this.onObjectModified);
      this.canvas.on("object:scaling", this.onObjectScaling);
      this.canvas.on("object:moving", this.onObjectMoving);
    }
    this.canvas.setWidth(bounds.width);
    this.canvas.setHeight(bounds.height);
    this.canvas.requestRenderAll();
    if (!this.ready) {
      if (this.props.onReady) {
        this.ready = true;
        this.props.onReady(this);
      }
    }
  };
  notifyChange(opt: any) {
    const { onObjectChanged } = this.props;
    if (onObjectChanged) {
      setTimeout(() => {
        if (opt.target && opt.target.__uuid__) {
          const element = this.registry.getById(opt.target.__uuid__);
          console.debug("notify change", element);
          onObjectChanged(element);
        }
      }, 0);
    }
  }
  onObjectSelected = (opt: fabric.IEvent) => {
    this.registry.setCurrent((opt.target as any).uuid);
    this.notifyChange(opt);
  };
  onObjectCleared = (opt: fabric.IEvent) => {
    this.registry.setCurrent(undefined);
    this.notifyChange(opt);
  };
  onObjectMoving = (opt: fabric.IEvent) => {
    this.notifyChange(opt);
  };
  onObjectModified = (opt: fabric.IEvent) => {
    this.notifyChange(opt);
  };
  onObjectScaling = (opt: fabric.IEvent) => {
    this.notifyChange(opt);
  };
  onMouseDown = (opt: fabric.IEvent) => {
    const pointer: IPoint = this.canvas.getPointer(opt.e);
    this.setState(
      (prevState) => ({
        ...prevState,
        isDown: true,
        pointer: {
          ...prevState.pointer,
          start: pointer,
          current: pointer,
          end: pointer
        }
      }),
      () => {
        if (this.props.mode === CanvasInteractionMode.DRAW) {
          if (this.props.tool) {
            let shape = "Shape";
            const fillColor = this.props.fill.color;
            const strokeColor = this.props.stroke.color;
            const fill = toRGBA(fillColor);
            const stroke = toRGBA(strokeColor);
            if (this.props.tool.name === "vector.draw.line") {
              const points = [pointer.x, pointer.y, pointer.x, pointer.y];
              shape = "Line";
              this.currentShape = new fabric.Line(
                points,
                csp({
                  left: pointer.x,
                  top: pointer.y,
                  fill,
                  stroke,
                  strokeWidth: this.props.stroke.size
                })
              );
              this.canvas.add(this.currentShape);
              this.canvas.requestRenderAll();
            }
            if (this.props.tool.name === "vector.draw.shape.triangle") {
              shape = "Triangle";
              this.currentShape = new fabric.Triangle(
                csp({
                  left: pointer.x,
                  top: pointer.y,
                  width: 0,
                  height: 0,
                  fill,
                  stroke,
                  strokeWidth: this.props.stroke.size
                })
              );
              this.canvas.add(this.currentShape);
              this.canvas.requestRenderAll();
            }
            if (this.props.tool.name === "vector.draw.shape.rectangle") {
              shape = "Rectangle";
              this.currentShape = new fabric.Rect(
                csp({
                  left: pointer.x,
                  top: pointer.y,
                  width: 0,
                  height: 0,
                  fill,
                  stroke,
                  strokeWidth: this.props.stroke.size
                })
              );
              this.canvas.add(this.currentShape);
              this.canvas.requestRenderAll();
            }
            if (this.props.tool.name === "vector.draw.shape.ellipse") {
              shape = "Ellipse";
              this.currentShape = new fabric.Ellipse(
                csp({
                  left: pointer.x,
                  top: pointer.y,
                  fill,
                  stroke,
                  strokeWidth: this.props.stroke.size,
                  rx: 0,
                  ry: 0,
                  angle: 0
                })
              );
              this.canvas.add(this.currentShape);
              this.canvas.requestRenderAll();
            }
            if (this.props.tool.name === "vector.draw.shape.polygon") {
              shape = "Polygon";
              const points = [
                { x: this.state.pointer.start.x, y: this.state.pointer.start.y },
                { x: pointer.x, y: this.state.pointer.start.y },
                { x: this.state.pointer.start.x, y: pointer.y },
                { x: pointer.x, y: pointer.y }
              ];
              this.currentShape = new fabric.Polygon(
                points,
                csp({
                  left: pointer.x,
                  top: pointer.y,
                  fill,
                  stroke,
                  strokeWidth: this.props.stroke.size
                })
              );
              this.canvas.add(this.currentShape);
              this.canvas.requestRenderAll();
            }
            const { currentShape } = this;
            if (currentShape) {
              const uuid = v4();
              const metadata: Metadata = {
                generator: this.props.tool.name,
                shape
              };
              const element: DocumentElement = {
                uuid,
                target: currentShape,
                metadata,
                fill: { ...this.props.fill },
                stroke: { ...this.props.stroke }
              };
              (currentShape as any).__uuid__ = uuid;
              this.registry.register(uuid, element);
            }
          }
        }
      }
    );
  };
  onMouseMove = (opt: fabric.IEvent) => {
    const pointer: IPoint = this.canvas.getPointer(opt.e);
    this.setState(
      (prevState) => ({
        ...prevState,
        pointer: {
          ...prevState.pointer,
          current: pointer
        }
      }),
      () => {
        if (this.props.mode === CanvasInteractionMode.DRAW) {
          if (!this.state.isDown) return;
          if (this.currentShape) {
            if (this.props.tool) {
              if (this.props.tool.name === "vector.draw.line") {
                (this.currentShape as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
              }
              if (this.props.tool.name === "vector.draw.shape.triangle") {
                this.currentShape.set({
                  width: pointer.x - this.state.pointer.start.x,
                  height: pointer.y - this.state.pointer.start.y
                });
              }
              if (this.props.tool.name === "vector.draw.shape.rectangle") {
                this.currentShape.set({
                  width: pointer.x - this.state.pointer.start.x,
                  height: pointer.y - this.state.pointer.start.y
                });
              }
              if (this.props.tool.name === "vector.draw.shape.ellipse") {
                const rx = Math.abs(this.state.pointer.start.x - pointer.x) / 2;
                const ry = Math.abs(this.state.pointer.start.y - pointer.y) / 2;
                (this.currentShape as fabric.Ellipse).set({ rx: rx, ry: ry });
              }
              if (this.props.tool.name === "vector.draw.shape.polygon") {
                const points: fabric.Point[] = [
                  new fabric.Point(this.state.pointer.start.x, this.state.pointer.start.y),
                  new fabric.Point(pointer.x, this.state.pointer.start.y),
                  new fabric.Point(pointer.x, pointer.y),
                  new fabric.Point(this.state.pointer.start.x, pointer.y)
                ];
                (this.currentShape as fabric.Polygon).set({ points });
              }
            }
            if (this.currentShape) {
              this.currentShape.setCoords();
              this.canvas.requestRenderAll();
            }
          }
        }
      }
    );
  };
  onMouseUp = (opt: fabric.IEvent) => {
    const pointer: IPoint = this.canvas.getPointer(opt.e);
    this.setState(
      (prevState) => ({
        ...prevState,
        isDown: false,
        pointer: {
          ...prevState.pointer,
          end: pointer
        }
      }),
      () => {
        if (this.props.onModeSwitch) {
          const { currentShape } = this;
          if (currentShape) {
            currentShape.selectable = true;
            currentShape.setCoords();
            this.canvas.setActiveObject(currentShape);
            this.canvas.requestRenderAll();
            this.currentShape = undefined;
          }
          if (this.props.mode === CanvasInteractionMode.DRAW) {
            if (this.props.onObjectAdded) {
              this.props.onObjectAdded(this.registry.getById((currentShape as any).__uuid__));
            }
            this.props.onModeSwitch(CanvasInteractionMode.SELECT);
          }
        }
      }
    );
  };
  onMouseWheel = (opt: any) => {
    // return;
    const delta = opt.e.deltaY;
    let zoom = this.canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
    this.canvas.zoomToPoint(point, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };
  render() {
    return <canvas className="AppViewportDocumentCanvas" ref={this.canvasRef} />;
  }
}

export default Canvas;
