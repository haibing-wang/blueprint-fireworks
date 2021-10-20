import React, { useEffect, useState } from "react";

import { Button, ButtonGroup, Classes, Icon, Intent, ITreeNode, Tree } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./LayersPanel.css";

export interface ILayerPanelState {
  nodes: ITreeNode[];
}

function LayerPanelLayerActions() {
  return (
    <div className="LayerPanelLayerActions">
      <ButtonGroup>
        <Button small minimal icon={IconNames.EYE_OPEN} />
        <Button small minimal icon={IconNames.UNLOCK} />
      </ButtonGroup>
    </div>
  );
}

interface LayerPanelLayerPreviewProps {
  dataURL?: string;
}
function LayerPanelLayerPreview(props: LayerPanelLayerPreviewProps) {
  const style = { backgroundImage: `url(${props.dataURL})` };
  return (
    <div className={`${Classes.TREE_NODE_ICON} LayerPanelLayerThumb`}>
      <div className="LayerPanelLayerThumbPreview">
        <div className="LayerPanelLayerThumbPreviewObject" style={style}></div>
      </div>
    </div>
  );
}

const INITIAL_STATE: ITreeNode[] = [
  {
    label: "Web layers",
    id: 0,
    hasCaret: true,
    icon: IconNames.FOLDER_CLOSE,
    secondaryLabel: <LayerPanelLayerActions />
  },
  {
    label: "Scene layers",
    id: 1,
    icon: IconNames.FOLDER_CLOSE,
    isExpanded: true,
    secondaryLabel: <LayerPanelLayerActions />,
    childNodes: []
  }
];

let CNC = INITIAL_STATE.length;
const createChildNode = (obj: any) => {
  CNC += 1;
  return {
    label: obj.label,
    id: CNC,
    icon: <LayerPanelLayerPreview dataURL={obj.dataURL} />,
    secondaryLabel: <LayerPanelLayerActions />
  };
};

const forEachNode = (nodes: ITreeNode[], callback: (node: ITreeNode) => void) => {
  if (nodes == null) {
    return;
  }
  for (const node of nodes) {
    callback(node);
    if (node.childNodes) {
      forEachNode(node.childNodes, callback);
    }
  }
};

function toNodes(objects: any[]) {
  return [];
  const nodes = objects.map((object) => {
    return createChildNode({
      label: object.metadata.shape,
      dataURL: object.toDataURL()
    });
  });
  return nodes;
}

interface LayersPanelProps {
  objects: any[];
}

export const LayersPanel: React.FC<LayersPanelProps> = (props) => {
  const { objects } = props;
  const [state, setState] = useState<ILayerPanelState>({ nodes: INITIAL_STATE });
  const handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
    const originallySelected = nodeData.isSelected;
    if (!e.shiftKey) {
      forEachNode(state.nodes, (n: ITreeNode) => (n.isSelected = false));
    }
    nodeData.isSelected = originallySelected == null ? true : !originallySelected;
    setState({ ...state });
  };
  const handleNodeCollapse = (nodeData: ITreeNode) => {
    nodeData.isExpanded = false;
    setState({ ...state });
  };
  const handleNodeExpand = (nodeData: ITreeNode) => {
    nodeData.isExpanded = true;
    setState({ ...state });
  };
  useEffect(() => {
    // console.debug("Objects changed", objects);
    setState({ nodes: [...INITIAL_STATE, ...toNodes(objects)] });
  }, [objects]);
  return (
    <Tree
      contents={state.nodes}
      onNodeClick={handleNodeClick}
      onNodeCollapse={handleNodeCollapse}
      onNodeExpand={handleNodeExpand}
      className={`${Classes.ELEVATION_0} LayersPanel`}
    />
  );
};
