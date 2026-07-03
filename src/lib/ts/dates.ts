export const timeZone = 'America/New_York';

function parseDateOnly(value: string): { year: number; month: number; day: number } | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
	if (!match) return null;
	return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function formatDate(value: string): string {
	if (!value) return '';
	const dateOnly = parseDateOnly(value);
	if (dateOnly) {
		const month = String(dateOnly.month).padStart(2, '0');
		const day = String(dateOnly.day).padStart(2, '0');
		return `${month}/${day}/${dateOnly.year}`;
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone
	});
}

export function formatDateTime(value: string): string {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		timeZone,
		timeZoneName: 'short'
	});
}
