'use client';

import { useAtomValue } from 'jotai';

import { screenAtom } from '@/modules/widget/atoms/widget-atoms';

import { WidgetChatScreen } from '@/modules/widget/ui/screens/widget-chat-screen';
import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';
import { WidgetErrorScreen } from '@/modules/widget/ui/screens/widget-error-screen';
import { WidgetLoadingScreen } from '@/modules/widget/ui/screens/widget-loading-screen';
import { WidgetSelectionScreen } from '@/modules/widget/ui/screens/widget-selection-screen';
import { WidgetInboxScreen } from '@/modules/widget/ui/screens/widget-inbox-screen';
import { WidgetVoiceScreen } from '@/modules/widget/ui/screens/widget-voice-screen';
import { WidgetContactScreen } from '@/modules/widget/ui/screens/widget-contact-screen';

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
		inbox: <WidgetInboxScreen />,
		voice: <WidgetVoiceScreen />,
		contact: <WidgetContactScreen />,
	};

	return (
		<main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
			{screenComponents[screen]}
		</main>
	);
};
