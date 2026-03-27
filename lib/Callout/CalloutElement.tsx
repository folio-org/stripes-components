// @ts-nocheck
import React from "react";
import { Transition } from "react-transition-group";
import IconButton from "../IconButton";
import Icon from "../Icon";
import css from "./Callout.css";
type CalloutElementProps = {
  id: string;
  message: React.ReactNode | React.ReactNode[] | string;
  onDismiss: (...args: any[]) => any;
  timeout?: number;
  transition?: string;
  type?: string;
};

const getClassNamefromTransitionState = (tState, cType, baseClass, tType) =>
  `${baseClass} ${css[`${cType}`]} ${css[`${tType}-${tState}`]}`;

const getIconForType = (type) => {
  switch (type) {
    case "success":
      return "check-circle";
    case "info":
      return "info";
    case "error":
    case "warning":
      return "exclamation-circle";
    default:
      return "chevron-double-right";
  }
};

const CalloutElement = ({
  timeout = "6000",
  transition = "slide",
  type = "success",
  ...rest
}: CalloutElementProps) => {
  const props = { timeout, transition, type, ...rest };
  return (
    <Transition {...props} timeout={300} appear>
      {(transitionState) => (
        <div className={css.calloutRow}>
          <div
            className={getClassNamefromTransitionState(
              transitionState,
              props.type,
              css.calloutBase,
              props.transition,
            )}
            data-test-callout-element
            id={props.id}
          >
            <Icon icon={getIconForType(props.type)} />
            <div className={css.message}>{props.message}</div>
            <IconButton
              icon="times"
              onClick={() => props.onDismiss(props.id)}
              data-test-callout-element-close-button
            />
          </div>
        </div>
      )}
    </Transition>
  );
};

export default CalloutElement;
