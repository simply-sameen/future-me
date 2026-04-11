import type { Goal, Reminder, NewsTicker, AdminMetrics } from '../types'

export const DEMO_USER = {
  id: 'demo-user',
  name: 'John Doe',
  email: 'john.doe@futureme.app',
  avatar: undefined,
}

export const MOTIVATIONAL_QUOTES = [
  "The future belongs to those who believe in the beauty of their dreams.",
  "You are one decision away from a completely different life.",
  "Your future self is watching you right now through your memories.",
  "Small daily improvements are the key to staggering long-term results.",
  "The best time to start was yesterday. The next best time is right now.",
]

export const DEMO_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Launch My SaaS Business',
    description: 'Build and ship a profitable software product that solves a real problem',
    category: 'Business',
    progress: 42,
    etcDays: 180,
    color: 'pink',
    createdAt: '2024-01-15',
    subGoals: [
      { id: 'sg-1-1', title: 'Validate the product idea with 20 potential customers', completed: true, estimatedDays: 14 },
      { id: 'sg-1-2', title: 'Build a working MVP with core features', completed: true, estimatedDays: 45 },
      { id: 'sg-1-3', title: 'Set up payment processing and landing page', completed: false, estimatedDays: 7 },
      { id: 'sg-1-4', title: 'Launch beta and acquire first 10 paying users', completed: false, estimatedDays: 30 },
      { id: 'sg-1-5', title: 'Scale to $5K MRR through targeted marketing', completed: false, estimatedDays: 90 },
    ],
  },
  {
    id: 'goal-2',
    title: 'Master Full-Stack Development',
    description: 'Become proficient in React, Node.js, and cloud infrastructure',
    category: 'Career',
    progress: 65,
    etcDays: 120,
    color: 'blue',
    createdAt: '2024-02-01',
    subGoals: [
      { id: 'sg-2-1', title: 'Complete advanced React patterns and hooks course', completed: true, estimatedDays: 21 },
      { id: 'sg-2-2', title: 'Build 3 full-stack projects with authentication', completed: true, estimatedDays: 30 },
      { id: 'sg-2-3', title: 'Learn cloud deployment with AWS or GCP', completed: true, estimatedDays: 14 },
      { id: 'sg-2-4', title: 'Contribute to 5 open-source projects on GitHub', completed: false, estimatedDays: 30 },
      { id: 'sg-2-5', title: 'Secure a senior developer role or freelance contract', completed: false, estimatedDays: 45 },
    ],
  },
  {
    id: 'goal-3',
    title: 'Achieve Peak Physical Health',
    description: 'Transform my body and mind through consistent fitness and nutrition',
    category: 'Health',
    progress: 28,
    etcDays: 365,
    color: 'green',
    createdAt: '2024-03-10',
    subGoals: [
      { id: 'sg-3-1', title: 'Establish a consistent 5-day workout routine', completed: true, estimatedDays: 21 },
      { id: 'sg-3-2', title: 'Optimize nutrition with a meal prep system', completed: false, estimatedDays: 14 },
      { id: 'sg-3-3', title: 'Run a 10K race under 50 minutes', completed: false, estimatedDays: 60 },
      { id: 'sg-3-4', title: 'Reduce body fat to target percentage', completed: false, estimatedDays: 90 },
      { id: 'sg-3-5', title: 'Complete a 30-day mindfulness challenge', completed: false, estimatedDays: 30 },
    ],
  },
]

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Weekly Goal Review',
    message: 'Future you: How did this week go? Did you move closer to your dreams? Reflect, adjust, and keep going!',
    scheduledDate: '2024-12-22',
    scheduledTime: '09:00',
    repeat: 'weekly',
    isActive: true,
  },
  {
    id: 'rem-2',
    title: 'Business Milestone Check',
    message: 'You set a goal to hit $1K MRR by now. Have you celebrated your wins and learned from setbacks?',
    scheduledDate: '2025-03-01',
    scheduledTime: '10:00',
    repeat: 'none',
    isActive: true,
  },
  {
    id: 'rem-3',
    title: 'Daily Morning Motivation',
    message: 'Start your day with purpose. What is the ONE thing you must accomplish today?',
    scheduledDate: '2024-12-19',
    scheduledTime: '07:30',
    repeat: 'daily',
    isActive: true,
  },
  {
    id: 'rem-4',
    title: 'Quarterly Life Assessment',
    message: 'Three months have passed. Are you living the life you imagined? What needs to change?',
    scheduledDate: '2025-06-01',
    scheduledTime: '12:00',
    repeat: 'none',
    isActive: false,
  },
  {
    id: 'rem-5',
    title: 'Fitness Progress Check',
    message: 'Future you here! Remember when you started that fitness journey? Look at how far you have come!',
    scheduledDate: '2025-01-15',
    scheduledTime: '18:00',
    repeat: 'monthly',
    isActive: true,
  },
]

export const DEMO_TICKERS: NewsTicker[] = [
  {
    id: 'ticker-1',
    message: '🚨 MISSING PERSON: Sarah Chen, 28, last seen in downtown area. Contact local authorities if found.',
    category: 'missing-person',
    isActive: true,
    publishedAt: '2024-12-18',
  },
  {
    id: 'ticker-2',
    message: '💙 HELP A LIFE: Local food bank needs volunteers this weekend. Sign up at community.org',
    category: 'help-a-life',
    isActive: true,
    publishedAt: '2024-12-18',
  },
]

export const ADMIN_METRICS: AdminMetrics = {
  totalUsers: 1247,
  mrr: 1247,
  serverCosts: 89,
  activeGoals: 3891,
  remindersScheduled: 7432,
}

export const ANALYTICS_DATA = [
  { month: 'Sep', goalsCompleted: 2, velocity: 45 },
  { month: 'Oct', goalsCompleted: 4, velocity: 62 },
  { month: 'Nov', goalsCompleted: 3, velocity: 58 },
  { month: 'Dec', goalsCompleted: 7, velocity: 78 },
  { month: 'Jan', goalsCompleted: 5, velocity: 71 },
  { month: 'Feb', goalsCompleted: 9, velocity: 91 },
]
