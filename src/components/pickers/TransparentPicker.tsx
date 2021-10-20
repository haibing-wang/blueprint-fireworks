import React, { useCallback, useState } from "react";
import { ControlGroup, FormGroup, Checkbox } from "@blueprintjs/core";

export const TransparentPicker = () => {
  const [checked, setChecked] = useState(false);
  const onInputChanged = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setChecked(!checked);
    },
    [checked]
  );
  return (
    <FormGroup label=" " inline className="PanelField TransparentPicker">
      <ControlGroup fill>
        <Checkbox checked={checked} label="Transparent" className="PickerInput" onChange={onInputChanged} />
      </ControlGroup>
    </FormGroup>
  );
};
