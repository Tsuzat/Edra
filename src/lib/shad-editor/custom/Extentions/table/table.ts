import TiptapTable from '@tiptap/extension-table';

export const Table = TiptapTable.configure({
	resizable: true,
	lastColumnResizable: true,
	allowTableNodeSelection: true
});

export default Table;
