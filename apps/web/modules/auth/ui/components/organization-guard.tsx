"use client"

import { useOrganization } from "@clerk/nextjs"

import { OrgSelectorView } from "@/modules/auth/ui/views/org-selector-view"

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => { 
  const { organization } = useOrganization()

  if (!organization) { 
    return (
      <div className="min-h-screen min-w-screen h-full flex flex-col items-center justify-center">
        <OrgSelectorView />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen min-w-screen h-full flex flex-col items-center justify-center">
      {children}
    </div>
  )
}