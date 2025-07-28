"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function User_info({user_name , email} : {user_name : string ,email : string }) {
    const router = useRouter()
    return (
        <div className="w-full h-[25vh] flex  items-center justify-center">
            <div className="w-[40%] flex  items-center justify-between max-xs:w-[95%]">
                <div className="flex items-center gap-x-10">
                    <Image src={"/profile.png"} alt={""} width={100} height={100} />
                    <div className="flex flex-col gap-y-5">
                        <h5 className="font-bold"> {user_name}</h5>
                        <h5 className="font-bold"> {email}</h5>
                    </div>
                </div>
                <Button className="bg-[#58b9bf]" onClick={()=> {
                    localStorage.clear()
                    router.push("/")
                }}> Sign out</Button>
            </div>
        </div>

    );
}
