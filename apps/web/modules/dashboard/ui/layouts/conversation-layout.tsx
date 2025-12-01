import { ConversationPanel } from '@/modules/dashboard/ui/components/conversation-panel';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';

export const ConversationLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<ResizablePanelGroup className="h-full flex-1" direction="horizontal">
			<ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
				<ConversationPanel />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel className="h-ful" defaultSize={70}>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
