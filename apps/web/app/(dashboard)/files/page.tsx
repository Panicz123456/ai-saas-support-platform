import { Protect } from '@clerk/nextjs';

import { FilesView } from '@/modules/files/ui/views/files-view';
import { PremiumFeaturesOverlay } from '@/modules/billing/ui/components/premium-features-overlay';

const Page = () => {
	return (
		<Protect
			condition={(has) => has({ plan: 'pro' })}
			fallback={
				<PremiumFeaturesOverlay>
					<FilesView />
				</PremiumFeaturesOverlay>
			}
		>
			<FilesView />
		</Protect>
	);
};

export default Page;
