// @ts-nocheck
import React from "react";
import { Loading } from "../Loading";

import Button from "../Button";
type PagingButtonProps = {
  loading?: boolean;
  loadingMessage?: string;
  onClick?: (...args: any[]) => any;
  pagingButtonLabel?: React.ReactNode;
  sendMessage?: (...args: any[]) => any;
};

const PagingButton = ({
  loading,
  onClick,
  loadingMessage,
  pagingButtonLabel,
  sendMessage,
  ...props
}: PagingButtonProps) => {
  const handleClick = () => {
    sendMessage(loadingMessage);
    onClick();
  };

  return (
    <>
      <Button onClick={handleClick} data-test-paging-button {...props}>
        {!loading && pagingButtonLabel}
        {loading && <Loading size="medium" useCurrentColor />}
      </Button>
    </>
  );
};

export default PagingButton;
