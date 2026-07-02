export type NavLink = {
	label: string;
	path: string;
};

export type SiteContact = {
	department?: string;
	address?: string[];
	email?: string;
};

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
	{ label: 'Gallery', path: 'gallery' },
	{ label: 'Team', path: 'team' },
	{ label: 'Publications', path: 'publications' },
	{ label: 'News', path: 'news' }
];

export const basePath = '';
