"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicPageBuilder = dynamic(() => import("@/app/[id]/DynamicPage"), {
    ssr: false,
});

export default function DynamicPage() {
    return <DynamicPageBuilder />;
}
