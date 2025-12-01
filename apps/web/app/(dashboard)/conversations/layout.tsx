import { ConversationLayout } from '@/modules/dashboard/ui/layouts/conversation-layout';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return <ConversationLayout>{children}</ConversationLayout>;
};

export default Layout;
