import React, { useCallback, useState } from "react";
import { ControlGroup, FormGroup, Button, MenuItem, Position, InputGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { Select, ItemRenderer } from "@blueprintjs/select";

// Edge
const STYLES: IStyle[] = [
  {
    name: "hard",
    text: "Hard"
  },
  {
    name: "feather",
    text: "Feather"
  },
  {
    name: "antialias",
    text: "Antialias"
  }
];
interface IStyle {
  name: string;
  text: string;
  label?: string;
  preview?: string;
}
const StyleSelect = Select.ofType<IStyle>();
export const StyleSelectItemRenderer: ItemRenderer<IStyle> = (item, { handleClick, modifiers, query }) => {
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

export const EdgeStylePicker = () => {
  const [value, setValue] = useState(100);
  const [style, setStyle] = useState(STYLES[0]);
  const onItemSelect = useCallback((item: IStyle, event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => {
    setStyle(item);
  }, []);
  const onValueChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValue(Number(e.currentTarget.value));
  }, []);
  return (
    <FormGroup label="Edge" inline className="PanelField EdgeStylePicker">
      <ControlGroup fill>
        <StyleSelect
          items={STYLES}
          itemRenderer={StyleSelectItemRenderer}
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
        </StyleSelect>
        <InputGroup small value={`${value}`} onChange={onValueChanged} className="PickerInput" />
      </ControlGroup>
    </FormGroup>
  );
};
