import '../view/layout/styles/globals/_style.scss';

import { ReactElement, ReactNode } from 'react';

import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { Nav, SSRProvider } from 'react-bootstrap';

import LinkMain from '../components/link/main';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => (
  <SSRProvider>
    <Nav className="justify-content-center mt-3">
      <Nav.Item>
        <LinkMain
          style={{
            fontSize: '18px',
            margin: '10px',
            textDecoration: 'underline',
          }}
          to="/"
        >
          Home
        </LinkMain>
      </Nav.Item>
    </Nav>
    <Component {...pageProps} />
  </SSRProvider>
);

export default MyApp;
