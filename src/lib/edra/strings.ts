const strings = {
	command: {
		undo: 'Undo',
		redo: 'Redo',
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		link: 'Link',
		paragraph: 'Paragraph',
		bold: 'Bold',
		italic: 'Italic',
		underline: 'Underline',
		strikethrough: 'Strikethrough',
		blockQuote: 'BlockQuote',
		code: 'Inline Code',
		codeBlock: 'Code Block',
		superscript: 'Superscript',
		subscript: 'Subscript',
		alignLeft: 'Align Left',
		alignCenter: 'Align Center',
		alignRight: 'Align Right',
		alignJustify: 'Align Justify',
		bulletList: 'Bullet List',
		orderedList: 'Ordered List',
		taskList: 'Task List',
		imagePlaceholder: 'Image Placeholder',
		videoPlaceholder: 'Video Placeholder',
		audioPlaceholder: 'Audio Placeholder',
		iframePlaceholder: 'Iframe Placeholder',
		table: 'Table',
		inlineExpression: 'Inline Expression',
		blockExpression: 'Block Expression',
		horizontalRule: 'Horizontal Rule',

		formatGroup: 'Format',
		insertGroup: 'Insert'
	},
	dragHandle: {
		title: 'Drag Handle',
		turnInto: 'Turn into',
		insertNext: 'Insert Next',
		removeFormatting: 'Remove Formatting',
		duplicate: 'Duplicate',
		copy: 'Copy',
		delete: 'Delete Node'
	},
	editor: {
		headingPlaceholder: "What's the title?",
		paragraphPlaceholder: 'Write, press space for AI or / for commands',
		contentErrorTitle: 'Unable to load the content',
		contentErrorDescription: 'The content of this page might be corrupted.'
	},
	extension: {
		audio: {
			multiplePasteWarningTitle: 'Can not paste multiple files at once!',
			multiplePasteWarningDescription:
				'You can only paste one file at a time. Only the first file will be pasted.',
			pasteProcessing: 'Processing Pasted Audio',
			pasteError: 'Could not paste audio',
			multipleDropWarningTitle: 'Can not drop multiple files at once!',
			multipleDropWarningDescription:
				'You can only drop one file at a time. Only the first file will be dropped.',
			dropProcessing: 'Processing Dropped Audio',
			dropError: 'Could not upload audio',
			enterURLPrompt: 'Enter Audio URL',
			insertPlaceholder: 'Insert an audio',
			uploadProcessing: 'Uploading Audio File',
			openButton: 'Open',
			openError: 'Could not process audio files.',
			uploadTab: 'Upload',
			embedLinkTab: 'Embed Link',
			uploadButton: 'Upload Audio',
			embedLinkButton: 'Insert',
			embedLinkPlaceholder: 'Embed Audio'
		},
		code: {
			copy: 'Copy',
			copied: 'Copied!',
			plainText: 'Plain Text',
			searchLanguagePlaceholder: 'Search language...',
			searchLanguageEmpty: 'No Language found.'
		},
		iframe: {
			enterURLPrompt: 'Please enter the iframe URL',
			insertPlaceholder: 'Insert an iframe',
			openButton: 'Open',
			embedLinkPlaceholder: 'Embed Iframe',
			embedLinkButton: 'Insert'
		},
		image: {
			enterURLPrompt: 'Please enter the image URL',
			insertPlaceholder: 'Insert an image',
			uploadProcessing: 'Uploading Image File',
			openButton: 'Open',
			openError: 'Could not process image files.',
			uploadTab: 'Upload',
			embedLinkTab: 'Embed Link',
			uploadButton: 'Upload Image',
			embedLinkButton: 'Insert',
			embedLinkPlaceholder: 'Embed Image'
		},
		media: {
			back: 'Back',
			resizeLeft: 'Resize Left',
			resizeRight: 'Resize Right',
			alignLeft: 'Align Left',
			alignCenter: 'Align Center',
			alignRight: 'Align Right',
			moreOptions: 'More Options',
			caption: 'Caption',
			captionPlaceholder: 'Your Media Caption',
			duplicate: 'Duplicate',
			fullscreen: 'Full Screen',
			delete: 'Delete'
		},
		table: {
			selectCell: 'Select Cell',
			selectRow: 'Select Row',
			addRow: 'Add Row',
			addRowAfter: 'Add Row After',
			addRowBefore: 'Add Row Before',
			deleteRow: 'Delete Row',
			selectColumn: 'Select Column',
			addColumn: 'Add Column',
			addColumnAfter: 'Add Column After',
			addColumnBefore: 'Add Column Before',
			deleteColumn: 'Delete Column'
		},
		video: {
			multiplePasteWarningTitle: 'Can not paste multiple files at once!',
			multiplePasteWarningDescription:
				'You can only paste one file at a time. Only the first file will be pasted.',
			pasteProcessing: 'Processing Pasted Video',
			pasteError: 'Could not handle pasted video',
			multipleDropWarningTitle: 'Can not drop multiple files at once!',
			multipleDropWarningDescription:
				'You can only drop one file at a time. Only the first file will be processed.',
			dropProcessing: 'Processing Dropped Video',
			dropError: 'Could not upload video',
			enterURLPrompt: 'Please enter the video URL',
			insertPlaceholder: 'Insert a video',
			uploadProcessing: 'Uploading Video',
			openButton: 'Open',
			openError: 'Could not process video files.',
			uploadTab: 'Upload',
			embedLinkTab: 'Embed Link',
			uploadButton: 'Upload Video',
			embedLinkButton: 'Insert',
			embedLinkPlaceholder: 'Embed Video'
		}
	},
	menu: {
		link: {
			edit: 'Edit Link',
			copy: 'Copy Link',
			remove: 'Remove Link',
			save: 'Save',
			enterLinkPlaceholder: 'Type or paste a link',
			enterLinkButton: 'Set new link'
		},
		math: {
			enterExpressionPlaceholder: 'Enter Math Expression'
		},
		table: {
			headerColumn: 'Header Column',
			addColumnAfter: 'Add Column After',
			addColumnBefore: 'Add Column Before',
			moveColumnLeft: 'Move Column Left',
			moveColumnRight: 'Move Column Right',
			deleteColumn: 'Delete This Column',
			headerRow: 'Header Row',
			addRowAfter: 'Add Row After',
			addRowBefore: 'Add Row Before',
			moveRowUp: 'Move Row Up',
			moveRowDown: 'Move Row Down',
			deleteRow: 'Delete This Row'
		}
	},
	toolbar: {
		alignment: {
			buttonTitle: 'Alignment',
			dropdownTitle: 'Alignments'
		},
		color: {
			buttonTitle: 'Quick Colors',
			textColor: 'Text Color',
			textColors: 'Text Colors',
			highlightColor: 'Highlight Color',
			highlightColors: 'Highlight Colors',
			templateCharacter: 'A',
			default: 'Default',
			blue: 'Blue',
			red: 'Red',
			brown: 'Brown',
			green: 'Green',
			gray: 'Gray',
			orange: 'Orange',
			pink: 'Pink',
			purple: 'Purple',
			yellow: 'Yellow'
		},
		font: {
			buttonTitle: 'Font Size',
			dropdownTitle: 'Font Size',
			tiny: 'Tiny',
			smaller: 'Smaller',
			small: 'Small',
			default: 'Default',
			large: 'Large',
			extraLarge: 'Extra Large'
		},
		heading: {
			buttonTitle: 'Headings'
		},
		link: {
			buttonTitle: 'Link',
			insertLinkPlaceholder: 'Insert Link',
			insertLink: 'Insert Link'
		},
		list: {
			buttonTitle: 'Lists',
			dropdownTitle: 'Lists'
		},
		searchAndReplace: {
			buttonTitle: 'Search and Replace',
			showMore: 'Show More',
			goBack: 'Go Back',
			searchAndReplace: 'Search and Replace',
			searchPlaceholder: 'Search...',
			caseSensitive: 'Case Sensitive',
			goToPrevious: 'Go to Previous',
			goToNext: 'Go to Next',
			previous: 'Previous',
			next: 'Next',
			replacePlaceholder: 'Replace...',
			replace: 'Replace',
			replaceAll: 'Replace All'
		}
	}
};

export default strings;
