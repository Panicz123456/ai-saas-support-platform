import { OrganizationList } from "@clerk/nextjs"

export const OrgSelectorView = () => { 
  return (
		<OrganizationList
			afterCreateOrganizationUrl="/"
			afterSelectOrganizationUrl="/"
			hidePersonal
			skipInvitationScreen
		/>
	);
}