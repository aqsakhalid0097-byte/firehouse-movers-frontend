export interface TrainingCourse {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface CompanyManual {
  id: string;
  title: string;
  url: string;
  description: string;
}

export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'welcome',
    title: 'Welcome Training',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38483',
    description: 'Introduction to company culture and policies',
  },
  {
    id: 'driver-safety',
    title: 'Driver Safety',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/43467',
    description: 'Essential safety guidelines for drivers',
  },
  {
    id: 'growth-hacks',
    title: 'Growth and Profit Hacks You Can Master in 35 Mins or Less',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/42080',
    description: 'Quick strategies for business growth and profitability',
  },
  {
    id: 'mover-training',
    title: 'Mover Training',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38979',
    description: 'Comprehensive training for moving professionals',
  },
  {
    id: 'compliance-legal',
    title: 'Compliance, Legal and Claims 101',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/40209',
    description: 'Understanding legal compliance and claims processes',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38980',
    description: 'Marketing strategies and best practices',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38982',
    description: 'Develop essential leadership skills',
  },
  {
    id: 'd2d-sales',
    title: 'Door to Door Sales: Moving Playbook by Lenny Gray',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/41280',
    description: 'Master door-to-door sales techniques for the moving industry',
  },
  {
    id: 'sales-training',
    title: 'Sales Training',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38760',
    description: 'Comprehensive sales training and techniques',
  },
  {
    id: 'fitness',
    title: 'Fitness',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/38981',
    description: 'Physical fitness and wellness for moving professionals',
  },
  {
    id: 'coaching-skills',
    title: 'Live Coaching Skills',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/42841',
    description: 'Develop effective coaching abilities',
  },
  {
    id: 'speaker-presentations',
    title: 'Speaker Presentations',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/41375',
    description: 'Master the art of public speaking and presentations',
  },
  {
    id: 'webinars-podcasts',
    title: 'Webinars and Podcasts',
    url: 'https://vt.lightspeedvt.com/trainingCenter/category/39581',
    description: 'Access to company webinars and podcast series',
  },
];

export const COMPANY_MANUALS: CompanyManual[] = [
  {
    id: 'employee-handbook',
    title: 'Employee Handbook',
    url: '/documents/Employee_Handbook.pdf',
    description: 'Complete guide to company policies',
  },
];
