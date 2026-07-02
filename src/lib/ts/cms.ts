import { env } from '$env/dynamic/public';
import type { NewsEntry } from './news';
import type { ResearchProject } from './research';
import type { ResearchArticle } from './researchArticles';
import type { PublicationSection, RawPublication } from './publications';
import { sectionsFromPublications } from './publications';
import type { Education, Member, MemberGroup } from './group';
import type { Sponsor } from './home';
import type { GalleryItem } from './gallery';

const base = (env.PUBLIC_CMS_URL ?? '').replace(/\/$/, '');

export const cmsConfigured = Boolean(base);

export function resolveAsset(path: string | undefined): string | undefined {
	if (!path) return path;
	if (/^https?:\/\//.test(path)) return path;
	if (path.startsWith('/api/files/')) return `${base}${path}`;
	return path;
}

function absolutizeAssets(html: string): string {
	if (!base || !html) return html;
	return html.replace(/(["'(])\/api\/files\//g, `$1${base}/api/files/`);
}

function resolveFiles(files: unknown): Array<{ name: string; path: string }> {
	if (!Array.isArray(files)) return [];
	return files
		.map((file) => ({
			name: String((file as { name?: unknown })?.name ?? ''),
			path: resolveAsset(String((file as { path?: unknown })?.path ?? '')) ?? ''
		}))
		.filter((file) => file.path);
}

function normalizeEducation(education: unknown): Education[] {
	if (!Array.isArray(education)) return [];
	return education
		.map((entry) => {
			if (typeof entry === 'string') {
				return { degree: entry, institution: '', years: '' };
			}
			const item = (entry ?? {}) as Partial<Education>;
			return {
				degree: item.degree ?? '',
				institution: item.institution ?? '',
				years: item.years ?? ''
			};
		})
		.filter((entry) => entry.degree || entry.institution || entry.years);
}

const cacheTtlMs = 60_000;
const responseCache = new Map<string, { time: number; data: unknown }>();

async function fetchContent(type: string): Promise<unknown | null> {
	if (!base) return null;
	const url = `${base}/api/content/${type}`;
	const cached = responseCache.get(url);
	if (cached && Date.now() - cached.time < cacheTtlMs) return cached.data;
	try {
		const response = await fetch(url);
		if (!response.ok) return null;
		const data = await response.json();
		responseCache.set(url, { time: Date.now(), data });
		return data;
	} catch {
		return null;
	}
}

async function fetchList<T>(type: string): Promise<T[] | null> {
	const data = await fetchContent(type);
	return Array.isArray(data) ? (data as T[]) : null;
}

async function fetchOne<T>(type: string): Promise<T | null> {
	const data = await fetchContent(type);
	return (data ?? null) as T | null;
}

const preloaded = new Set<string>();

export function preloadImages(urls: Array<string | undefined>): void {
	if (typeof Image === 'undefined') return;
	for (const url of urls) {
		if (!url || preloaded.has(url)) continue;
		preloaded.add(url);
		const image = new Image();
		image.src = url;
	}
}

type TeamMember = Member & { role?: string; group?: string };

export const cms = {
	async news(): Promise<NewsEntry[] | null> {
		const items = await fetchList<NewsEntry>('news');
		if (!items) return null;
		const timeOf = (value?: string) => {
			const time = Date.parse(value ?? '');
			return Number.isNaN(time) ? -Infinity : time;
		};
		return items
			.map((item) => ({
				...item,
				body: absolutizeAssets(item.body ?? ''),
				gallery: (item.gallery ?? []).map((path) => resolveAsset(path) ?? '').filter(Boolean),
				files: resolveFiles(item.files)
			}))
			.sort((first, second) => timeOf(second.date) - timeOf(first.date));
	},

	async projects(): Promise<ResearchProject[] | null> {
		const projects = await fetchList<ResearchProject>('projects');
		return (
			projects?.map((project) => ({
				...project,
				image: resolveAsset(project.image) ?? '',
				summary: absolutizeAssets(project.summary ?? ''),
				content: absolutizeAssets(project.content ?? ''),
				gallery: (project.gallery ?? [])
					.map((path) => resolveAsset(path) ?? '')
					.filter(Boolean),
				files: resolveFiles(project.files)
			})) ?? null
		);
	},

	async sponsors(): Promise<Sponsor[] | null> {
		const sponsors = await fetchList<Sponsor>('sponsors');
		return sponsors?.map((sponsor) => ({ ...sponsor, image: resolveAsset(sponsor.image) ?? '' })) ?? null;
	},

	async gallery(): Promise<GalleryItem[] | null> {
		const items = await fetchList<GalleryItem>('gallery');
		return (
			items
				?.map((item) => ({ ...item, image: resolveAsset(item.image) ?? '' }))
				.filter((item) => item.image) ?? null
		);
	},

	async publications(): Promise<PublicationSection[] | null> {
		const raw = await fetchList<RawPublication>('publications');
		if (!raw) return null;
		const resolved = raw.map((publication) => ({
			...publication,
			pdf: resolveAsset(publication.pdf)
		}));
		return sectionsFromPublications(resolved);
	},

	async siteInfo<T>(): Promise<T | null> {
		return fetchOne<T>('siteInfo');
	},

	async team(): Promise<{ professor: Member; groups: MemberGroup[] } | null> {
		const members = await fetchList<TeamMember>('team');
		if (!members) return null;
		const resolved = members.map((member) => ({
			...member,
			photo: resolveAsset(member.photo) ?? '',
			bio: absolutizeAssets(member.bio ?? ''),
			education: normalizeEducation(member.education),
			socials: (member.socials ?? []).filter((social) => social.href && social.href.trim())
		}));
		const professor = resolved.find((member) => member.role === 'professor');
		if (!professor) return null;
		const groups: MemberGroup[] = [];
		for (const member of resolved) {
			if (member.role === 'professor') continue;
			const heading = member.group ?? 'Members';
			let group = groups.find((entry) => entry.heading === heading);
			if (!group) {
				group = { heading, members: [] };
				groups.push(group);
			}
			group.members.push(member);
		}
		return { professor, groups };
	},

	async articles(): Promise<ResearchArticle[] | null> {
		return fetchList<ResearchArticle>('researchArticles');
	},

	async article(slug: string): Promise<ResearchArticle | null> {
		const articles = await fetchList<ResearchArticle>('researchArticles');
		const article = articles?.find((entry) => entry.slug === slug);
		if (!article) return null;
		return {
			...article,
			content: absolutizeAssets(article.content ?? ''),
			blocks: (article.blocks ?? []).map((block) => ({ ...block, image: resolveAsset(block.image) })),
			gallery: (article.gallery ?? []).map((path) => resolveAsset(path) ?? '').filter(Boolean),
			files: resolveFiles(article.files)
		};
	}
};

export function relatedSectionsFrom(
	sections: PublicationSection[],
	ids: string[]
): PublicationSection[] {
	const wanted = new Set(ids);
	return sections
		.map((section) => ({
			heading: `Related ${section.heading}`,
			entries: section.entries.filter((entry) => entry.id !== undefined && wanted.has(entry.id))
		}))
		.filter((section) => section.entries.length > 0);
}
