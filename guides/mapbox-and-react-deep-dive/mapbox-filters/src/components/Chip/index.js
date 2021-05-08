import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./index.css";

export const Chip = ({ active, value, label, onClick }) => {
  return (
    <div
      className={clsx("chip-root", { active: active })}
      onClick={() => onClick(value)}
    >
      <span className="chip-label">{label}</span>
    </div>
  );
};

Chip.propTypes = {
  /**
   * Whether the prop is in an active state (i.e. selected)
   */
  active: PropTypes.bool,
  /**
   * The value associated with the chip
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /**
   * The pretty value, aka display label for the chip
   */
  label: PropTypes.string.isRequired,
  /**
   * An optional event handler for defining the logic that should be executed
   * when a user clicks on the chip
   */
  onClick: PropTypes.func,
};
