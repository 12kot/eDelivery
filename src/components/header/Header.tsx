import React, { ReactElement } from "react";
import Head from "./header/Head";
import Footer from "./footer/Footer";

const Header = (): ReactElement => {
    return (<>
        <Head />
        <Footer />
    </>);
}

export default Header;