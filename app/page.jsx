

import Home from "./Home/home.js";
import Head from "next/head.js";


export default function Page() {
 return(
    <>
        <Head>
        <title>Your Page Title</title>
        <meta name="description" content="Your meta description goes here." />
    </Head>
  <main>
   <Home/>
  </main>
  </>
 )
}
