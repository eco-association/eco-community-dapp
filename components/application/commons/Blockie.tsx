import { renderIcon } from "@download/blockies";
import React, { useEffect, useRef } from "react";

interface BlockieProps {
  address: string;
}

export const Blockie: React.FC<BlockieProps> = ({ address }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;
    renderIcon(
      {
        seed: address.toLowerCase(),
        size: 8,
        scale: 4,
      },
      canvasRef.current
    );
  }, [address]);

  return <canvas ref={canvasRef} style={{ borderRadius: 8 }} />;
};
