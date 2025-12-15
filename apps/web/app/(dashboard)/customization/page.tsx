import { Protect } from '@clerk/nextjs';

import { CustomizationView } from '@/modules/customization/ui/views/customization-view';
import { PremiumFeaturesOverlay } from '@/modules/billing/ui/components/premium-features-overlay';

const Page = () => {
	return (
		<Protect
			condition={(has) => has({ plan: "pro" })}
			fallback={ 
				<PremiumFeaturesOverlay>
					<CustomizationView />
				</PremiumFeaturesOverlay>
			}
		>
			<CustomizationView />;
		</Protect>
	);
};

export default Page;
