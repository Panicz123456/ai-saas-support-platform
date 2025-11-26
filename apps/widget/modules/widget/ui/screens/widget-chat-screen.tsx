'use client';

import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAction, useQuery } from 'convex/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, MenuIcon } from 'lucide-react';
import { toUIMessages, useThreadMessages } from '@convex-dev/agent/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Form, FormField } from '@workspace/ui/components/form';
import { AIResponse } from '@workspace/ui/components/ai/response';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import {
	AIConversation,
	AIConversationContent,
} from '@workspace/ui/components/ai/conversation';
import {
	AIMessage,
	AIMessageContent,
} from '@workspace/ui/components/ai/message';
import {
	AIInput,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from '@workspace/ui/components/ai/input';

import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { chatFormSchema, chatFormSchemaType } from '@/modules/widget/ui/schema';
import {
	contactSessionIdAtomFamily,
	conversationIdAtom,
	organizationIdAtom,
	screenAtom,
} from '@/modules/widget/atoms/widget-atoms';

export const WidgetChatScreen = () => {
	const setScreen = useSetAtom(screenAtom);
	const setConversationId = useSetAtom(conversationIdAtom);

	const conversationId = useAtomValue(conversationIdAtom);
	const organizationId = useAtomValue(organizationIdAtom);
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || '')
	);

	const conversation = useQuery(
		api.public.conversation.getOne,
		conversationId && contactSessionId
			? {
					conversationId,
					contactSessionId,
				}
			: 'skip'
	);

	const messages = useThreadMessages(
		api.public.messages.getMany,
		conversation?.threadId && contactSessionId
			? {
					threadId: conversation.threadId,
					contactSessionId,
				}
			: 'skip',
		{
			initialNumItems: 10,
		}
	);

	const { canLoadMore, handleLoadMore, isLoadingMore, topElementRef } =
		useInfiniteScroll({
			status: messages.status,
			loadMore: messages.loadMore,
			loadSize: 10,
		});

	const form = useForm<chatFormSchemaType>({
		resolver: zodResolver(chatFormSchema),
		defaultValues: {
			message: '',
		},
	});

	const createMessage = useAction(api.public.messages.create);
	const onSubmit = async (values: chatFormSchemaType) => {
		if (!conversation) {
			return;
		}

		form.reset();

		await createMessage({
			threadId: conversation.threadId,
			prompt: values.message,
			contactSessionId: contactSessionId as Id<'contactSession'>,
		});
	};

	return (
		<>
			<WidgetHeader className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<Button
						onClick={() => {
							setScreen('selection');
							setConversationId(null);
						}}
						size="icon"
						variant="transparent"
					>
						<ArrowLeftIcon />
					</Button>
					<p>Chat</p>
				</div>
				<Button size="icon" variant="transparent">
					<MenuIcon />
				</Button>
			</WidgetHeader>
			<AIConversation>
				<AIConversationContent>
					<InfiniteScrollTrigger
						canLoadMore={canLoadMore}
						isLoadingMore={isLoadingMore}
						onLoadMore={handleLoadMore}
						ref={topElementRef}
					/>
					{toUIMessages(messages.results ?? [])?.map((message) => {
						return (
							<AIMessage
								from={message.role === 'user' ? 'user' : 'assistant'}
								key={message.id}
							>
								<AIMessageContent>
									<AIResponse>{message.text}</AIResponse>
								</AIMessageContent>
								{message.role === 'assistant' && (
									<DicebearAvatar
										imageUrl="/logo.svg"
										seed="assistant"
										size={32}
									/>
								)}
							</AIMessage>
						);
					})}
				</AIConversationContent>
			</AIConversation>
			{/* TODO: add suggestion */}
			<Form {...form}>
				<AIInput
					className="rounded-none border-x-0 border-b-0"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="message"
						disabled={conversation?.status === 'resolved'}
						render={({ field }) => (
							<AIInputTextarea
								disabled={conversation?.status === 'resolved'}
								onChange={field.onChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										form.handleSubmit(onSubmit)();
									}
								}}
								placeholder={
									conversation?.status === 'resolved'
										? 'This conversation has been resolved'
										: 'Type your message...'
								}
								value={field.value}
							/>
						)}
					/>
					<AIInputToolbar>
						<AIInputTools />
						<AIInputSubmit
							disabled={
								conversation?.status === 'resolved' || !form.formState.isValid
							}
							status="ready"
							type="submit"
						/>
					</AIInputToolbar>
				</AIInput>
			</Form>
		</>
	);
};
