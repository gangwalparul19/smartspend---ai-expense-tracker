export interface NotificationPreferences {
    budgetAlerts: boolean;
    billReminders: boolean;
    monthlyReports: boolean;
    threshold: number; // Budget warning threshold percentage (e.g., 80 for 80%)
}

export interface Notification {
    id: string;
    type: 'budget_warning' | 'budget_exceeded' | 'bill_reminder' | 'monthly_summary';
    title: string;
    message: string;
    date: string;
    read: boolean;
    amount?: number;
    categoryId?: string;
}
