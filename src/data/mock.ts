export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/projects', label: 'Projects', icon: 'folder_open' },
  { to: '/analytics', label: 'Analytics', icon: 'insights' },
  { to: '/team', label: 'Team', icon: 'group' },
  { to: '/templates', label: 'Templates', icon: 'dashboard_customize' },
  { to: '/billing', label: 'Billing', icon: 'credit_card' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
] as const

export const TRANSACTIONS = [
  { customer: 'Acme Corp', initial: 'A', status: 'Success', amount: '$4,200.00', date: 'Oct 24, 2023' },
  { customer: 'Global Tech', initial: 'G', status: 'Pending', amount: '$1,850.50', date: 'Oct 23, 2023' },
  { customer: 'Stark Industries', initial: 'S', status: 'Failed', amount: '$950.00', date: 'Oct 22, 2023' },
]

export const DASHBOARD_METRICS = [
  { label: 'Total Revenue', value: '$128,430', delta: '+12.5%', up: true, icon: 'payments' },
  { label: 'Active Users', value: '12,402', delta: '+5.2%', up: true, icon: 'group' },
  { label: 'Avg. Session', value: '4m 32s', delta: '-1.2%', up: false, icon: 'timer' },
  { label: 'Conversion Rate', value: '3.24%', delta: '+0.8%', up: true, icon: 'monitoring' },
]

export const ANALYTICS_METRICS = [
  { label: 'Total AI Requests', value: '842.5k', delta: '+12.4%', up: true, icon: 'memory', hint: 'vs last 30 days' },
  { label: 'AI Response Time', value: '1.2s', delta: '-15%', up: true, icon: 'schedule', hint: 'Average latency' },
  { label: 'User Engagement', value: '94.2%', delta: '+2.1%', up: true, icon: 'groups', hint: 'Active users ratio' },
  { label: 'Token Consumption', value: '8.4M', delta: '+5.6%', up: false, icon: 'generating_tokens', hint: 'Estimated cost usage' },
]

export const CHART_SERIES = {
  daily: [28, 42, 35, 58, 49, 72, 64],
  weekly: [32, 48, 41, 63, 55, 78, 70],
  monthly: [22, 38, 44, 51, 60, 68, 81],
}

export const TEAM_METRICS = [
  { label: 'Total Members', value: '24', delta: '↑12%', up: true, icon: 'group' },
  { label: 'Active Users', value: '18', delta: '↑5%', up: true, icon: 'person_add' },
  { label: 'AI Usage', value: '82%', delta: '↑22%', up: true, icon: 'psychology' },
  { label: 'Team Projects', value: '12', delta: '—0%', up: true, icon: 'folder_open' },
]

export const MEMBERS = [
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@nova-analytics.com', role: 'Admin', status: 'Active', lastActive: 'Just now', avatar: 'https://i.pravatar.cc/64?img=47' },
  { name: 'Mike Chen', email: 'mike.chen@nova-analytics.com', role: 'Developer', status: 'Active', lastActive: '2h ago', avatar: 'https://i.pravatar.cc/64?img=12' },
  { name: 'John Doe', email: 'john.doe@nova-analytics.com', role: 'Project Manager', status: 'Offline', lastActive: '1d ago', avatar: 'https://i.pravatar.cc/64?img=15' },
  { name: 'Elena Ruiz', email: 'elena.r@nova-analytics.com', role: 'Designer', status: 'Invited', lastActive: '—', avatar: '' },
]

export const ROLES = [
  { title: 'Admin Access', count: 2, copy: 'Full control over workspace settings, billing, and all projects.' },
  { title: 'Project Manager', count: 5, copy: 'Can create projects, invite users to specific projects, and view all analytics.' },
  { title: 'AI User', count: 12, copy: 'Access to AI workspace, specific assigned projects, and models.' },
  { title: 'Viewer', count: 5, copy: 'Read-only access to specific dashboards and reports.' },
]

export const TEMPLATES = [
  { id: 'writer', title: 'AI Content Writer', category: 'Writing', uses: '12k', icon: 'edit_note', description: 'Draft long-form articles, briefs, and on-brand copy in minutes.' },
  { id: 'campaign', title: 'Marketing Campaign Generator', category: 'Marketing', uses: '18k', icon: 'campaign', description: 'Build multi-channel campaign plans, ads, and launch calendars.' },
  { id: 'research', title: 'Research Assistant', category: 'Research', uses: '9.4k', icon: 'biotech', description: 'Summarize sources, extract insights, and produce evidence-backed notes.' },
  { id: 'support', title: 'Customer Support Agent', category: 'Automation', uses: '21k', icon: 'support_agent', description: 'Resolve tickets with grounded answers from your knowledge base.' },
  { id: 'data', title: 'Data Analysis Assistant', category: 'Research', uses: '16k', icon: 'query_stats', description: 'Explore datasets, flag anomalies, and generate executive charts.' },
  { id: 'ui', title: 'UI Design Critic', category: 'Design', uses: '7.1k', icon: 'palette', description: 'Review interface hierarchy, accessibility, and visual consistency.' },
]

export const TEMPLATE_CATEGORIES = ['All', 'Writing', 'Marketing', 'Design', 'Development', 'Research', 'Automation']

export const AI_ACTIVITIES = [
  { title: 'Generated marketing report', model: 'Nova-Pro-Vision', status: 'Completed', time: '2 mins ago', icon: 'description', tone: 'blue' },
  { title: 'Completed workflows', model: 'Nova-Base', status: 'Completed', time: '15 mins ago', icon: 'account_tree', tone: 'violet' },
  { title: 'Created AI assistants', model: 'Nova-Ultra', status: 'Processing', time: '1 hr ago', icon: 'smart_toy', tone: 'warn' },
]

export const INVOICES = [
  { date: 'Sep 24, 2024', amount: '$49.00', status: 'PAID' },
  { date: 'Aug 24, 2024', amount: '$49.00', status: 'PAID' },
  { date: 'Jul 24, 2024', amount: '$49.00', status: 'PAID' },
  { date: 'Jun 24, 2024', amount: '$49.00', status: 'PAID' },
]

export const PLANS = [
  { id: 'free', name: 'Free', price: '$0', cadence: '/mo', copy: 'For individuals exploring AI capabilities.', features: ['1 workspace', '50k AI credits', 'Community support'], cta: 'Current Plan' },
  { id: 'pro', name: 'Pro', price: '$49', cadence: '/mo', copy: 'For professional teams scaling AI workflows.', features: ['Unlimited projects', '1M AI credits', 'Priority support', 'Advanced analytics'], cta: 'Upgrade to Pro', featured: true },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', cadence: '', copy: 'For large organizations requiring bespoke solutions.', features: ['Everything in Pro', 'SSO and audit logs', 'Dedicated success manager'], cta: 'Contact Sales' },
]

export const SETTINGS_SECTIONS = [
  'Account',
  'Workspace',
  'AI Preferences',
  'Appearance',
  'Notifications',
  'Security',
  'Billing',
] as const

export const INITIAL_CHATS = [
  {
    id: 'sales-2023',
    title: 'Global Sales Data 2023 Analysis',
    subtitle: 'Analyzing Q1-Q4 revenue trends',
    group: 'Today',
    context: 'Sales_Data_Master.csv',
  },
  {
    id: 'churn',
    title: 'Customer Churn Predictor',
    subtitle: 'Model review for EU segment',
    group: 'Today',
    context: 'eu_churn_v2.parquet',
  },
  {
    id: 'q3',
    title: 'Q3 Revenue Analysis',
    subtitle: 'Board deck preparation',
    group: 'Previous 7 days',
    context: 'q3_board.xlsx',
  },
  {
    id: 'roi',
    title: 'Marketing Spend vs ROI',
    subtitle: 'Dataset cleaning task',
    group: 'Previous 7 days',
    context: 'spend_roi.csv',
  },
]
