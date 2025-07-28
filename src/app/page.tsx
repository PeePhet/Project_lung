import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_box from "@/components/Main_box";
import Sub_main from "@/components/Sub_main";
import SignIn_page from "@/components/ui/SingIn";
import Register_page from "@/components/Register";

export default async function Home() {
  return (
    <Main_box>
      <Navbar>
      </Navbar>
      <Sub_main className_custom={"bg-linear-to-b from-[#005166] to-[#01929c] py-4"}>
        <div className="flex flex-col items-center justify-center gap-y-10 py-10 h-[70%]">
          <Image src={"/lungs_master.png"} alt="" width={250} height={100} />
          <h1 className="text-4xl font-semibold mt-4 text-white">LungSketch</h1>
        </div>
        <div className="w-full h-[30%] flex flex-col items-center justify-center gap-y-5">
          {/* <Link href={""} className="w-[25%] max-xs:w-[50%] bg-white h-[20%] rounded-xl shadow-xl cursor-pointer flex items-center justify-center text-xl font-bold ">
            <button type="button">History</button>
          </Link> */}
            <SignIn_page/>
            <Register_page/>
        </div>

      </Sub_main>

    </Main_box>

  );
}
