// @ts-nocheck
/**
 * MenuSection
 */

import React from "react";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";
import css from "./MenuSection.css";
import Headline from "../Headline";
type MenuSectionProps = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  label?: React.ReactNode;
  labelTag?: "div" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const MenuSection = ({
  className,
  children,
  id,
  label,
  labelTag = "h3",
  ...rest
}: MenuSectionProps) => {
  const sectionId = id || uniqueId("menu-section-");
  return (
    <section
      id={sectionId}
      className={classNames(css.menuSection, className)}
      aria-labelledby={`${sectionId}-label`}
      {...rest}
      data-test-menu-section
    >
      {label && (
        <Headline
          id={`${sectionId}-label`}
          size="small"
          margin="none"
          tag={labelTag}
          className={css.menuSection__label}
          faded
          data-test-menu-section-label
        >
          {label}
        </Headline>
      )}
      {children}
    </section>
  );
};

export default MenuSection;
