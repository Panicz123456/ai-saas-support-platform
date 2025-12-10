'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import {
	GlobeIcon,
	PhoneCallIcon,
	PhoneIcon,
	WorkflowIcon,
} from 'lucide-react';

import {
	Feature,
	PluginCard,
} from '@/modules/plugins/ui/components/plugin-card';
import { api } from '@workspace/backend/_generated/api';
import { useForm } from 'react-hook-form';
import { vapiSchema, vapiSchemaType } from '@/modules/plugins/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@workspace/ui/components/form';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { VapiConnectedView } from '@/modules/plugins/ui/components/vapi-connected-view';

const vapiFeatures: Feature[] = [
	{
		icon: GlobeIcon,
		label: 'Web voice calls',
		description: 'Voice chat directly in your app',
	},
	{
		icon: PhoneIcon,
		label: 'Phone numbers',
		description: 'Get dedicated business lines for your customers',
	},
	{
		icon: PhoneCallIcon,
		label: 'Outbound calls',
		description: 'Automate outbound calls to your customers',
	},
	{
		icon: WorkflowIcon,
		label: 'Workflows',
		description: 'Custom conversation flows for your customers',
	},
];

const VapiPluginForm = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	const upsertSecret = useMutation(api.private.secrets.upsert);
	const form = useForm<vapiSchemaType>({
		resolver: zodResolver(vapiSchema),
		defaultValues: {
			privateApiKey: '',
			publicApiKey: '',
		},
	});

	const onSubmit = async (values: vapiSchemaType) => {
		try {
			await upsertSecret({
				service: 'vapi',
				value: {
					publicApiKey: values.publicApiKey,
					privateApiKey: values.privateApiKey,
				},
			});

			setOpen(false);
			toast.success('Vapi plugin connected');
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Enable Vapi</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Your API keys are safely encrypted and store using AWS Secrets Manager
				</DialogDescription>
				<Form {...form}>
					<form
						className="flex flex-col gap-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="publicApiKey"
							render={({ field }) => (
								<FormItem>
									<Label>Public API key</Label>
									<FormControl>
										<Input
											{...field}
											placeholder="Your public API key"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="privateApiKey"
							render={({ field }) => (
								<FormItem>
									<Label>Privet API key</Label>
									<FormControl>
										<Input
											{...field}
											placeholder="Your privet API key"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button disabled={form.formState.isSubmitted} type="submit">
								{form.formState.isSubmitting ? 'Connecting...' : 'Connect'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

const VapiPluginRemoveForm = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	const removePlugin = useMutation(api.private.plugins.remove);

	const onSubmit = async () => {
		try {
			await removePlugin({
				service: 'vapi',
			});
			setOpen(false);
			toast.success('Vapi plugin removed');
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Disconnect Vapi</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure you want disconnect the Vapi plugin?
				</DialogDescription>
				<DialogFooter>
					<Button onClick={onSubmit} variant="destructive">
						Disconnect
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const VapiView = () => {
	const vapiPlugin = useQuery(api.private.plugins.getOne, { service: 'vapi' });

	const [connectOpen, setConnectOpen] = useState(false);
	const [removeOpen, setRemoveOpen] = useState(false);

	const toggle = () => {
		if (vapiPlugin) {
			setRemoveOpen(true);
		} else {
			setConnectOpen(true);
		}
	};

	return (
		<>
			<VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
			<VapiPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />
			<div className="flex min-h-screen flex-col bg-muted p-8">
				<div className="mx-auto w-full max-w-screen-md">
					<div className="space-y-2">
						<h1 className="text-2xl md:text-4">Vapi Plugin</h1>
						<p className="text-muted-foreground">
							Connect Vapi to enable AI voice calls and phone support
						</p>
					</div>

					<div className="mt-8">
						{vapiPlugin ? (
							<VapiConnectedView onDisconnect={toggle} />
						) : (
							<PluginCard
								serviceImage="/vapi.jpg"
								serviceName="Vapi"
								features={vapiFeatures}
								isDisabled={vapiPlugin === undefined}
								onSubmit={toggle}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
