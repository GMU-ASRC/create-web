import type { FileAttachment } from './files';

export type NewsEntry = {
	id?: string;
	title: string;
	author?: string;
	date: string;
	body?: string;
	linkType?: 'none' | 'external' | 'article';
	href?: string;
	slug?: string;
	gallery?: string[];
	files?: FileAttachment[];
};

export function newsLink(
	item: NewsEntry,
	newsBase: string
): { href: string; external: boolean } | null {
	if (item.linkType === 'article' && item.slug) {
		return { href: `${newsBase}/${item.slug}`, external: false };
	}
	if ((item.linkType === 'external' || !item.linkType) && item.href) {
		return { href: item.href, external: true };
	}
	return null;
}

const hybridSystemsBlurb =
	'Nonlinear Analysis: Hybrid Systems welcomes all important research and expository papers in the area of hybrid dynamic systems, i.e., systems involving the interplay between discrete and continuous dynamic behaviors.';

export const allNews: NewsEntry[] = [
	{
		title: 'Dr. Cameron Nowzari promoted to the rank of Associate Professor with Tenure',
		date: 'August 2022',
		href: 'https://volgenau.gmu.edu/profiles/cnowzari'
	},
	{
		title:
			"Dr. Cameron Nowzari Named Recipient of the Office of Naval Research's 2021 Young Investigator Program (YIP) Award",
		date: 'Nov 2021',
		body: 'See the list of all winners here.',
		href: 'https://www.onr.navy.mil/Education-Outreach/Sponsored-Research/YIP/2021-young-investigators'
	},
	{
		title: 'Associate Editor of IFAC Journal on Nonlinear Analysis: Hybrid Systems',
		date: 'Oct 2021',
		body: hybridSystemsBlurb,
		href: 'https://www.journals.elsevier.com/nonlinear-analysis-hybrid-systems'
	},
	{
		title: 'SIAM Journal on Control and Optimization',
		date: 'Oct 2021',
		body: 'Guest Editor of SIAM Journal on Control and Optimization Special Section on Mathematical Modeling, Analysis, and Control of Epidemics.',
		href: 'https://sinews.siam.org/Details-Page/Call-for-Papers-SIAM-Journal-on-Control-and-Optimization-Special-Section-on-Mathematical-Modeling-Analysis-and-Control-of-Epidemics'
	},
	{
		title: '99++ LuftBallons Event #1',
		date: 'May 2021',
		body: '99++ LuftBallons Event #1 is scheduled for November 9-13 in Indianapolis, Indiana. Our Patriot Pilots will be one of 4 participating teams including competitors from the University of California, Los Angeles, Pennsylvania State University, and the Naval Research Laboratory.'
	},
	{
		title: 'Associate Editor of IFAC Journal on Nonlinear Analysis: Hybrid Systems',
		date: 'Feb 2021',
		body: hybridSystemsBlurb,
		href: 'https://www.onr.navy.mil/Education-Outreach/Sponsored-Research/YIP/2021-young-investigators'
	},
	{
		title:
			'Mason Engineering researcher receives NSF RAPID grant to uniquely model virus spread',
		date: 'June 2, 2020',
		body: 'How a computer virus spreads gave George Mason University researcher Cameron Nowzari insight into how human viruses, like the coronavirus, spread.',
		href: 'https://www.eurekalert.org/pub_releases/2020-06/gmu-mer060220.php'
	},
	{
		title: 'Nowzari Developing Controllers To Facilitate Emergent Behavior In Swarms',
		date: 'Feb 28, 2020',
		body: 'Cameron Nowzari, Assistant Professor, Electrical and Computer Engineering, is working to design and deploy a full-scale robotic swarm system of Lighter Than Air (LTA) agents capable of exhibiting various emergent behaviors without colliding with one another.',
		href: 'https://scienmag.com/nowzari-developing-controllers-to-facilitate-emergent-behavior-in-swarms/'
	}
];
