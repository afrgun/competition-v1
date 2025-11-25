import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        {/* Module Federation Script Injection Point */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
