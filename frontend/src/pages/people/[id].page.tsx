import React from 'react';

import Head from 'next/head';

import PersonDetails from '../../view/screens/people/person/details';

const PeopleID: React.FC = () => (
  <>
    <Head>
      <title>Person Details</title>
    </Head>
    <PersonDetails />
  </>
);

export default PeopleID;
