//content-layout.tsx
import * as React from 'react';

type ContentLayoutProps = {
  children: React.ReactNode;
};

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return <div className="p-4">{children}</div>;
};
