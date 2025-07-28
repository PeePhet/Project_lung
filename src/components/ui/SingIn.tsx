"use client"
import React, { useActionState, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { signInUser } from "@/serverAction/signIn";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const initialState = {
    message: '',
    status: 404,
    user_id : ''
}



export default function SignIn_page() {
    const [state, formAction, pending] = useActionState(signInUser, initialState)
    const router = useRouter()

    useEffect(() => {
        // Redirect when sign-in successful and not pending
        if (state.status === 200 && !pending) {
            router.push("/survey");
            localStorage.setItem("_id" , state?.id_user)
        }
    }, [state, pending, router]);

    return (
        <Dialog >
            <DialogTrigger className="w-[25%] text-white max-xs:w-[50%]  h-[20%] rounded-xl shadow-xl cursor-pointer flex items-center justify-center text-xl font-bold bg-[#01929c] ">Sign In</DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <form action={formAction} className="flex flex-col gap-y-2">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" required className="border px-2 py-1" placeholder="email" />
                        <label htmlFor="pwd">Password</label>
                        <input type="text" id="username" name="pwd" required className="border px-2 py-1" placeholder="password" />
                        <p aria-live="polite" className="text-red">{state?.message}</p>
                        <Button disabled={pending} className="bg-[#01929c]" >Sign up</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
