'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { CopyIcon } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';

import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { INTEGRATION, IntegrationId } from '@/modules/integration/constants';
import { Separator } from '@workspace/ui/components/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { createScript } from '@/modules/integration/utils';

export const IntegrationView = () => {
  const [open, onOpenChange] = useState(false)
  const [selectedSnipped, setSelectedSnipped] = useState("") 
	const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: IntegrationId) => { 
    if (!organization) {
      toast.error("Organization ID not found")
      return;
    }

    const snippet = createScript(integrationId, organization.id)
    setSelectedSnipped(snippet)
    onOpenChange(true)
  }

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(organization?.id ?? '');
			toast.success('Copied to clipboard');
		} catch {
			toast.error('Failed to copy a clipboard');
		}
	};

  return (
		<>
      <IntegrationDialog
        open={open}
        onOpenChange={onOpenChange}
        snipped={selectedSnipped}
      />
			<div className="flex min-h-screen flex-col p-8">
				<div className="mx-auto w-full max-w-screen-md">
					<div className="space-y-2">
						<h1 className="text-2xl md:text-4xl">Setup & Integration</h1>
						<p className="text-muted-foreground">
							Choose the integration that&apos;s right for you
						</p>
					</div>
					<div className="mt-8 space-y-6">
						<div className="flex items-center gap-4">
							<Label className="w-34" htmlFor="website-id">
								Organization ID
							</Label>
							<Input
								disabled
								id="organization-id"
								readOnly
								value={organization?.id ?? ''}
								className="flex-1 bg-background font-mono text-sm"
							/>
							<Button className="gap-2" onClick={handleCopy} size="sm">
								<CopyIcon className="size-4" />
								Copy
							</Button>
						</div>
					</div>

					<Separator className="my-8" />
					<div className="space-y-6">
						<div className="space-y-1">
							<Label className="text-lg">Integration</Label>
							<p className="text-muted-foreground text-sm">
								Add the following code to your website to enable the chatbox.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{INTEGRATION.map((integration) => (
								<button
									className="flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
									key={integration.id}
									onClick={() =>handleIntegrationClick(integration.id)}
									type="button"
								>
									<Image
										width={32}
										height={32}
										alt={integration.title}
										src={integration.icon}
									/>
									<p>{integration.title}</p>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const IntegrationDialog = ({
	open,
	onOpenChange,
	snipped,
}: {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	snipped: string;
  }) => {
  
  const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(snipped);
			toast.success('Copied to clipboard');
		} catch {
			toast.error('Failed to copy a clipboard');
		}
	};
  
  return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Integration with your website</DialogTitle>
					<DialogDescription>
						Follow this steps to add chatbox to your website
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					<div className="space-y-2">
						<div className="rounded-md bg-accent p-2 text-sm">
							1. Copy the following code
						</div>
						<div className="group relative">
							<pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
								{snipped}
							</pre>
							<Button
								className="absolute top-4 right-6 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={handleCopy}
								size="icon"
								variant="secondary"
							>
								<CopyIcon className="size-3" />
							</Button>
						</div>
					</div>
					<div className="space-y-2">
						<div className="rounded-md bg-accent p-2 text-sm">
							2. Add the code in your page
						</div>
						<p className="text-muted-foreground text-sm">
							Paste the chatbox code in your page. You can add it in the HTML
							head section.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
