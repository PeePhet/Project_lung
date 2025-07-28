"use server";

import connect from "@/lib/db";
import User from "@/models/user";

export async function registerUser(init: any, formData: FormData) {
    await connect();
    const username = formData.get("username")
    const password = formData.get("pwd")
    const email = formData.get("email")
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return { message: "Username already exists", status: 404 };

    }

    const user = new User({ username, email, password });
    await user.save();

    return { message: "Registration complete", status: 200 };
}

export async function signInUser(init: any, formData: FormData) {
    await connect();
    const password = formData.get("pwd")
    const email = formData.get("email")
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return { message: "Invalid email or password", status: 404 };
    }

    return { message: "SignIn complete", status: 200, id_user: user._id.toString() };
}
