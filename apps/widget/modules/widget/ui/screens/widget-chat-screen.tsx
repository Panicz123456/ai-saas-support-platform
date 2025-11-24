'use client';

import { useQuery } from 'convex/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeftIcon, MenuIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom } from '@/modules/widget/atoms/widget-atoms';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';

export const WidgetChatScreen = () => {
	const setScreen = useSetAtom(screenAtom)
	const setConversationId = useSetAtom(conversationIdAtom)

	const conversationId = useAtomValue(conversationIdAtom)
	const organizationId = useAtomValue(organizationIdAtom)
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || "" )
	)

	const conversation = useQuery(
		api.public.conversation.getOne,
		conversationId && contactSessionId ? {
			conversationId,
			contactSessionId
		} : "skip"
	)
	
	return (
		<>
			<WidgetHeader className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<Button
						onClick={() => { 
							setScreen("selection")
							setConversationId(null)
						}} 
						size="icon"
						variant="transparent"
					>
						<ArrowLeftIcon />
					</Button>
					<p>Chat</p>
				</div>
				<Button
					size="icon"
					variant="transparent"
				>
					<MenuIcon />
				</Button>
			</WidgetHeader>
			<div className="flex flex-1 flex-col gap-y-4 p-4">
				{JSON.stringify(conversation, null, 2)}
			</div>
		</>
	);
};
