// @ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import createProps from "../createProps";
import getClass from "../classNames";
type GridProps = {
  fluid?: boolean;
  className?: string;
  tagName?: string;
  children?: React.ReactNode;
};

const propTypes = {
  fluid: PropTypes.bool,
  className: PropTypes.string,
  tagName: PropTypes.string,
  children: PropTypes.node,
};

export default function Grid(props: GridProps) {
  const containerClass = getClass(
    props.fluid ? "container-fluid" : "container",
  );
  const classNames = [props.className, containerClass];

  return React.createElement(
    props.tagName || "div",
    createProps(propTypes, props, classNames),
  );
}
