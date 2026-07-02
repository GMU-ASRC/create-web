import type { FileAttachment } from './files';

export type ArticleBlock = {
	lead?: string;
	text: string;
	image?: string;
	imageAlt?: string;
	imageSide?: 'left' | 'right';
};

export type ResearchArticle = {
	slug: string;
	title: string;
	author?: string;
	years: string;
	image?: string;
	content?: string;
	blocks: ArticleBlock[];
	gallery?: string[];
	files?: FileAttachment[];
	relatedPublications: string[];
};

export const researchArticles: ResearchArticle[] = [
	{
		slug: 'autonomous-coordination',
		title: 'Autonomous Coordination of Networked Cyber-Physical Systems',
		years: '2012 - 2020',
		blocks: [
			{
				text: 'Networked cyber-physical systems (CPS) are systems in which communication, computation, and control are very tightly coupled and interacting in some way with the physical world. In order to properly design a successfully networked CPS, these three things must be considered simultaneously. In general, each component must be designed with the others in mind. For instance, a controller cannot be designed assuming perfect information is available at all times, as this requires perfect computation, communication, and sensing from other subsystems in the network.',
				image: '/images/cps_cartoon.jpg',
				imageAlt: 'Networked cyber-physical systems diagram',
				imageSide: 'right'
			},
			{
				lead: 'Event-triggered control',
				text: 'algorithms are generally concerned with deciding when a control signal needs to be updated. This decision is based on the availability of some output or state information at all times. However, when considering networked systems, this often means various subsystems need to engage in constant communication with each other to be able to verify whether the designed trigger has occurred or not. As discussed above, this constant communication is often undesirable, especially in large networks. To alleviate this issue, my work in event-triggered control has been focused on applying this idea not only to control, but also the communication aspect.',
				image: '/images/multiagent.jpg',
				imageAlt: 'Multi-agent network',
				imageSide: 'left'
			},
			{
				lead: 'Self-triggered control ',
				text: "algorithms are generally concerned with deciding when a sample of a state needs to be updated. Unlike event-triggered control algorithms, self-triggered controllers don't need constant access to any output or state. Instead, given a current output or state information, the next time at which updated information is required is computed. This time is computed by considering worst-case trajectories of the state, providing naturally robust algorithms given careful abstractions on process noise or state disturbances. However, when considering nonlinear networked systems, it becomes difficult to rule out the possibility of Zeno executions in general. As subsystems in a network near convergence to a desired state, they might require more information about their neighbors meaning the time between updates is decreasing and may even be going to zero."
			},
			{
				lead: 'Team-triggered coordination ',
				text: 'strategies exploit the cooperative nature of networked control systems. The drawback of self-triggered coordination algorithms is their naturally conservative nature, since worst-case conditions must always be considered, so agents generally communicate more than might actually be necessary to ensure stability of the global closed-loop system. By combining ideas from both event- and self-triggered coordination, the team-triggered algorithm also incorporates what information should be shared in addition to when. By considering this extra layer at the design stage, the design of heterogeneous systems and devices becomes much more amenable than the standard methods. By sharing higher quality or more pertinent information with one another, agents are generally able to go longer periods of time without communicating while still maintaining a desired level of performance.'
			}
		],
		relatedPublications: []
	}
];

export function getArticle(slug: string): ResearchArticle | undefined {
	return researchArticles.find((article) => article.slug === slug);
}
