export default {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				textAlign: 'left',
				id: '02b06982-5398-4f9a-b6d1-6ed65e9cff72',
				'data-toc-id': '02b06982-5398-4f9a-b6d1-6ed65e9cff72',
				level: 1
			},
			content: [{ type: 'text', text: 'Welcome to Edra Editor 🚀' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [
				{ type: 'text', text: 'Edra is a modern, extensible rich text editor built on top of ' },
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://edra.tsuzat.com',
								target: '_blank',
								rel: 'noopener noreferrer nofollow',
								class: null,
								title: null
							}
						}
					],
					text: 'link'
				},
				{ type: 'text', text: ' specifically for ' },
				{ type: 'text', marks: [{ type: 'bold' }], text: 'Svelte 5' },
				{
					type: 'text',
					text: '. It leverages shadcn-svelte for a beautiful, cohesive, and fully accessible writing experience right out of the box.'
				}
			]
		},
		{
			type: 'callout',
			attrs: { emoji: '💡' },
			content: [
				{
					type: 'paragraph',
					attrs: { textAlign: 'left' },
					content: [
						{ type: 'text', text: 'Tip: You can drag and drop blocks using the ' },
						{ type: 'text', marks: [{ type: 'bold' }], text: 'grip icon' },
						{ type: 'text', text: ' on the left, or type ' },
						{ type: 'text', marks: [{ type: 'code' }], text: '/' },
						{ type: 'text', text: ' to open the Slash Command menu!' }
					]
				}
			]
		},
		{
			type: 'heading',
			attrs: {
				textAlign: 'left',
				id: 'cb0f0888-693f-42fe-9742-fc711b53b6d3',
				'data-toc-id': 'cb0f0888-693f-42fe-9742-fc711b53b6d3',
				level: 2
			},
			content: [{ type: 'text', text: 'Powerful Features' }]
		},
		{
			type: 'taskList',
			content: [
				{
					type: 'taskItem',
					attrs: { checked: true },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: 'left' },
							content: [{ type: 'text', text: 'Notion-style drag and drop block handles' }]
						}
					]
				},
				{
					type: 'taskItem',
					attrs: { checked: true },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: 'left' },
							content: [{ type: 'text', text: 'Slash commands for quick formatting' }]
						}
					]
				},
				{
					type: 'taskItem',
					attrs: { checked: true },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: 'left' },
							content: [{ type: 'text', text: 'AI integration ready (callAI)' }]
						}
					]
				},
				{
					type: 'taskItem',
					attrs: { checked: false },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: 'left' },
							content: [{ type: 'text', text: 'Advanced media uploads & Iframe embedding' }]
						}
					]
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: 'left',
				id: '7c1d0b7b-7971-466d-86b0-c85ecb13ac1e',
				'data-toc-id': '7c1d0b7b-7971-466d-86b0-c85ecb13ac1e',
				level: 2
			},
			content: [{ type: 'text', text: 'Mermaid Diagrams & Code' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [
				{ type: 'text', text: 'Edra natively supports ' },
				{ type: 'text', marks: [{ type: 'bold' }], text: 'Mermaid' },
				{
					type: 'text',
					text: ' diagrams. Just create a code block and set the language to mermaid, or, use the slash command to add mermaid. '
				}
			]
		},
		{
			type: 'codeBlock',
			attrs: { language: 'mermaid' },
			content: [
				{
					type: 'text',
					text: 'graph TD\n    A[Need an Editor] --> B{Using Svelte 5?}\n    B -- Yes --> C[Install Edra]\n    B -- No --> D[Upgrade to Svelte 5]\n    C --> E[Enjoy writing!]'
				}
			]
		},
		{
			type: 'mermaid',
			attrs: { HTMLAttributes: {} },
			content: [
				{
					type: 'text',
					text: 'flowchart TD\n    A[Christmas] -->|Get money| B(Go shopping)\n    B --> C{Let me think}\n    C -->|One| D[Laptop]\n    C -->|Two| E[iPhone]\n    C -->|Three| F[fa:fa-car Car]'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [{ type: 'text', text: 'And standard syntax highlighted code blocks are built-in:' }]
		},
		{
			type: 'codeBlock',
			attrs: { language: 'go' },
			content: [
				{
					type: 'text',
					text: 'func binarySearch(arr []int, target int) int {\n\tleft, right := 0, len(arr)-1\n\n\tfor left <= right {\n\t\tmid := left + (right-left)/2\n\n\t\tif arr[mid] == target {\n\t\t\treturn mid\n\t\t} else if arr[mid] < target {\n\t\t\tleft = mid + 1\n\t\t} else {\n\t\t\tright = mid - 1\n\t\t}\n\t}\n\treturn -1\n}'
				}
			]
		},
		{
			type: 'heading',
			attrs: {
				textAlign: 'left',
				id: '244218c9-145c-4ccc-a68d-af7141c401f0',
				'data-toc-id': '244218c9-145c-4ccc-a68d-af7141c401f0',
				level: 2
			},
			content: [{ type: 'text', text: 'Tables' }]
		},
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Flavor' }]
								}
							]
						},
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: [911], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Description' }]
								}
							]
						}
					]
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [{ type: 'text', text: 'Shadcn UI' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [911], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [
										{
											type: 'text',
											text: 'Opinionated, beautifully styled components built with Tailwind.'
										}
									]
								}
							]
						}
					]
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [{ type: 'text', text: 'Headless' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [911], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: 'left' },
									content: [
										{
											type: 'text',
											text: 'Bring your own styles using raw CSS variables and components.'
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [
				{ type: 'text', text: 'Explore the Slash Command ( / ) to see what else you can build!' }
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: 'left',
				id: 'math-and-placeholders',
				'data-toc-id': 'math-and-placeholders',
				level: 2
			},
			content: [{ type: 'text', text: 'Math & Placeholders' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [
				{ type: 'text', text: 'Edra supports beautiful KaTeX math equations, use single dollar ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '$' },
				{ type: 'text', text: ' enclose for inline math expression and double dollar ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '$$' },
				{ type: 'text', text: ' enclose for block math.' }
			]
		},
		{
			type: 'blockMath',
			attrs: { latex: 'f(a) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z-a} dz' }
		},
		{
			type: 'paragraph',
			attrs: { textAlign: 'left' },
			content: [
				{
					type: 'text',
					text: 'And you can easily insert empty media placeholders that users can click to upload content:'
				}
			]
		},
		{ type: 'mediaPlaceholder', attrs: { mediaType: 'image' } },
		{ type: 'mediaPlaceholder', attrs: { mediaType: 'video' } },
		{ type: 'paragraph', attrs: { textAlign: null } }
	]
};
