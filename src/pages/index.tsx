import { type NextPage } from "next";
import Head from "next/head";

import { Timeline } from "~/components/Timeline";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twitter-Buns</title>
        <meta name="description" content="Twitter's bunnies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Timeline />
      </div>
    </>
  );
};

export default Home;
