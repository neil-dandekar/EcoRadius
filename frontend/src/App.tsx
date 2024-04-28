import { Analytics } from "@vercel/analytics/react";
import Scan from "./Scan.tsx";

export const App = () => {
  return (
    <>
      <Scan />
      <Analytics />
    </>
  );
};

export default App;
