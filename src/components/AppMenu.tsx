import React from "react";

import { Alignment, Button, Menu, Navbar, Popover, Position } from "@blueprintjs/core";

export const AppMenu = () => {
  return (
    <Navbar className="AppMenu">
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Fw</Navbar.Heading>
        <Navbar.Divider />
        <Popover content={<Menu>...</Menu>} position={Position.BOTTOM_LEFT}>
          <Button minimal text="File" />
        </Popover>
        <Button minimal text="Edit" />
      </Navbar.Group>
    </Navbar>
  );
};
