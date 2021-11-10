import React from "react";
import { action } from "@storybook/addon-actions";
import { Filter } from "./Filter";

const options = [
  { value: "INFREQUENT", label: "Infrequent" },
  { value: "OCCASIONAL", label: "Occasional" },
  { value: "OCCASIONAL TO FREQUENT", label: "Occasional to Frequent" },
  { value: "FREQUENT", label: "Frequent" },
];

const defaultValue = ["FREQUENT"];

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: "Filter",
  component: Filter,
};

const Template = (args) => <Filter {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Avalanche Frequency",
  options,
  defaultValue,
  onChange: action((id, val) => val),
};
