"use client"
import React, { useActionState, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { registerUser } from "@/serverAction/signIn";
import { Button } from "./ui/button";

const initialState = {
    message: '',
    status: 404,
}



export default function Register_page() {
    const [state, formAction, pending] = useActionState(registerUser, initialState)
    return (
        <Dialog >
            <DialogTrigger className="w-[25%] text-white max-xs:w-[50%] h-[20%] rounded-xl shadow-xl cursor-pointer flex items-center justify-center text-xl font-bold bg-[#01929c] ">Register    </DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Register</DialogTitle>
                    <form action={formAction} className="flex flex-col gap-y-2">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required className="border px-2 py-1" placeholder="username" />
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" required className="border px-2 py-1" placeholder="email" />
                        <label htmlFor="pwd">Password</label>
                        <input type="text" id="username" name="pwd" required className="border px-2 py-1" placeholder="password" />
                        <p aria-live="polite">{state?.message}</p>
                        <Button disabled={pending} className="bg-[#01929c]">Register</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
