// @ts-nocheck
import React from "react";
import css from "./DotSpinner.css";
type LoadingProps = {
  size?: "small" | "medium" | "large" | "xlarge";
  useCurrentColor?: boolean;
};

const Loading = ({ size = "medium", useCurrentColor }: LoadingProps) => {
  const multiplyerMap = {
    small: 0.5,
    medium: 1,
    large: 2,
    xlarge: 3,
  };

  const getStyle = () => {
    if (size) {
      const wAmount = multiplyerMap[size] * 30;
      const hAmount = multiplyerMap[size] * 15;
      return { width: `${wAmount}px`, height: `${hAmount}px` };
    }
    return null;
  };

  const dotStyle = {
    backgroundColor: useCurrentColor ? "currentColor" : null,
  };

  return (
    <div className={css.spinner} style={getStyle()}>
      <div className={css.bounce1} style={dotStyle} />
      <div className={css.bounce2} style={dotStyle} />
      <div className={css.bounce3} style={dotStyle} />
    </div>
  );
};

export default Loading;
