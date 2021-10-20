import React, { useCallback } from "react";
import { Classes, Menu, Position } from "@blueprintjs/core";

import { ITool } from "../Types";
import { tools, groups } from "../Tools";
import { useApp } from "../Context";
import "./AppViewportSidebar.css";

interface AppViewportSidebarProps {
  onToolChange: (tool: ITool) => void;
}

const MenuHeader = ({ title }: { title: string }) => {
  return (
    <li className={`${Classes.MENU_HEADER} AppViewportSidebarMenuHeader`}>
      <h6 className={Classes.HEADING}>{title}</h6>
    </li>
  );
};

export const AppViewportSidebar = (props: AppViewportSidebarProps) => {
  const { currentTool } = useApp();
  const { onToolChange } = props;
  const onToolClick = useCallback(
    (e) => {
      const toolName = e.currentTarget.getAttribute("data-tool");
      const tool = tools[toolName].tool;
      onToolChange(tool);
    },
    [onToolChange]
  );
  // console.debug("Tool", currentTool, geometry);
  return (
    <Menu className="AppViewportSidebar">
      {groups.map((group) => {
        return (
          <React.Fragment key={group.name}>
            <MenuHeader title={group.title || ""} />
            {(group.tools || []).map((group) => {
              if (!group) {
                return <Menu.Divider />;
              }
              const { tools } = group;
              if (tools && tools[0]) {
                const first = tools[0];
                let groupIcon = first.icon;
                const currentToolIsInGroup = tools.find((t) => t && currentTool.name === t.name);
                if (currentToolIsInGroup) {
                  groupIcon = currentTool.icon;
                }
                return (
                  <Menu.Item
                    key={`group-${first.name}`}
                    icon={groupIcon}
                    popoverProps={{
                      position: Position.RIGHT_TOP,
                      minimal: true,
                      usePortal: true,
                      hasBackdrop: false,
                      transitionDuration: 0
                    }}
                  >
                    {tools.map((subtool) => {
                      if (!subtool) {
                        return <Menu.Divider key={group.name} />;
                      }
                      return (
                        <Menu.Item
                          data-group={group.name}
                          icon={subtool.icon as any}
                          key={subtool.name}
                          active={subtool.name === currentTool.name}
                          onClick={onToolClick}
                          data-tool={subtool.name}
                          text={subtool.title}
                        />
                      );
                    })}
                  </Menu.Item>
                );
              }
              const tool = group;
              return (
                <Menu.Item
                  icon={tool.icon as any}
                  key={tool.name}
                  active={tool.name === currentTool.name}
                  onClick={onToolClick}
                  data-tool={tool.name}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </Menu>
  );
};
