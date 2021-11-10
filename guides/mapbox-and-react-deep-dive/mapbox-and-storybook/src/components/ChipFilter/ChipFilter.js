import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Chip } from "../Chip";
import "./index.css";

export const ChipFilter = ({
  id,
  className,
  options,
  value = [],
  onChange = () => {},
}) => {
  return (
    <div className={clsx("chip-filter-root", className)}>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          value={opt.value}
          active={value.includes(opt.value)}
          onClick={() => onChange(id, opt.value)}
        />
      ))}
    </div>
  );
};

ChipFilter.propTypes = {
  /**
   * ID used to identify the filter
   */
  id: PropTypes.string.isRequired,
  /**
   * An optional css class(es) to pay to the chip filter root container
   */
  className: PropTypes.string,
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
   * An optional event handler that is executed when the user selects/deselects
   * a filter chip
   */
  onChange: PropTypes.func,
};
