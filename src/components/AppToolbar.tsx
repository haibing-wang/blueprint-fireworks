import React from "react";

import { IconNames } from "@blueprintjs/icons";
import { Alignment, Button, Navbar } from "@blueprintjs/core";

export const AppToolbar = () => {
  return (
    <Navbar className="AppToolbar">
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.DOCUMENT} />
        <Button minimal icon={IconNames.FLOPPY_DISK} />
        <Button minimal icon={IconNames.DOCUMENT_OPEN} />
        <Navbar.Divider />
        <Button minimal icon={IconNames.IMPORT} />
        <Button minimal icon={IconNames.EXPORT} />
        <Button minimal icon={IconNames.PRINT} />
        <Navbar.Divider />
        <Button minimal icon={IconNames.UNDO} />
        <Button minimal icon={IconNames.REDO} />
        <Navbar.Divider />
        <Button minimal icon={IconNames.CUT} />
        <Button minimal icon={IconNames.CLIPBOARD} />
        <Button minimal icon={IconNames.DUPLICATE} />
      </Navbar.Group>
    </Navbar>
  );
};
