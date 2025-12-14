import { ConvexError, v } from 'convex/values'
import { internal } from '../_generated/api'
import { action } from '../_generated/server'
import { getSecretValue, parseSecretString } from '../lib/secrets'

export const getVapiSecrets = action({ 
  args: { 
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      }
    );

    if (!plugin) { 
      return null;
    }

    const secretName = plugin.secretName;
    const secret = await getSecretValue(secretName);
    const secretData = parseSecretString<{
			publicApiKey: string;
      privateApiKey: string;
    }>(secret);
    
    if (!secretData) { 
      throw new ConvexError({ 
        code: "NOT_FOUND",
        message: "Secret Data not found"
      })
    }

    if (!secretData.publicApiKey) { 
      throw new ConvexError({ 
        code: "NOT_FOUND",
        message: "Public API Key secret Data not found"
      })
    }
    if (!secretData.privateApiKey) { 
      throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Privet API Key secret Data not found',
			});
    }

    return {
			publicApiKey: secretData.publicApiKey
		};
  }
})