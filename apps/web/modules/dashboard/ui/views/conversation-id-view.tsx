'use client';

import { useMutation, useQuery } from 'convex/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Form, FormField } from '@workspace/ui/components/form';
import { AIResponse } from '@workspace/ui/components/ai/response';
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from '@workspace/ui/components/ai/conversation';
import {
	AIInput,
	AIInputButton,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from '@workspace/ui/components/ai/input';
import {
	AIMessage,
	AIMessageContent,
} from '@workspace/ui/components/ai/message';
import {
	chatFormSchema,
	chatFormSchemaType,
} from '@/modules/dashboard/ui/schema';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';

interface Props {
	conversationId: Id<'conversation'>;
}

export const ConversationIdView = ({ conversationId }: Props) => {
	const conversation = useQuery(api.private.conversation.getOne, {
		conversationId,
	});

	const messages = useThreadMessages(
		api.private.messages.getMany,
		conversation?.threadId ? { threadId: conversation.threadId } : 'skip',
		{
			initialNumItems: 10,
		}
	);

	const form = useForm<chatFormSchemaType>({
		resolver: zodResolver(chatFormSchema),
		defaultValues: {
			message: '',
		},
	});

	const createMessage = useMutation(api.private.messages.create);

	const onSubmit = async (values: chatFormSchemaType) => {
		try {
			await createMessage({
				conversationId,
				prompt: values.message
			});

			form.reset()
		} catch (error) {
			console.error(error)
		}
	};

	return (
		<div className="flex h-full flex-col bg-muted">
			<div className="flex items-center justify-between border-b bg-background p-2.5">
				<Button size="sm" variant="ghost">
					<MoreHorizontalIcon />
				</Button>
			</div>
			<AIConversation className="max-h-[calc(100%-180px)]">
				<AIConversationContent>
					{toUIMessages(messages.results ?? [])?.map((message) => (
						<AIMessage
							key={message.id}
							from={message.role === 'user' ? 'assistant' : 'user'}
						>
							<AIMessageContent>
								<AIResponse>{message.text}</AIResponse>
							</AIMessageContent>
							{message.role === 'user' && (
								<DicebearAvatar
									seed={conversation?.contactSessionId ?? 'user'}
									size={32}
								/>
							)}
						</AIMessage>
					))}
				</AIConversationContent>
				<AIConversationScrollButton />
			</AIConversation>

			<div className="p-2">
				<Form {...form}>
					<AIInput onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							disabled={conversation?.status === 'resolved'}
							name="message"
							render={({ field }) => (
								<AIInputTextarea
									disabled={
										conversation?.status === 'resolved' ||
										form.formState.isSubmitting
									}
									onChange={field.onChange}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											form.handleSubmit(onSubmit)();
										}
									}}
									placeholder={
										conversation?.status === 'resolved'
											? 'This conversation had been resolved'
											: 'Type your response as an operator...'
									}
									value={field.value}
								/>
							)}
						/>
						<AIInputToolbar>
							<AIInputTools>
								<AIInputButton>
									<Wand2Icon />
									Enhance
								</AIInputButton>
							</AIInputTools>
							<AIInputSubmit
								disabled={
									conversation?.status === 'resolved' ||
									!form.formState.isValid ||
									form.formState.isSubmitting
								}
								status="ready"
								type="submit"
							/>
						</AIInputToolbar>
					</AIInput>
				</Form>
			</div>
		</div>
	);
};
