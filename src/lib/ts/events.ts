import type { FileAttachment } from './files';
import { formatDate } from './dates';

export type EventLink = {
	label?: string;
	href?: string;
};

export type EventEntry = {
	id?: string;
	title: string;
	slug?: string;
	linkType?: 'article' | 'external';
	href?: string;
	date: string;
	endDate?: string;
	location?: string;
	summary?: string;
	image?: string;
	content?: string;
	tags?: string[];
	teamMembers?: string[];
	links?: EventLink[];
	gallery?: string[];
	files?: FileAttachment[];
};

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Past';

export function eventHref(event: EventEntry, base = '/events'): string {
	return `${base}/${event.slug || event.id}`;
}

export function eventLink(event: EventEntry, base = '/events'): { href: string; external: boolean } {
	if (event.linkType === 'external' && event.href) {
		return { href: event.href, external: true };
	}
	return { href: eventHref(event, base), external: false };
}

export function eventStatusClass(status: EventStatus): string {
	if (status === 'Ongoing') return 'bg-gmu-gold text-gmu-green-dark';
	if (status === 'Upcoming') return 'bg-gmu-green-light text-gmu-green';
	return 'bg-slate-100 text-slate-500';
}

function dayNumber(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
	if (match) {
		return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
	}
	const parsed = new Date(trimmed);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed.getUTCFullYear() * 10000 + (parsed.getUTCMonth() + 1) * 100 + parsed.getUTCDate();
}

export function eventStatus(event: EventEntry): EventStatus {
	const start = dayNumber(event.date ?? '');
	if (start === null) return 'Upcoming';
	const end = dayNumber(event.endDate ?? '') ?? start;
	const now = new Date();
	const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
	if (today < start) return 'Upcoming';
	if (today > end) return 'Past';
	return 'Ongoing';
}

function timeValue(event: EventEntry): number {
	const time = Date.parse(event.date ?? '');
	return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

export function compareEvents(first: EventEntry, second: EventEntry): number {
	const firstPast = eventStatus(first) === 'Past';
	const secondPast = eventStatus(second) === 'Past';
	if (firstPast !== secondPast) return firstPast ? 1 : -1;
	const firstTime = timeValue(first);
	const secondTime = timeValue(second);
	return firstPast ? secondTime - firstTime : firstTime - secondTime;
}

export function formatEventRange(start: string, end?: string): string {
	const startText = formatDate(start);
	if (!end || !end.trim()) return startText;
	const endText = formatDate(end);
	if (endText === startText) return startText;
	return `${startText} - ${endText}`;
}
