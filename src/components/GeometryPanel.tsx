import React from "react";
import { FormGroup, InputGroup, Card, Elevation } from "@blueprintjs/core";

import { useApp } from "../Context";

import { ActiveDocument } from "../Canvas";

import "./GeometryPanel.css";

export function GeometryPanel() {
  const { geometry, metadata } = useApp();
  const attributes = [
    {
      group: "geometry.size",
      attributes: [
        { name: "width", label: "W", value: geometry.width },
        { name: "height", label: "H", value: geometry.height }
      ]
    },
    {
      group: "geometry.position",
      attributes: [
        { name: "x", label: "X", value: geometry.x },
        { name: "y", label: "Y", value: geometry.y }
      ]
    }
  ];
  const onAttributeChanged = () => {};
  // const style = { backgroundImage: `url(${props.dataURL})` };
  // console.debug(metadata, ActiveDocument.getInstance().get);
  return (
    <Card className="ShapePanel GeometryPanel" elevation={Elevation.ZERO}>
      <div data-container="identity">
        <div data-container="identity.preview">
          <div data-container="identity.preview.image"></div>
        </div>
        <div data-container="identity.symbol">
          <FormGroup label={metadata.shape} labelFor="metadata.shape">
            <InputGroup small fill id="metadata.shape" name="metadata.shape" />
          </FormGroup>
        </div>
      </div>
      <div data-container="geometry">
        {attributes.map((group) => {
          return (
            <div data-container={group.group} key={group.group}>
              {group.attributes.map((attr) => {
                return (
                  <FormGroup label={attr.label} labelFor={attr.name} inline key={`${group.group}-${attr.name}`}>
                    <InputGroup
                      id={attr.name}
                      value={`${Number(attr.value).toFixed(2)}`}
                      small
                      fill
                      onChange={onAttributeChanged}
                    />
                  </FormGroup>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
