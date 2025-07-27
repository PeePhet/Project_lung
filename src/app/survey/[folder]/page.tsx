import Navbar from "@/components/Navbar";
import Main_box from "@/components/Main_box";
import Sub_main from "@/components/Sub_main";

import FullSignalCanvas from "./components/FullSignalCanvas";

export default function AnalysePage() {
  return (
    <Main_box>
      <Navbar>
      </Navbar>
      <Sub_main>
        <FullSignalCanvas />
      </Sub_main>

    </Main_box >

  );
}
