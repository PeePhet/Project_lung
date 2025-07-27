import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function Cards({ src_img, text_str , setSelectSymtomState , symtom_str , setAnotherSelectState }: { src_img: string, text_str: string , setSelectSymtomState : Dispatch<SetStateAction<string>> , symtom_str : string , setAnotherSelectState : Dispatch<SetStateAction<boolean>>}) {
  return (
      <div
      tabIndex={0}
      className="w-full h-full bg-blue-200 flex flex-col hover:bg-blue-500 items-center gap-y-4 justify-center rounded-2xl focus:bg-blue-500 duration-100 cursor-pointer shadow-xl inset-shadow-xs group/item" onClick={()=> {
        setSelectSymtomState(symtom_str)
        setAnotherSelectState(false)
        }}>
        <Image
          src={`/${src_img}.png`}
          alt=""
          width={100}
          height={100}
        />
        <h2 className="group-hover/item:text-white group-focus/item:text-white"> {text_str}</h2>
      </div>

  );
}
