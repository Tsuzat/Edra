export const uploadCode = `// A typical file upload handler
async function handleFileUpload(file: File): Promise<string> {
	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch('/api/upload', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		throw new Error('Upload failed');
	}

	const data = await response.json();
	return data.url; // Return the public URL of the uploaded media
}`;

export const shadcnUsageCode = `<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';

	// Simple file upload handler
	async function handleFileUpload(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Failed to upload file');
		}

		const data = await response.json();
		return data.url; // Must return the public URL string
	}

	const editor = createEditor({
		onFileUpload: handleFileUpload,
		onUpdate: () => {
			console.log(editor?.getHTML());
		}
	});
</script>

<div class="border rounded-lg p-2">
	<Edra {editor}>
		<Edra.Toolbar class="border-b p-1" />
		<Edra.Content class="min-h-60 px-4 py-2" />
	</Edra>
</div>`;

export const headlessUsageCode = `<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/headless/index.js';

	// File upload handler
	async function handleFileUpload(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Failed to upload file');
		}

		const data = await response.json();
		return data.url;
	}

	const editor = createEditor({
		onFileUpload: handleFileUpload,
		onUpdate: () => {
			console.log(editor?.getHTML());
		}
	});
</script>

<div class="demo-container">
	<Edra {editor}>
		<Edra.Toolbar class="demo-toolbar" />
		<Edra.Content class="demo-content" />
	</Edra>
</div>`;
