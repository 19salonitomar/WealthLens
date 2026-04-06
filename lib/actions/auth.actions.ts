'use server';

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
                                          email,
                                          password,
                                          fullName,
                                          country,
                                          investmentGoals,
                                          riskTolerance,
                                          preferredIndustry
                                      }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        });

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            });
        }

        return { success: true, data: response };

    } catch (e: any) {
        console.error('Sign up failed:', e);

        return {
            success: false,
            error: e?.message || 'Sign up failed'
        };
    }
};

export const signInWithEmail = async ({
                                          email,
                                          password
                                      }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: { email, password }
        });

        return { success: true, data: response };

    } catch (e: any) {
        console.error('Sign in failed:', e);

        return {
            success: false,
            error: e?.message || 'Invalid email or password'
        };
    }
};

export const signOut = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        });

        return { success: true };

    } catch (e: any) {
        console.error('Sign out failed:', e);

        return {
            success: false,
            error: e?.message || 'Sign out failed'
        };
    }
};