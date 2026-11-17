"use client";

import dynamic from "next/dynamic";

export const VillageMap = dynamic(
    () => import("./village-map").then((mod) => mod.VillageMap),
    { ssr: false }
);