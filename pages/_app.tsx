import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp); 