"use client";

import * as React from "react";
import {  Provider as JotaiProvider} from 'jotai'
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <JotaiProvider>
        {children}
      </JotaiProvider>
    </ConvexProvider>
  )
}
