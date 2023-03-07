import React from 'react';

import Head from 'next/head';

import HomeMain from '../view/screens/home/main';

const HomeIndex: React.FC = () => (
  <>
    <Head>
      <title>People Directory</title>
      <meta
        name="description"
        content="Add, update and Explore people database in this People's directory."
      />
    </Head>
    <HomeMain />
  </>
);

export default HomeIndex;
