export type DebtType = 'loan' | 'credit_card' | 'emi' | 'personal_loan' | 'mortgage';

export interface Debt {
    id: string;
    name: string; // e.g., "Home Loan", "Credit Card - HDFC"
    type: DebtType;
    principal: number; // Original loan amount
    currentBalance: number; // Remaining amount
    interestRate: number; // Annual interest rate (%)
    emiAmount?: number; // Monthly EMI (if applicable)
    startDate: string; // Loan start date
    dueDate?: string; // Final payment date
    lender: string; // Bank/lender name
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DebtPayment {
    id: string;
    debtId: string;
    amount: number;
    date: string;
    principalPaid: number;
    interestPaid: number;
    notes?: string;
}
