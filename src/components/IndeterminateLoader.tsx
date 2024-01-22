"use client";

import BarLoader from "react-spinners/BarLoader";

const IndeterminateLoader = ({
  loading,
  color,
}: {
  loading: boolean;
  color?: string;
}) => {
  return (
    <BarLoader
      height={3}
      loading={loading}
      color={color ?? "#1199ff"}
      cssOverride={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100vw",
      }}
    />
  );
};

export default IndeterminateLoader;
