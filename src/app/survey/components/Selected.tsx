'use client'
import { useState } from "react";
import Cards from "./Cards";
import Link from "next/link";

export default function Selected() {
    const [selectedSymtom , setSelectSymtom] = useState<string>("")
    const [anotherSelect , setAnotherSelect] = useState<boolean>(false)
     const symptoms_text = [
        { name: "Cold symptoms", src_img: "cold" , symtom_str : "cold" },
        { name: "Cough", src_img: "cough" },
        { name: "Phlegm symptoms", src_img: "medical" , symtom_str :  "Phlegm"},
        { name: "Runny nose", src_img: "runny_nose" , symtom_str : "nose" },
        { name: "Difficulty breathing", src_img: "difficult_breathing" , symtom_str : "breathing" },
        { name: "Chest pain", src_img: "chest_pain" , symtom_str :  "Chest"},
    ];

    return (
        <div className={`w-[30%] h-auto flex flex-col items-center gap-y-3 max-xs:w-[75%]`}>
            <h2 className="self-start  h-[10%]  flex items-center justify-center text-2xl font-bold max-xs:text-[18px] mb-3 "> Please select your symptoms. </h2>
            <div className="w-full h-auto grid grid-cols-2 justify-items-center items-center gap-2">
                {symptoms_text.map((item, index) => (
                    <Cards
                        key={index}
                        src_img={`${item.src_img}`}
                        text_str={item.name}
                        setSelectSymtomState={setSelectSymtom}
                        symtom_str={item.symtom_str as string}   
                        setAnotherSelectState={setAnotherSelect} 

                    />
                ))}
            </div>
            <h2 className="self-start mt-3 text-2xl font-bold max-xs:text-[18px] "> Another </h2>
            <label htmlFor="" className="self-center  border-2 rounded-xl px-5 py-2 w-[90%] inset-shadow-xs">
                <input type="text" className="outline-none w-full " value={anotherSelect ? selectedSymtom : "" }  placeholder="Type something..." onChange={(e)=> {
                    setSelectSymtom(e.target.value as string)
                    setAnotherSelect(true)
                    }} />
            </label>
            <Link href={"/survey/"+selectedSymtom} className="w-[50%] max-xs:w-[70%] flex justify-center items-center bg-[#e84d4d] px-5 py-3 rounded-2xl my-5 shadow-2xl inset-shadow-xs text-xl text-white font-bold max-xs:text-[18px] "> Begin analyse </Link>
        </div>
    );
}
