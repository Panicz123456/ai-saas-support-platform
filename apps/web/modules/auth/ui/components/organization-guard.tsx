'use client';

import { useOrganization } from '@clerk/nextjs';
import { AuthLayout } from '@/modules/auth/ui/layouts/auth-layout';
import { OrgSelectorView } from '@/modules/auth/ui/views/org-selector-view';

export const OrganizationGuard = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { organization } = useOrganization();

	if (!organization) {
		return (
			<AuthLayout>
				<OrgSelectorView />
			</AuthLayout>
		);
	}

	return <>{children}</>;
};
