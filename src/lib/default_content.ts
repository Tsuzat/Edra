export default {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				textAlign: 'center',
				id: '83d3ba41-ff49-4efc-b093-e12d171930d7',
				'data-toc-id': '83d3ba41-ff49-4efc-b093-e12d171930d7',
				level: 1
			},
			content: [{ type: 'text', text: 'Welcome to Edra' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'Edra is a fast, light weight, feature rich, modern and beautiful note taking application with native AI integration. Click on the drag-handle (on the left which follows your cursor) and see more options. '
				}
			]
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: 'Hello' }]
						}
					]
				}
			]
		},
		{
			type: 'orderedList',
			attrs: { start: 1, type: null },
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: 'Hello' }]
						}
					]
				}
			]
		},
		{
			type: 'taskList',
			content: [
				{
					type: 'taskItem',
					attrs: { checked: false },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: 'Hello World' }]
						}
					]
				}
			]
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: '2d844bdf-9700-4cfb-bec7-2e962974f414',
				'data-toc-id': '2d844bdf-9700-4cfb-bec7-2e962974f414',
				level: 3
			},
			content: [{ type: 'text', text: 'Typography ' }]
		},
		{ type: 'horizontalRule' },
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'In Edra, we support modern typography like ' },
				{ type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
				{ type: 'text', text: ',' },
				{ type: 'text', marks: [{ type: 'italic' }], text: ' italic' },
				{ type: 'text', text: ', ' },
				{ type: 'text', marks: [{ type: 'strike' }], text: 'strike' },
				{ type: 'text', text: ', ' },
				{ type: 'text', marks: [{ type: 'underline' }], text: 'underline' },
				{ type: 'text', text: ', superscript A' },
				{ type: 'text', marks: [{ type: 'superscript' }], text: 'b' },
				{ type: 'text', text: ', subscript A' },
				{ type: 'text', marks: [{ type: 'subscript' }], text: 'b' },
				{ type: 'text', text: ', ' },
				{ type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
				{ type: 'text', text: ', in line' },
				{ type: 'inlineMathReplacer', attrs: { latex: '\\LaTeX' } },
				{ type: 'text', text: ', ' },
				{
					type: 'text',
					marks: [{ type: 'highlight', attrs: { color: '#7D0404' } }],
					text: 'text highlight'
				},
				{ type: 'text', text: ', ' },
				{
					type: 'text',
					marks: [{ type: 'textStyle', attrs: { color: 'rgb(131, 6, 156)', fontSize: '' } }],
					text: 'text color'
				},
				{ type: 'text', text: ' and many more. ' }
			]
		},
		{ type: 'paragraph', attrs: { textAlign: null } },
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'You can also preview colors by typing their hex code. e.g. #00FFFF, #000FFF, #FF0000 etc.'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'You can also have some cool typography short hands which converts '
				},
				{ type: 'text', marks: [{ type: 'code' }], text: '1/2' },
				{ type: 'text', text: ' to ½ , ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '!=' },
				{ type: 'text', text: ' to ≠, ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '->' },
				{
					type: 'text',
					text: ' to → and many more. You can change the style of this entire paragraph (or node) by clicking on drag-handle on left and choosing something. Explore it please. '
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: '3f4464f6-cfbc-443c-a735-c73408b19e8d',
				'data-toc-id': '3f4464f6-cfbc-443c-a735-c73408b19e8d',
				level: 3
			},
			content: [
				{ type: 'text', text: 'Slash Command and ' },
				{
					type: 'text',
					marks: [{ type: 'textStyle', attrs: { color: 'rgb(131, 6, 156)', fontSize: '' } }],
					text: 'AI'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'The editor supports the slash commands, just type ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '/' },
				{
					type: 'text',
					text: ' anywhere and you’ll get an option to perform or insert things. You can insert images, videos, tables, audios, iframe, block mathematical expressions using slash commands.'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'Editor has native AI integration. Using AI features will require you to logged in and have AI Credits with you. You can request upto '
				},
				{ type: 'text', marks: [{ type: 'bold' }], text: '5000' },
				{
					type: 'text',
					text: ' AI credits for free, for the playgroud explorations. Check it out in '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.Edra.ink/#pricing',
								target: '_tab',
								rel: 'noopener noreferrer nofollow',
								class: null
							}
						}
					],
					text: 'pricing'
				},
				{ type: 'text', text: '.' }
			]
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: 'cd63bf51-22f1-450d-9c4f-5358f92fe7d0',
				'data-toc-id': 'cd63bf51-22f1-450d-9c4f-5358f92fe7d0',
				level: 3
			},
			content: [{ type: 'text', text: 'How to use AI??' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'You can either highlight certain part and check on Ask AI on bubble menu or click on the drag-handle on the left to select the whole paragraph (or node) to process it for AI. Please try it now.'
				}
			]
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					attrs: { textAlign: null },
					content: [
						{
							type: 'text',
							text: 'Highlight the next paragraph (problem) or select it using drag-handle to ask something. Or just press on “solve problem”. '
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', marks: [{ type: 'bold' }], text: 'Problem' },
				{
					type: 'text',
					text: ': If the mass of the earth is to be twice and its radius is to be half, how much would I weigh if my current weight is 150 lbs.'
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: 'a7762e4a-fa7e-4f9b-8db4-1c1b4b54a81f',
				'data-toc-id': 'a7762e4a-fa7e-4f9b-8db4-1c1b4b54a81f',
				level: 3
			},
			content: [{ type: 'text', text: 'Tables' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'You can insert the tables using ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '/table' },
				{ type: 'text', text: ' (slash table). Explore this ' }
			]
		},
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: [134], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Sr. No' }]
								}
							]
						},
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: [149], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Items' }]
								}
							]
						},
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: [115], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Quantity' }]
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
							attrs: { colspan: 1, rowspan: 1, colwidth: [134], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: '1' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [149], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Mangos' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [115], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: '10' }]
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
							attrs: { colspan: 1, rowspan: 1, colwidth: [134], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: '2' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [149], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Apples' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [115], style: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: '7' }]
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
							attrs: { colspan: 1, rowspan: 1, colwidth: [134], style: null },
							content: [{ type: 'paragraph', attrs: { textAlign: null } }]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [149], style: null },
							content: [{ type: 'paragraph', attrs: { textAlign: null } }]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: [115], style: null },
							content: [{ type: 'paragraph', attrs: { textAlign: null } }]
						}
					]
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: '6285c4e0-406a-4bf6-b87d-7c4e07d29ba4',
				'data-toc-id': '6285c4e0-406a-4bf6-b87d-7c4e07d29ba4',
				level: 3
			},
			content: [{ type: 'text', text: 'Code Blocks' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'You can add a code block using ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '```python' },
				{ type: 'text', text: ' (enter), or using ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '/' },
				{ type: 'text', text: ' (slash command).' }
			]
		},
		{
			type: 'codeBlock',
			attrs: { language: 'go' },
			content: [
				{
					type: 'text',
					text: 'func twoSum(nums []int, target int) []int { \n\tvar res []int\n\tmp := make(map[int]int)\n\tfor idx, val := range nums {\n\t\ttoBeSearched := target - val\n\t\tif _, ok := mp[toBeSearched]; ok {\n\t\t\tres = append(res, mp[toBeSearched], idx)\n\t\t\tbreak\n\t\t}\n\t\tmp[val] = idx\n\t}\n\treturn res\n}'
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: 'dfc1e2a9-351e-452f-9b1b-20e556999411',
				'data-toc-id': 'dfc1e2a9-351e-452f-9b1b-20e556999411',
				level: 3
			},
			content: [{ type: 'text', text: 'Medias and Placeholders' }]
		},
		{ type: 'paragraph', attrs: { textAlign: null } },
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'You can use urls and raw files to add medias like images, videos and audios. You can also embedd iframes. Use '
				},
				{ type: 'text', marks: [{ type: 'code' }], text: '/' },
				{ type: 'text', text: ' (slash) command to access them. ' }
			]
		},
		{ type: 'paragraph', attrs: { textAlign: null } },
		{ type: 'paragraph', attrs: { textAlign: null } },
		{ type: 'paragraph', attrs: { textAlign: null } },
		{
			type: 'image',
			attrs: {
				src: 'https://media.istockphoto.com/id/508030340/photo/sunny-cat.jpg?s=612x612&w=0&k=20&c=qkz-Mf32sbJnefRxpB7Fwpcxbp1fozYtJxbQoKvSeGM=',
				alt: null,
				title: 'Caption: This cat is just too cute',
				width: '100%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'video',
			attrs: {
				src: 'https://cdn.pixabay.com/video/2016/09/22/5631-183849543_large.mp4',
				alt: null,
				title: 'This dog is just too cute, but is thirsty',
				width: '100%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'audio',
			attrs: {
				src: 'https://cdn.pixabay.com/audio/2024/10/30/audio_42e6870f29.mp3',
				alt: null,
				title: null,
				width: '100%',
				height: null,
				align: 'left'
			}
		},
		{
			type: 'iframe',
			attrs: {
				src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.5643876340596!2d75.17451197508399!3d20.026789421437474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb93bd138ae4bd%3A0x574c6482cf0b89cf!2sEllora%20Caves!5e0!3m2!1sen!2sin!4v1766417703396!5m2!1sen!2sin',
				alt: null,
				title: 'Ellora Caves as ancient temples',
				width: '100%',
				height: null,
				align: 'left'
			}
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: 'c12f5108-ed9c-4d15-86a7-e46deeb815a5',
				'data-toc-id': 'c12f5108-ed9c-4d15-86a7-e46deeb815a5',
				level: 3
			},
			content: [{ type: 'text', text: 'Lists' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'We support 3 types of lists, un-ordered, ordered and task lists. You can use shortcuts to get them.'
				}
			]
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [
								{ type: 'text', text: 'Use ' },
								{ type: 'text', marks: [{ type: 'code' }], text: '-' },
								{ type: 'text', text: ' then space bar to create unordered list' }
							]
						}
					]
				}
			]
		},
		{
			type: 'orderedList',
			attrs: { start: 1, type: null },
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [
								{ type: 'text', text: 'Use ' },
								{ type: 'text', marks: [{ type: 'code' }], text: '1' },
								{ type: 'text', text: ' then space bar to create unordered list' }
							]
						}
					]
				}
			]
		},
		{
			type: 'taskList',
			content: [
				{
					type: 'taskItem',
					attrs: { checked: false },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [
								{ type: 'text', text: 'Use ' },
								{ type: 'text', marks: [{ type: 'code' }], text: '[]' },
								{ type: 'text', text: ' then space bar to create tasks list' }
							]
						}
					]
				},
				{
					type: 'taskItem',
					attrs: { checked: true },
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: 'You can toggle them, but clicking on the box.' }]
						}
					]
				}
			]
		},
		{ type: 'horizontalRule' },
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				id: 'a8bae23b-0ef4-4b8b-b37b-a3379a54e153',
				'data-toc-id': 'a8bae23b-0ef4-4b8b-b37b-a3379a54e153',
				level: 3
			},
			content: [{ type: 'text', text: 'Math Expressions' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'You can insert math expressions by enclosing expressions with ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '$$' },
				{ type: 'text', text: ' or using bubble menu. You can insert block expressions using ' },
				{ type: 'text', marks: [{ type: 'code' }], text: '/' },
				{ type: 'text', text: ' (slash) commands (As ' },
				{ type: 'text', marks: [{ type: 'italic' }], text: 'block expressions' },
				{ type: 'text', text: ').' }
			]
		},
		{
			type: 'blockMath',
			attrs: {
				latex:
					'\\text{If } \\ \nM =\n\\begin{bmatrix}\na_{11} & a_{12} \\\\\na_{21} & a_{22} \\\\\na_{31} & a_{32}\n\\end{bmatrix};\n\n\\text{then its transpose is}\n;\\ \nM^{T} =\n\\begin{bmatrix}\na_{11} & a_{21} & a_{31} \\\\\na_{12} & a_{22} & a_{32}\n\\end{bmatrix}'
			}
		},
		{ type: 'horizontalRule' },
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [{ type: 'text', text: 'What More??…' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [{ type: 'text', text: 'You can check these notes, without even logging in.' }]
		},
		{
			type: 'orderedList',
			attrs: { start: 1, type: null },
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [
								{
									type: 'text',
									marks: [
										{
											type: 'link',
											attrs: {
												href: 'https://www.Edra.ink/note-preview-cd6b66a2-c6f9-43c2-b6ea-57e1512c95fd',
												target: '_tab',
												rel: 'noopener noreferrer nofollow',
												class: null
											}
										}
									],
									text: 'Probability Note'
								}
							]
						}
					]
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [
								{
									type: 'text',
									marks: [
										{
											type: 'link',
											attrs: {
												href: 'https://www.Edra.ink/note-preview-ad5176fd-147b-4f52-9292-c087c11bd079',
												target: '_tab',
												rel: 'noopener noreferrer nofollow',
												class: null
											}
										}
									],
									text: 'Matrices'
								}
							]
						}
					]
				}
			]
		},
		{ type: 'paragraph', attrs: { textAlign: null } },
		{ type: 'paragraph', attrs: { textAlign: null } }
	]
};
