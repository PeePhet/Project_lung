import Link from "next/link";
import lung_svg from "../../public/lungs.svg"
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_box from "@/components/Main_box";
import Sub_main from "@/components/Sub_main";
import Footer_component from "@/components/Footer_component";

export default function Home() {
  return (
    <Main_box>
        <Navbar>
        </Navbar>
      <Sub_main>
        <div className="flex flex-col items-center gap-y-10">
          <Image src={lung_svg} alt="" width={250} height={100} />
          <h1 className="text-2xl font-semibold mt-4">LungSketch</h1>
        </div>
      </Sub_main>
      <Footer_component>
        <Link href={"/survey"} className="w-[80%] bg-fuchsia-300 h-[20%] rounded-xl shadow-xl cursor-pointer">
                <h5> Let's start it</h5>
        </Link>
        <Link href={""} className="w-[80%] bg-fuchsia-300 h-[20%] rounded-xl shadow-xl cursor-pointer">
          <button type="button">History</button>
        </Link>
      </Footer_component>
    </Main_box>
      
  );
}
