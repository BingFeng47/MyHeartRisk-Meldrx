"use client"
import Image from "next/image";
import { UserManager } from "oidc-client-ts";
import React, { useEffect, useState } from "react";

export default function Launch() {
    
    const userManager = new UserManager({
        authority: 'https://app.meldrx.com',
        client_id: '92ab67b9df5c445cabc89c476bcbfdab',
        redirect_uri: 'https://cds-test.vercel.app/callback',
        response_type: 'code',
    });
   
    const [extraQueryParams, setExtraQueryParams] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (typeof window !== "undefined") {  // Ensure it's running in the browser
            const params = new URLSearchParams(window.location.search);
            const issUrl = params.get("iss"); // Get the "iss" parameter
    
            const queryParams: { [key: string]: string } = {};
    
            params.forEach((value, key) => {
                queryParams[key === "iss" ? "aud" : key] = value;
            });
    
            if (issUrl) {
                // Extract Workspace ID from the iss URL
                const workspaceId = issUrl.split("/").pop(); // Gets last part of URL
                queryParams["workspaceId"] = workspaceId || "";
    
                // 🔹 Store workspace ID for later use
                localStorage.setItem("workspace_id", String(workspaceId));
                console.log("Workspace ID:", workspaceId);

            }
    
            setExtraQueryParams(queryParams);
        }
    }, []);

    userManager.signinRedirect({
        scope: "openid profile launch patient/*.*",
        extraQueryParams: {
            ...extraQueryParams, // Spread existing params
            workspace_id: extraQueryParams.workspaceId // Pass the extracted workspace ID
        }
    });
    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection:'column', gap: '20px' }}>
            <Image src="/assets/logo/heart_logo.png" alt="logo" width={100} height={100} />
            <h2 className="font-bold">
                Redirecting, Please Wait...
            </h2>
        </div>
    );
}
