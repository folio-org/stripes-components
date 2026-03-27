// @ts-nocheck
import React from "react";
import Paneset from "../Paneset";
import LoadingPane from "./LoadingPane";
type LoadingViewProps = { panesetProps?: Record<string, any> };

const LoadingView = ({ panesetProps, ...props }: LoadingViewProps) => (
  <Paneset {...panesetProps}>
    <LoadingPane {...props} />
  </Paneset>
);

export default LoadingView;
