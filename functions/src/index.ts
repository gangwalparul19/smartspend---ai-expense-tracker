/**
 * Jebkharch Cloud Functions
 * 
 * Scheduled function to process recurring transactions automatically
 * Runs daily at midnight IST (18:30 UTC previous day)
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

interface RecurringTransaction {
    id: string;
    description: string;
    amount: number;
    type: 'expense' | 'income' | 'investment';
    category: string;
    categoryId?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDueDate: string;
    active: boolean;
}

/**
 * Process recurring transactions for all users
 * Scheduled to run every day at 00:00 IST (18:30 UTC previous day)
 */
export const processRecurringTransactions = functions
    .runWith({
        timeoutSeconds: 540, // 9 minutes max
        memory: '256MB'
    })
    .pubsub.schedule('30 18 * * *') // 00:00 IST = 18:30 UTC previous day
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
        console.log('Processing recurring transactions...', context.timestamp);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        try {
            // Get all users
            const usersSnapshot = await db.collection('users').get();

            let processedCount = 0;
            let createdCount = 0;

            for (const userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;

                // Get recurring transactions for this user
                const recurringSnapshot = await db
                    .collection(`users/${userId}/recurring`)
                    .where('active', '==', true)
                    .get();

                for (const recurringDoc of recurringSnapshot.docs) {
                    const recurring = {
                        id: recurringDoc.id,
                        ...recurringDoc.data()
                    } as RecurringTransaction;

                    const nextDue = new Date(recurring.nextDueDate);
                    nextDue.setHours(0, 0, 0, 0);

                    // Skip if not due yet
                    if (nextDue > today) continue;

                    const dateStr = nextDue.toISOString().split('T')[0];

                    // Check if transaction already exists for this date
                    const existingSnapshot = await db
                        .collection(`users/${userId}/transactions`)
                        .where('date', '==', dateStr)
                        .get();

                    const alreadyExists = existingSnapshot.docs.some(doc => {
                        const data = doc.data();
                        return data.description?.includes('(Recurring)') &&
                            data.description?.includes(recurring.description);
                    });

                    if (alreadyExists) {
                        // Just update the next due date
                        const newNextDue = calculateNextDueDate(nextDue, recurring.frequency);
                        await recurringDoc.ref.update({
                            nextDueDate: newNextDue.toISOString().split('T')[0]
                        });
                        processedCount++;
                        continue;
                    }

                    // Calculate new next due date
                    const newNextDue = calculateNextDueDate(nextDue, recurring.frequency);

                    // Update next due date FIRST (to prevent duplicates)
                    await recurringDoc.ref.update({
                        nextDueDate: newNextDue.toISOString().split('T')[0]
                    });

                    // Create the transaction
                    await db.collection(`users/${userId}/transactions`).add({
                        amount: recurring.amount,
                        description: `${recurring.description} (Recurring)`,
                        date: dateStr,
                        category: recurring.category,
                        categoryId: recurring.categoryId || null,
                        type: recurring.type,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    createdCount++;
                    processedCount++;

                    console.log(`Created recurring transaction: ${recurring.description} for user ${userId}`);
                }
            }

            console.log(`Processed ${processedCount} recurring items, created ${createdCount} transactions`);
            return null;

        } catch (error) {
            console.error('Error processing recurring transactions:', error);
            throw error;
        }
    });

/**
 * Calculate the next due date based on frequency
 */
function calculateNextDueDate(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
    }

    return nextDate;
}

/**
 * HTTP endpoint to manually trigger recurring transaction processing
 * Useful for testing or manual runs
 */
export const triggerRecurringProcess = functions
    .https.onRequest(async (req, res) => {
        // Simple auth check - you should use proper authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        try {
            // Run the same logic as scheduled function
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const usersSnapshot = await db.collection('users').get();
            let createdCount = 0;

            for (const userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;
                const recurringSnapshot = await db
                    .collection(`users/${userId}/recurring`)
                    .where('active', '==', true)
                    .get();

                for (const recurringDoc of recurringSnapshot.docs) {
                    const recurring = {
                        id: recurringDoc.id,
                        ...recurringDoc.data()
                    } as RecurringTransaction;

                    const nextDue = new Date(recurring.nextDueDate);
                    nextDue.setHours(0, 0, 0, 0);

                    if (nextDue > today) continue;

                    const dateStr = nextDue.toISOString().split('T')[0];
                    const newNextDue = calculateNextDueDate(nextDue, recurring.frequency);

                    await recurringDoc.ref.update({
                        nextDueDate: newNextDue.toISOString().split('T')[0]
                    });

                    await db.collection(`users/${userId}/transactions`).add({
                        amount: recurring.amount,
                        description: `${recurring.description} (Recurring)`,
                        date: dateStr,
                        category: recurring.category,
                        categoryId: recurring.categoryId || null,
                        type: recurring.type,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    createdCount++;
                }
            }

            res.json({ success: true, createdTransactions: createdCount });

        } catch (error) {
            console.error('Error in manual trigger:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
