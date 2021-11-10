import React from "react";
import { ChipFilter } from "./ChipFilter";
import { action } from "@storybook/addon-actions";

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: "ChipFilter",
  component: ChipFilter,
};

const Template = (args) => <ChipFilter {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: [
    { value: "1", label: "Item 1" },
    { value: "2", label: "Item 2" },
    { value: "3", label: "Item 3" },
  ],
  value: ["2"],
  onChange: action((id, val) => val),
};
