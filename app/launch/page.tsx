"use client"
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { UserManager } from "oidc-client-ts";
import React, { useEffect, useState } from "react";

export default function Launch() {
    
    const userManager = new UserManager({
        authority: 'https://app.meldrx.com',
        client_id: '92ab67b9df5c445cabc89c476bcbfdab',
        redirect_uri: 'http://localhost:3000/callback',
        response_type: 'code',
    });
   
    const [extraQueryParams, setExtraQueryParams] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (typeof window !== "undefined") {  // Ensure it's running in the browser
            const params = window.location.search
                .split("?")[1]
                ?.split("&")
                .map((param) => param.split("="));

            const queryParams: { [key: string]: string } = {};

            if (params) {
                for (const kv of params) {
                    queryParams[kv[0] === "iss" ? "aud" : kv[0]] = kv[1];
                }
            }

            setExtraQueryParams(queryParams);
        }
    }, []);

    userManager.signinRedirect({
        scope: 'openid profile launch patient/*.*',
        extraQueryParams
    })
    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection:'column', gap: '20px' }}>
            <Image src="/assets/logo/heart_logo.png" alt="logo" width={100} height={100} />
            <h2 className="font-bold">
                Redirecting, Please Wait...
            </h2>
        </div>
    );
}
