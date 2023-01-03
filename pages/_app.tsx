import type { AppProps } from "next/app";
import "../styles/home.css";
import { ChakraProvider, theme } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
