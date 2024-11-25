import React from "react";
import { Footer } from "./common/Footer";
import Header from "./common/Header";

function Page(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}

export default Page;
