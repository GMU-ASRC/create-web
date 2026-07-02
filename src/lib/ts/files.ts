export type FileAttachment = {
	name: string;
	path: string;
};

const fileIcons: Array<[RegExp, string]> = [
	[/\.pdf$/i, 'mdi:file-pdf-box'],
	[/\.(zip|rar|7z|tar|gz|bz2)$/i, 'mdi:folder-zip-outline'],
	[/\.(doc|docx|odt|rtf)$/i, 'mdi:file-word-outline'],
	[/\.(xls|xlsx|csv|ods)$/i, 'mdi:file-excel-outline'],
	[/\.(ppt|pptx|odp)$/i, 'mdi:file-powerpoint-outline'],
	[/\.(txt|md)$/i, 'mdi:file-document-outline'],
	[/\.(mp3|wav|ogg|flac|m4a|aac)$/i, 'mdi:file-music-outline'],
	[/\.(png|jpg|jpeg|gif|webp|svg|avif)$/i, 'mdi:file-image-outline'],
	[/\.(mp4|webm|mov|mkv|avi|m4v)$/i, 'mdi:file-video-outline']
];

export function fileIcon(name: string): string {
	for (const [pattern, icon] of fileIcons) {
		if (pattern.test(name)) return icon;
	}
	return 'mdi:file-outline';
}
