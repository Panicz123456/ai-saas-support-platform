import { ConvexError, v } from 'convex/values';

import { mutation, query } from '../_generated/server';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { MessageDoc, saveMessage } from '@convex-dev/agent';
import { components } from '../_generated/api';
import { paginationOptsValidator } from 'convex/server';

export const getMany = query({
	args: {
		contactSessionId: v.id('contactSession'),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);
		if (!session || session.expiredAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid Session',
			});
		}

		const conversations = await ctx.db
			.query('conversation')
			.withIndex('by_contact_session_id', (q) =>
				q.eq('contactSessionId', args.contactSessionId)
			)
			.order('desc')
			.paginate(args.paginationOpts);

		const conversationLastMessage = await Promise.all(
			conversations.page.map(async (conversations) => {
				let lastMessage: MessageDoc | null = null;

				const messages = await supportAgent.listMessages(ctx, {
					threadId: conversations.threadId,
					paginationOpts: { numItems: 1, cursor: null },
				});

				if (messages.page.length > 0) {
					lastMessage = messages.page[0] ?? null;
				}

				return {
					_id: conversations._id,
					creationTime: conversations._creationTime,
					status: conversations.status,
					organizationId: conversations.organizationId,
					threadId: conversations.threadId,
					lastMessage,
				};
			})
		);

		return {
			...conversations,
			page: conversationLastMessage,
		};
	},
});

export const getOne = query({
	args: {
		conversationId: v.id('conversation'),
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);
		if (!session || session.expiredAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid Session',
			});
		}

		const conversation = await ctx.db.get(args.conversationId);

		if (!conversation) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Conversation not found',
			});
		}

		if (conversation.contactSessionId !== session._id) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Incorrect Session',
			});
		}

		return {
			_id: conversation._id,
			status: conversation.status,
			threadId: conversation.threadId,
		};
	},
});

export const create = mutation({
	args: {
		organizationId: v.string(),
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);

		if (!session || session.expiredAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid session',
			});
		}

		const widgetSettings = await ctx.db
			.query('widgetSettings')
			.withIndex('by_organization_id', (q) =>
				q.eq("organizationId", session.organizationId)
			)
			.unique()

		const { threadId } = await supportAgent.createThread(ctx, {
			userId: args.organizationId,
		});

		await saveMessage(ctx, components.agent, {
			threadId,
			message: {
				role: 'assistant',
				content: widgetSettings?.greetMessage ||  'Hello, how can I help you today?',
			},
		});

		const conversationId = await ctx.db.insert('conversation', {
			contactSessionId: session._id,
			status: 'unresolved',
			organizationId: args.organizationId,
			threadId,
		});

		return conversationId;
	},
});
