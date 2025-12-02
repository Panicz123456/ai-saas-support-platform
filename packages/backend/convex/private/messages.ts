import { generateText } from 'ai';
import { ConvexError, v } from 'convex/values';
import { saveMessage } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';

import { action, mutation, query } from '../_generated/server';
import { components } from '../_generated/api';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { openai } from '@ai-sdk/openai';
import { ar } from 'zod/v4/locales';

export const enhanceResponse = action({
	args: {
		prompt: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (identity === null) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Organization Id not found',
			});
		}

		const response = await generateText({
			model: openai('gpt-4o-mini'),
			messages: [
				{
					role: 'system',
					content: 'Enhance the operator message to be more professional, clear and helpful while maintaining the original meaning',
				},
				{
					role: "user",
					content: args.prompt
				}
			],
		});

		return response.text
	},
});

export const create = mutation({
	args: {
		prompt: v.string(),
		conversationId: v.id('conversation'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (identity === null) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Organization Id not found',
			});
		}

		const conversation = await ctx.db.get(args.conversationId);

		if (!conversation) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'conversation not found',
			});
		}

		if (conversation.organizationId !== orgId) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid organization id',
			});
		}

		if (conversation.status === 'resolved') {
			throw new ConvexError({
				code: 'BAD_REQUEST',
				message: 'Conversation is already resolved',
			});
		}

		await saveMessage(ctx, components.agent, {
			threadId: conversation.threadId,
			agentName: identity.familyName,
			message: {
				role: 'assistant',
				content: args.prompt,
			},
		});
	},
});

export const getMany = query({
	args: {
		threadId: v.string(),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (identity === null) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Organization Id not found',
			});
		}

		const conversation = await ctx.db
			.query('conversation')
			.withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
			.unique();

		if (!conversation) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Conversation not found',
			});
		}

		if (conversation.organizationId !== orgId) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid organization id',
			});
		}

		const paginated = await supportAgent.listMessages(ctx, {
			threadId: args.threadId,
			paginationOpts: args.paginationOpts,
		});

		return paginated;
	},
});
