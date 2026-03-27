// @ts-nocheck
/**
 * Label
 */

import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import Icon from "../Icon";
import Asterisk from "./components/Asterisk";
import css from "./Label.css";
type LabelProps = {
  children?: React.ReactNode;
  className?: string;
  htmlFor?: string;
  id?: string;
  readOnly?: boolean;
  required?: boolean;
  tagName?: string;
};

const Label = ({
  children,
  className,
  htmlFor,
  id,
  readOnly,
  required,
  tagName = "label",
  ...rest
}: LabelProps) => {
  const Element = tagName;

  return (
    <Element
      htmlFor={htmlFor}
      id={id}
      {...rest}
      className={classnames(css.label, className)}
    >
      {children}
      {required && <Asterisk />}
      {readOnly && (
        <Icon size="small" icon="lock">
          <span className="sr-only">
            <FormattedMessage id="stripes-components.readonly" />
          </span>
        </Icon>
      )}
    </Element>
  );
};

export default Label;
