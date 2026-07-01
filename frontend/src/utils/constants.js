// Priority → styling config
export const PRIORITY_CONFIG = {
  critical: {
    label: 'Critical',
    color: 'var(--color-critical)',
    bg: 'var(--color-critical-bg)',
    icon: '🔴',
    tailwind: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  high: {
    label: 'High',
    color: 'var(--color-high)',
    bg: 'var(--color-high-bg)',
    icon: '🟠',
    tailwind: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  medium: {
    label: 'Medium',
    color: 'var(--color-medium)',
    bg: 'var(--color-medium-bg)',
    icon: '🟡',
    tailwind: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  },
  low: {
    label: 'Low',
    color: 'var(--color-low)',
    bg: 'var(--color-low-bg)',
    icon: '🟢',
    tailwind: 'text-green-400 bg-green-500/10 border-green-500/30',
  },
};

// Sentiment → styling config
export const SENTIMENT_CONFIG = {
  positive:   { label: 'Positive',   icon: '😊', color: '#22c55e' },
  neutral:    { label: 'Neutral',    icon: '😐', color: '#94a3b8' },
  negative:   { label: 'Negative',   icon: '😞', color: '#f97316' },
  frustrated: { label: 'Frustrated', icon: '😤', color: '#ef4444' },
  angry:      { label: 'Angry',      icon: '😡', color: '#dc2626' },
};

// Category → icon + label
export const CATEGORY_CONFIG = {
  billing:   { label: 'Billing',   icon: '💳' },
  technical: { label: 'Technical', icon: '⚙️' },
  account:   { label: 'Account',   icon: '👤' },
  shipping:  { label: 'Shipping',  icon: '📦' },
  general:   { label: 'General',   icon: '💬' },
};

// Channel → icon
export const CHANNEL_CONFIG = {
  email:  { label: 'Email',  icon: '📧' },
  chat:   { label: 'Chat',   icon: '💬' },
  phone:  { label: 'Phone',  icon: '📞' },
  social: { label: 'Social', icon: '🐦' },
};

export const MAX_MESSAGE_LENGTH = 2000;
export const MIN_MESSAGE_LENGTH = 10;

// Sample messages for demo
export const DEMO_MESSAGES = [
  {
    label: 'Billing Crisis',
    message: "I've been charged twice for my Pro subscription this month — $149 twice! My account number is ACC-88821. This is completely unacceptable. I need an immediate refund or I'm canceling and disputing the charges with my bank.",
  },
  {
    label: 'Technical Outage',
    message: "Your API has been returning 503 errors for the past 3 hours (since 9am EST). Our entire production pipeline is down. We process 50,000 orders per day through your integration. This is costing us thousands of dollars per hour. URGENT.",
  },
  {
    label: 'Account Access',
    message: "I cannot log into my account. Every time I try to reset my password, I receive the email but the link just shows a blank page. I've tried Chrome, Firefox, and Safari. My email is john.doe@company.com.",
  },
  {
    label: 'Lost Package',
    message: "My order ORD-44291 placed on June 15th still hasn't arrived. The tracking page shows 'In Transit' for 8 days now with no updates. I paid for express shipping. Can someone check on this?",
  },
  {
    label: 'Feature Question',
    message: "Hi! I was wondering if it's possible to export my data as a CSV file. I'd love to analyze my usage in Excel. Thanks in advance for your help!",
  },
];
