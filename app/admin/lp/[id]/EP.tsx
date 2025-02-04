"use client";

import React from "react";
import dynamic from "next/dynamic";

// Importa o LandingPageBuilder de forma dinâmica, desativando o SSR
const EditPageBuilder = dynamic(() => import("@/app/admin/lp/[id]/EditPage"), {
    ssr: false, // ❌ Impede a execução no servidor, evitando o erro com `window`
});

export default function EditPage() {
    return <EditPageBuilder />;
}
