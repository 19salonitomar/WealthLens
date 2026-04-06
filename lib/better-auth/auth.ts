import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import type { Db } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();

    const db = mongoose.connection.getClient().db() as unknown as Db;

    if (!db) throw new Error("MongoDB connection not found");

    authInstance = betterAuth({
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

export const auth = {
    api: {
        signUpEmail: async (args: unknown) => {
            const instance = await getAuth();
            return instance.api.signUpEmail(args as any);
        },

        signInEmail: async (args: unknown) => {
            const instance = await getAuth();
            return instance.api.signInEmail(args as any);
        },

        signOut: async (args: unknown) => {
            const instance = await getAuth();
            return instance.api.signOut(args as any);
        },

        getSession: async (args: unknown) => {
            const instance = await getAuth();
            return instance.api.getSession(args as any);
        },
    },
};