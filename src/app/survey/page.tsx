import Main_box from "@/components/Main_box";
import Navbar from "@/components/Navbar";
import Sub_main from "@/components/Sub_main";
import Selected from "./components/Selected";
export default function Survey() {

    return (
        <Main_box>
            <Navbar>
            </Navbar>
            <Sub_main>
                <Selected/>
            </Sub_main>
           
        </Main_box>
    );
}
