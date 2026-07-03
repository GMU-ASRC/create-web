export type Publication = {
	id?: string;
	tag: string;
	authors: string;
	title: string;
	venue: string;
	date?: string;
	doi?: string;
	pdf?: string;
	video?: string;
	award?: string;
};

export type PublicationSection = {
	heading: string;
	entries: Publication[];
};

export type PublicationType = {
	label: string;
	prefix: string;
};

export const publicationTypes: PublicationType[] = [
	{ label: 'Journal Articles', prefix: 'J' },
	{ label: 'Conference Proceedings', prefix: 'C' },
	{ label: 'Book Chapters', prefix: 'BC' }
];

export type RawPublication = {
	id: string;
	type: string;
	title: string;
	authors: string;
	venue: string;
	date?: string;
	doi?: string;
	pdf?: string;
	award?: string;
};

export function sectionsFromPublications(publications: RawPublication[]): PublicationSection[] {
	const sections: PublicationSection[] = [];
	for (const type of publicationTypes) {
		const ofType = publications
			.filter((publication) => publication.type === type.label)
			.sort((first, second) => (first.date ?? '').localeCompare(second.date ?? ''));
		if (ofType.length === 0) continue;
		const entries: Publication[] = ofType.map((publication, index) => ({
			id: publication.id,
			tag: `${type.prefix}-${index + 1}`,
			authors: publication.authors,
			title: publication.title,
			venue: publication.venue,
			date: publication.date,
			doi: publication.doi,
			pdf: publication.pdf,
			award: publication.award
		}));
		entries.reverse();
		sections.push({ heading: type.label, entries });
	}
	return sections;
}

function escapeForRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function publicationsForMember(sections: PublicationSection[], name: string): Publication[] {
	const nameParts = name
		.trim()
		.split(/\s+/)
		.filter((part) => !part.endsWith('.') && part.length > 1);
	if (nameParts.length === 0) return [];
	const firstName = nameParts[0];
	const lastName = nameParts[nameParts.length - 1];
	const targets = Array.from(new Set([firstName, lastName]));
	const patterns = targets.map((target) => new RegExp(`\\b${escapeForRegExp(target)}\\b`, 'i'));
	const matches: Publication[] = [];
	for (const section of sections) {
		for (const entry of section.entries) {
			if (patterns.some((pattern) => pattern.test(entry.authors))) {
				matches.push(entry);
			}
		}
	}
	return matches;
}
