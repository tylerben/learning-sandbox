import React from "react";
import { Chip } from "./Chip";

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: "Chip",
  component: Chip,
};

const Template = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  active: false,
  value: "1",
  label: "Item 1",
};
