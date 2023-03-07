import React, { PropsWithChildren } from 'react';

const LoaderMain: React.FC<PropsWithChildren> = ({ children }) => (
  <>
    <p>Loading...</p>
    {children}
  </>
);

export default LoaderMain;
