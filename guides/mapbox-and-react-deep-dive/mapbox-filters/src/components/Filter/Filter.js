import React from "react";
import PropTypes from "prop-types";
import { ChipFilter } from "../ChipFilter/ChipFilter";
import "./index.css";

export const Filter = ({ id, title, options, value = [], onChange }) => {
  return (
    <div className="filters-container">
      <div className="filters-inner-container">
        <h4 className="filters-label">{title}</h4>
        <ChipFilter
          id={id}
          value={value}
          options={options}
          onChange={onChange}
          className="filters"
        />
      </div>
    </div>
  );
};

Filter.propTypes = {
  /**
   * ID used to identify the filter
   */
  id: PropTypes.string.isRequired,
  /**
   * Optional title to displayed above the filter
   */
  title: PropTypes.string,
  /**
   * Optional default value for the filter component
   */
  value: PropTypes.array,
  /**
   * An array of values to be presented as filter options
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * An optional event handler that is executed when the filter value changes
   */
  onChange: PropTypes.func,
};
