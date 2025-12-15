import { Protect } from "@clerk/nextjs";

import { VapiView } from "@/modules/plugins/ui/views/vapi-view";
import { PremiumFeaturesOverlay } from "@/modules/billing/ui/components/premium-features-overlay";

const Page = () => {
	return (
		<Protect
			condition={(has) => has({ plan: 'pro' })}
			fallback={
				<PremiumFeaturesOverlay>
					<VapiView />
				</PremiumFeaturesOverlay>
			}
		>
			<VapiView />;
		</Protect>
	);
};

export default Page;
