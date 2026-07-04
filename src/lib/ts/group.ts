export type SocialKind = 'scholar' | 'orcid' | 'linkedin' | 'researchgate' | 'other';

export type SocialLink = {
	kind: SocialKind;
	href: string;
	icon?: string;
};

export type Education = {
	degree: string;
	institution: string;
	years: string;
};

export type Member = {
	id?: string;
	slug?: string;
	name: string;
	group?: string;
	period?: string;
	areaOfStudy?: string;
	photo: string;
	note?: string;
	bio?: string;
	education: Education[];
	email?: string;
	socials: SocialLink[];
};

export type MemberGroup = {
	heading: string;
	members: Member[];
};

export const memberPhotoPlaceholder = '/team-placeholder.svg';

export function memberPhoto(photo?: string): string {
	return photo && photo.trim() ? photo : memberPhotoPlaceholder;
}

export const professor: Member = {
	name: 'Dr. Cameron Nowzari',
	photo: '/images/pf.png',
	education: [
		{ degree: 'Postdoc', institution: 'University of Pennsylvania', years: '2013-2016' },
		{ degree: 'Ph.D.', institution: 'University of California, San Diego', years: '2013' },
		{ degree: 'M.S.', institution: 'University of California, San Diego', years: '2010' },
		{ degree: 'B.S.', institution: 'University of California, Santa Barbara', years: '2009' }
	],
	email: 'cnowzari@gmu.edu',
	socials: [
		{ kind: 'scholar', href: 'https://scholar.google.com/citations?user=CcS83CIAAAAJ&hl=en' },
		{ kind: 'orcid', href: 'https://orcid.org/0000-0001-7287-9972' },
		{ kind: 'linkedin', href: 'https://www.linkedin.com/in/cameron-nowzari-42401034/' },
		{ kind: 'researchgate', href: 'https://www.researchgate.net/profile/Cameron_Nowzari' }
	]
};

export const memberGroups: MemberGroup[] = [
	{
		heading: 'Ph.D. Students',
		members: [
			{
				name: 'Ricardo Vega',
				period: '2021 - present',
				photo: '/images/ricardo.jpg',
				education: [
					{
						degree: 'B.S., Electrical Engineering',
						institution: 'George Mason University',
						years: '2021'
					}
				],
				email: 'rvega7@gmu',
				socials: [{ kind: 'linkedin', href: 'https://www.linkedin.com/in/ricardovega2021/' }]
			},
			{
				name: 'Kevin Zhu',
				period: '2022 - present',
				photo: '/images/kevin.png',
				note: 'co-advised with Dr. Maryam Parsa',
				education: [
					{
						degree: 'B.S., Computer Engineering',
						institution: 'George Mason University',
						years: '2021'
					}
				],
				email: 'kzhu4@gmu',
				socials: [{ kind: 'linkedin', href: 'https://www.linkedin.com/in/kevin-g-zhu/' }]
			},
			{
				name: 'Shantanu Bhattacharjee',
				period: '2024 - present',
				photo: '/images/Photo_Shan.jpg',
				education: [
					{
						degree: 'B.S., Electrical and Electronic Engineering',
						institution: 'Chittagong University of Engineering and Technology',
						years: '2022'
					}
				],
				email: 'sbhatt28@gmu',
				socials: [
					{ kind: 'scholar', href: 'https://scholar.google.com/citations?user=O2ic-jMAAAAJ&hl=en' },
					{ kind: 'linkedin', href: 'https://www.linkedin.com/in/shantanu-bhattacharjee/' }
				]
			},
			{
				name: 'Benjamin Wheeler',
				period: '2024 - present',
				photo: '/images/unknown.jpg',
				education: [],
				email: 'bwheele@gmu',
				socials: []
			}
		]
	},
	{
		heading: 'Alumni',
		members: [
			{
				name: 'Dr. Mohanad Ajina',
				period: '2016 - 2020',
				photo: '/images/Mohanad_Ajina.jpg',
				education: [
					{
						degree: 'Ph.D., Electrical Engineering',
						institution: 'George Mason University',
						years: '2020'
					},
					{
						degree: 'M.S., Electrical Engineering',
						institution: 'George Mason University',
						years: '2016'
					},
					{
						degree: 'B.S., Electrical Engineering',
						institution: 'Southern Illinois University',
						years: '2014'
					}
				],
				email: 'majina@gmu',
				socials: [
					{ kind: 'scholar', href: 'https://scholar.google.com/citations?hl=en&user=jD_MTnMAAAAJ' }
				]
			},
			{
				name: 'Dr. James Berneburg',
				period: '2018 - 2023',
				photo: '/images/james.jpg',
				education: [
					{
						degree: 'Ph.D., Electrical and Computer Engineering',
						institution: 'George Mason University',
						years: '2023'
					},
					{
						degree: 'M.S., Electrical Engineering',
						institution: 'George Mason University',
						years: '2020'
					},
					{
						degree: 'B.S., Electrical Engineering',
						institution: 'George Mason University',
						years: '2017'
					}
				],
				email: 'jbernebu@gmu',
				socials: [
					{ kind: 'scholar', href: 'https://scholar.google.com/citations?hl=en&user=14kipQgAAAAJ' },
					{ kind: 'researchgate', href: 'https://www.researchgate.net/profile/James_Berneburg' }
				]
			},
			{
				name: 'Dr. Joseph Prince Mathew',
				period: '2020 - 2024',
				photo: '/images/JosephPrinceMathew.jpg',
				education: [
					{
						degree: 'Ph.D., Electrical and Computer Engineering',
						institution: 'George Mason University',
						years: '2024'
					},
					{
						degree: 'M.S., Electrical Engineering',
						institution: 'George Mason University',
						years: '2023'
					},
					{
						degree: 'B.S., Electronics and Communication',
						institution: 'Rajagiri School of Engineering and Technology',
						years: '2014'
					}
				],
				email: 'jprincem@gmu',
				socials: []
			}
		]
	}
];
