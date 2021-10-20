import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select, ItemRenderer } from "@blueprintjs/select";
import { SketchPicker, ColorChangeHandler, RGBColor, ColorResult } from "react-color";

import "./ColorStylePicker.css";

const TRANSPARENT: RGBColor = { r: 0, g: 0, b: 0, a: 1 };
// Color
interface IStyle {
  name: string;
  text: string;
  label?: string;
  preview?: string;
}
const STYLES: IStyle[] = [
  {
    name: "none",
    text: "None"
  },
  {
    name: "solid",
    text: "Solid"
  },
  {
    name: "web.dither",
    text: "Web Dither"
  },
  {
    name: "gradient",
    text: "Gradient"
  },
  {
    name: "pattern",
    text: "Pattern"
  }
];
const ColorStyleSelect = Select.ofType<IStyle>();
export const ColorStyleSelectItemRenderer: ItemRenderer<IStyle> = (item, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={item.text}
      label={item.label}
      key={item.name}
      onClick={handleClick}
    />
  );
};

export interface ColorStyleResult {
  color: RGBColor;
  size: number;
}

export type ColorStylePickerChangeHandler = (color: ColorStyleResult) => void;

interface ColorStylePickerProps {
  color?: RGBColor;
  size?: number;
  onChange?: ColorStylePickerChangeHandler;
  withSize?: boolean;
}

export const ColorStylePicker: React.FC<ColorStylePickerProps> = (props) => {
  const { onChange } = props;
  const [color, setColor] = useState<RGBColor>(props.color || TRANSPARENT);
  const [style, setStyle] = useState(STYLES[0]);
  const [size, setSize] = useState(1);
  const onItemSelect = useCallback((item: IStyle, event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => {
    setStyle(item);
  }, []);
  const onColorChange: ColorChangeHandler = useCallback(
    (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
      const value = color.rgb;
      setColor(value);
      if (onChange) {
        onChange({ color: value, size });
      }
    },
    [onChange, size]
  );
  const onSizeChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const value = Number(e.currentTarget.value);
      setSize(value);
      if (onChange) {
        onChange({ color, size: value });
      }
    },
    [onChange, color]
  );
  const colorStyle = {
    backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a})`
  };
  // TODO: Is this really needed ?
  useEffect(() => {
    if (props.color) {
      setColor(props.color);
    }
    if (props.size) {
      setSize(props.size);
    }
  }, [props.color, props.size]);
  let sizeWidget;
  if (props.withSize) {
    sizeWidget = <InputGroup small value={`${size}`} onChange={onSizeChange} className="PickerInput" />;
  }
  return (
    <FormGroup label="Style" inline className="PanelField ColorStylePicker">
      <ControlGroup fill>
        <ColorStyleSelect
          items={STYLES}
          itemRenderer={ColorStyleSelectItemRenderer}
          onItemSelect={onItemSelect}
          popoverProps={{ position: Position.TOP }}
        >
          <Button
            small
            text={style.text}
            rightIcon={IconNames.CARET_UP}
            className="PickerPopoverButton"
            data-component="style"
          />
        </ColorStyleSelect>
        {sizeWidget}
        <Popover
          captureDismiss
          usePortal
          canEscapeKeyClose
          interactionKind={PopoverInteractionKind.CLICK}
          portalClassName="PickerPopover"
          enforceFocus={false}
          position={Position.TOP}
          content={<SketchPicker onChange={onColorChange} color={color} />}
        >
          <Button
            outlined={false}
            small
            rightIcon={IconNames.CARET_DOWN}
            className="PickerPopoverButton"
            data-component="color"
            text={<div className="PickerPopoverButtonPreview" style={colorStyle}></div>}
          />
        </Popover>
      </ControlGroup>
    </FormGroup>
  );
};
