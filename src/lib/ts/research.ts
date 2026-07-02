import type { FileAttachment } from './files';

export type ProjectLink = {
	label?: string;
	href?: string;
};

export type ResearchProject = {
	id?: string;
	title: string;
	author?: string;
	years?: string;
	summary?: string;
	status?: string;
	featured?: boolean;
	tags?: string[];
	image: string;
	href: string;
	slug?: string;
	content?: string;
	teamMembers?: string[];
	funding?: string[];
	links?: ProjectLink[];
	gallery?: string[];
	files?: FileAttachment[];
	relatedPublications?: string[];
	linkType?: 'external' | 'article' | 'page';
};

export function projectLink(
	project: ResearchProject,
	researchBase: string,
	projectBase: string
): { href: string; external: boolean } {
	const wantsPage = project.linkType === 'page' || Boolean(project.content);
	const pageKey = project.slug || project.id;
	if (wantsPage && pageKey) {
		return { href: `${projectBase}/${pageKey}`, external: false };
	}
	const usesArticle = project.linkType === 'article' || (!project.linkType && Boolean(project.slug));
	if (usesArticle && project.slug) {
		return { href: `${researchBase}/${project.slug}`, external: false };
	}
	return { href: project.href, external: true };
}

export const researchProjects: ResearchProject[] = [
	{
		title: 'Structure, Agency, and the World',
		years: '2022 - Present',
		image: '/images/structure-n-agency.png',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Structure_Agency_World.html'
	},
	{
		title: 'Neuromorphic Learning and Control of Robots',
		years: '2022 - Present',
		image: '/images/Neuromorphic.jpeg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Neuromorphic_Learning.html'
	},
	{
		title: 'Swarm Robotics',
		years: '2019 - Present',
		image: '/images/swarm.png',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Swarm_Robotics.html'
	},
	{
		title: 'Analysis and Control of Spreading Processes',
		years: '2014 - Present',
		image: '/images/fluepidemic.jpg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Analysis_Control.html'
	},
	{
		title: 'Defend The Republic',
		years: '2020 - 2023',
		image: '/images/DTR.jpg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Defend_The_Republic.html'
	},
	{
		title: 'Autonomous Coordination of Networked Cyber-Physical Systems',
		years: '2012 - 2020',
		image: '/images/cps_cartoon.jpg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Autonomous_Coordination.html',
		slug: 'autonomous-coordination'
	},
	{
		title: 'Intelligent Coordination of Multi-Robot Systems',
		years: '2010 - 2020',
		image: '/images/quadrotors.jpg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Intelligent_Coordination.html'
	},
	{
		title: 'The Internet Of Things',
		years: '2016 - 2019',
		image: '/images/things_projection.jpg',
		href: 'https://people-ece.vse.gmu.edu/~cnowzari/ProjectPages/Internet_Of_Things.html'
	}
];
