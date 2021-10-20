import React, { useCallback, useState } from "react";
import { FormGroup, Checkbox, InputGroup } from "@blueprintjs/core";

import "./RectangleRoundnessPicker.css";

export const RectangleRoundnessPicker = () => {
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(100);
  const onInputChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked);
  }, []);
  const onValueChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValue(Number(e.currentTarget.value));
  }, []);
  return (
    <FormGroup label=" " inline className="PanelField RectangleRoundnessPicker">
      <Checkbox checked={checked} label="Rectangle roundness" className="PickerValueInput" onChange={onInputChanged} />
      <InputGroup small value={`${value}`} onChange={onValueChanged} className="PickerValueInput" disabled={!checked} />
    </FormGroup>
  );
};
