import { ConversationIdView } from '@/modules/dashboard/ui/views/conversation-id-view';
import { Id } from '@workspace/backend/_generated/dataModel';

interface Props {
	params: Promise<{
		conversationId: string;
	}>;
}

const Page = async ({ params }: Props) => {
	const { conversationId } = await params;

	return <ConversationIdView conversationId={conversationId as Id<'conversation'>} />;
};

export default Page;
