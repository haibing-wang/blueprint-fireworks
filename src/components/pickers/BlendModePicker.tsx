import React, { useCallback, useState } from "react";
import { ControlGroup, FormGroup, Button, MenuItem, Position, InputGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { Select, ItemRenderer } from "@blueprintjs/select";

// BlendMode
interface IStyle {
  name: string;
  text: string;
  label?: string;
  preview?: string;
}
const STYLES: IStyle[] = [
  {
    name: "normal",
    text: "Normal"
  },
  {
    name: "average",
    text: "Average"
  },
  {
    name: "disolve",
    text: "Disolve"
  },
  {
    name: "darken",
    text: "Darken"
  },
  {
    name: "multiply",
    text: "Multiply"
  },
  {
    name: "color-burn",
    text: "Color burn"
  },
  {
    name: "color-burn.inverse",
    text: "Inverse color burn"
  },
  {
    name: "soft-burn",
    text: "Soft burn"
  },
  {
    name: "linear-burn",
    text: "Linear burn"
  }
];
const BlendModeSelect = Select.ofType<IStyle>();
export const SelectItemRenderer: ItemRenderer<IStyle> = (item, { handleClick, modifiers, query }) => {
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

export const BlendModePicker = () => {
  const [value, setValue] = useState(100);
  const [style, setStyle] = useState(STYLES[0]);
  const onItemSelect = useCallback((item: IStyle, event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => {
    setStyle(item);
  }, []);
  const onValueChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValue(Number(e.currentTarget.value));
  }, []);
  return (
    <FormGroup label="Blend" inline className="PanelField BlendModePicker">
      <ControlGroup fill>
        <BlendModeSelect
          items={STYLES}
          itemRenderer={SelectItemRenderer}
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
        </BlendModeSelect>
        <InputGroup small value={`${value}`} onChange={onValueChanged} className="PickerInput" />
      </ControlGroup>
    </FormGroup>
  );
};
