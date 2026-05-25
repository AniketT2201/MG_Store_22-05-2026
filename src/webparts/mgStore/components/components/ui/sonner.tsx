import * as React from "react";

interface ToasterProps {
  children?: React.ReactNode;
}

export function Toaster({
  children,
}: ToasterProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
    >
      {children}
    </div>
  );
}