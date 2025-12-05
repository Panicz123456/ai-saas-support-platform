'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';

import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '@workspace/ui/components/dropzone';

interface UploadDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onFileUploaded?: () => void;
}

export const UploadDialog = ({
	open,
	onOpenChange,
	onFileUploaded,
}: UploadDialogProps) => {
	const addFile = useAction(api.private.files.addFile);

	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadForm, setUploadForm] = useState({
		category: '',
		filename: '',
	});

	const handleFileDrop = (acceptedFile: File[]) => {
		const file = acceptedFile[0];

		if (file) {
			setUploadedFiles([file]);
			if (!uploadForm.filename) {
				setUploadForm((prev) => ({ ...prev, filename: file.name }));
			}
		}
  };
  
  const handleUpload = async () => { 
    setIsUploading(true)
    try {
      const blob = uploadedFiles[0]

      if (!blob) { 
        return;
      }

      const filename = uploadForm.filename || blob.name;

      await addFile({ 
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      })

      onFileUploaded?.()
      handleCancel()
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => { 
    onOpenChange(false)
    setUploadedFiles([])
    setUploadForm({ 
      category: "",
      filename: ""
    })
  }

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Upload Document</DialogTitle>
					<DialogDescription>
						Upload a document to your knowledge base
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Input
							className="w-full"
							id="category"
							onChange={(e) =>
								setUploadForm((prev) => ({ ...prev, category: e.target.value }))
							}
							placeholder="e.g., Documentation, Support"
							type="text"
							value={uploadForm.category}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="filename">
							Filenname{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							className="w-full"
							id="filename"
							onChange={(e) =>
								setUploadForm((prev) => ({ ...prev, filename: e.target.value }))
							}
							placeholder="Override filename"
							type="text"
							value={uploadForm.filename}
						/>
					</div>

					<Dropzone
						accept={{
							'application/pdf': ['.pdf'],
							'text/csv': ['.csv'],
							'text/plain': ['.txt'],
						}}
						disabled={isUploading}
						maxFiles={1}
						onDrop={handleFileDrop}
						src={uploadedFiles}
					>
						<DropzoneEmptyState />
						<DropzoneContent />
					</Dropzone>
				</div>

				<DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
						Cancel
					</Button>
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || isUploading || !uploadForm.category}
          >
						{isUploading ? "Uploading..." : "Upload"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
