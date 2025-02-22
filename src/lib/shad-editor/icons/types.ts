import type { Editor } from '@tiptap/core';

export interface toolTipProps {
	delayDuration?: number;
	disabled?: boolean;
}

export interface ToolBarIconProps {
	editor: Editor;
	toolTipProps?: toolTipProps;
}
