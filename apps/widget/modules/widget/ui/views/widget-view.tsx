'use client';

import { useAtomValue } from 'jotai';

import { screenAtom } from '@/modules/widget/atoms/widget-atoms';
// import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer"
// import { WidgetHeader } from "@/modules/widget/ui/components/widget-header"

import { WidgetChatScreen } from '@/modules/widget/ui/screens/widget-chat-screen';
import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';
import { WidgetErrorScreen } from '@/modules/widget/ui/screens/widget-error-screen';
import { WidgetLoadingScreen } from '@/modules/widget/ui/screens/widget-loading-screen';
import { WidgetSelectionScreen } from '@/modules/widget/ui/screens/widget-selection-screen';

interface Props {
	organizationId: string | null;
}

export const WidgetView = ({ organizationId }: Props) => {
	const screen = useAtomValue(screenAtom);

	const screenComponents = {
		auth: <WidgetAuthScreen />,
		error: <WidgetErrorScreen />,
		loading: <WidgetLoadingScreen organizationId={organizationId} />,
		selection: <WidgetSelectionScreen />,
		chat: <WidgetChatScreen />,
		voice: <p>TODO: voice screen</p>,
		inbox: <p>TODO: inbox screen</p>,
		contact: <p>TODO: contact screen</p>,
	};

	return (
		<main className=" min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
			{screenComponents[screen]}
			{/* <WidgetFooter /> */}
		</main>
	);
};
