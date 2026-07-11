import { base } from '$app/paths';

export type NavLink = {
	label: string;
	path: string;
};

export type SiteContact = {
	department?: string;
	address?: string[];
	email?: string;
};

export type SiteLink = {
	href?: string;
	icon?: string;
};

export function siteLinkIcon(link: SiteLink): string {
	return link.icon?.trim() || 'mdi:link-variant';
}

export function siteLinkLabel(link: SiteLink): string {
	try {
		return new URL(link.href ?? '').hostname.replace(/^www\./, '');
	} catch {
		return link.href ?? '';
	}
}

export type SiteFeatured = {
	title?: string;
	body?: string;
	image?: string;
	imageAlt?: string;
	link?: string;
	callToAction?: string;
};

export type SiteInfo = {
	logo?: string;
	labName?: string;
	institution?: string;
	tagline?: string;
	intro?: string;
	featuredProject?: SiteFeatured;
	contact?: SiteContact;
	links?: SiteLink[];
	showAccessibility?: boolean;
	alerts?: SiteAlert[];
	highlights?: SiteHighlight[];
};

export type SiteAlert = {
	message?: string;
	level?: string;
	link?: string;
	linkText?: string;
	dismissible?: boolean;
	active?: boolean;
};

export type SiteHighlight = {
	title?: string;
	body?: string;
	image?: string;
	link?: string;
	linkText?: string;
	location?: string;
	active?: boolean;
};

export const highlightLocations = {
	allTop: 'Top of every page',
	allBottom: 'Bottom of every page',
	homeHero: 'Homepage below hero',
	homeFooter: 'Homepage above footer'
} as const;

export const siteNav: NavLink[] = [
	{ label: 'Home', path: '' },
	{ label: 'Research', path: 'research' },
	{ label: 'Projects', path: 'projects' },
	{ label: 'Publications', path: 'publications' },
	{ label: 'Team', path: 'team' },
	{ label: 'News', path: 'news' },
	{ label: 'Events', path: 'events' },
	{ label: 'Gallery', path: 'gallery' }
];

export const basePath = base;
