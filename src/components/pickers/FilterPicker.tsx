import React from "react";
import { Button, HTMLTable, Label, Icon, ButtonGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./FilterPicker.css";

const FiltersControls = () => {
  return (
    <div className="FiltersControls">
      <Label>Filter</Label>
      <ButtonGroup vertical>
        <Button small minimal icon={IconNames.PLUS} />
        <Button small minimal icon={IconNames.MINUS} />
      </ButtonGroup>
    </div>
  );
};

const FiltersList = () => {
  return (
    <HTMLTable condensed interactive striped className="FiltersList">
      <tbody>
        <tr>
          <td>
            <Icon icon={IconNames.EYE_OPEN} />
          </td>
          <td>Glow</td>
        </tr>
        <tr>
          <td>
            <Icon icon={IconNames.EYE_OPEN} />
          </td>
          <td>Glow</td>
        </tr>
        <tr>
          <td>
            <Icon icon={IconNames.EYE_OPEN} />
          </td>
          <td>Glow</td>
        </tr>
        <tr>
          <td>
            <Icon icon={IconNames.EYE_OPEN} />
          </td>
          <td>Glow</td>
        </tr>
      </tbody>
    </HTMLTable>
  );
};

export function FilterPicker() {
  return (
    <div className="FilterPicker">
      <FiltersControls />
      <FiltersList />
    </div>
  );
}
