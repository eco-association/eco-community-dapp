import { renderIcon } from "@download/blockies";
import React, { useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";

interface BlockieProps {
  address?: string;
}

export const Blockie: React.FC<BlockieProps> = ({ address }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current || !address) return;
    renderIcon(
      {
        seed: address.toLowerCase(),
        size: 8,
        scale: 4,
      },
      canvasRef.current
    );
  }, [address]);

  if (!address) {
    return <Skeleton circle width={40} height={40} />;
  }

  return <canvas ref={canvasRef} style={{ borderRadius: 8 }} />;
};
