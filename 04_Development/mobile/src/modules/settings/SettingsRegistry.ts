export interface SettingEntry {
    id: string;
    title: string;
    description: string;
    route: string;
    keywords: string[];
    category: string;
}

export const SETTINGS_REGISTRY: SettingEntry[] = [
    {
        id: 'account',
        title: 'Account Settings',
        description: 'Manage your profile, email, and password.',
        route: '/(main)/settings/account',
        keywords: ['profile', 'email', 'password', 'name', 'avatar'],
        category: 'Personal'
    },
    {
        id: 'storage',
        title: 'Data & Storage',
        description: 'Manage cloud sync, local cache, and storage health.',
        route: '/(main)/settings/storage',
        keywords: ['storage', 'sync', 'cache', 'cloud', 'data', 'space', 'memory', 'cleanup'],
        category: 'System'
    },
    {
        id: 'notifications',
        title: 'Intelligent Notifications',
        description: 'Configure email and push notification preferences.',
        route: '/(main)/settings/notifications',
        keywords: ['alerts', 'push', 'email', 'notifications', 'reminders'],
        category: 'Preferences'
    },
    {
        id: 'privacy',
        title: 'Privacy & Security',
        description: 'Control who can see your data and enable biometrics.',
        route: '/(main)/settings/privacy',
        keywords: ['security', 'privacy', 'lock', 'biometrics', 'faceid', 'touchid'],
        category: 'Security'
    },
    {
        id: 'ai',
        title: 'AI Persona',
        description: 'Configure how your AI assistant interacts with you.',
        route: '/(main)/settings/ai',
        keywords: ['ai', 'assistant', 'persona', 'bot', 'chat'],
        category: 'Intelligence'
    },
    {
        id: 'billing',
        title: 'Billing & Subscription',
        description: 'Manage your plan, invoices, and payments.',
        route: '/(main)/settings/billing',
        keywords: ['pro', 'premium', 'subscription', 'billing', 'invoice', 'credit card'],
        category: 'Account'
    }
];

export const searchSettings = (query: string): SettingEntry[] => {
    if (!query || query.trim().length === 0) return SETTINGS_REGISTRY;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return SETTINGS_REGISTRY.filter(setting => {
        const matchTitle = setting.title.toLowerCase().includes(normalizedQuery);
        const matchDesc = setting.description.toLowerCase().includes(normalizedQuery);
        const matchKeyword = setting.keywords.some(k => k.toLowerCase().includes(normalizedQuery));
        
        return matchTitle || matchDesc || matchKeyword;
    });
};
