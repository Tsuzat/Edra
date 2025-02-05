
export function getHandlePaste(editor) {
	return (view, event, slice) => {
		const item = event.clipboardData?.items[0]

		if (item?.type.indexOf("image") !== 0) {
			return false;
		}
		
 		const file = item.getAsFile()
		let filesize = ((file.size/1024)/1024).toFixed(4)
		
		if (filesize > 10) {
			window.alert(`too large image! filesize: ${filesize} mb`)
			return false
		}
		
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = e => {
			editor.commands.setImage({src: e.target.result})
		};
		
		return true
	}
}