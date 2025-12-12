import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from '../config/firebase';

const storage = getStorage(app);

/**
 * Upload a receipt file to Firebase Storage
 * @param userId - User ID for folder organization
 * @param transactionId - Transaction ID to link receipt
 * @param file - File to upload (image or PDF)
 * @returns Download URL of the uploaded file
 */
export const uploadReceipt = async (
    userId: string,
    transactionId: string,
    file: File
): Promise<{ url: string; fileName: string }> => {
    try {
        // Create unique filename with timestamp
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${transactionId}_${timestamp}.${fileExtension}`;

        // Create storage reference
        const storageRef = ref(storage, `receipts/${userId}/${fileName}`);

        // Upload file
        await uploadBytes(storageRef, file);

        // Get download URL
        const url = await getDownloadURL(storageRef);

        return { url, fileName: file.name };
    } catch (error) {
        console.error('Error uploading receipt:', error);
        throw new Error('Failed to upload receipt');
    }
};

/**
 * Delete a receipt from Firebase Storage
 * @param userId - User ID
 * @param fileName - File name to delete
 */
export const deleteReceipt = async (
    userId: string,
    fileName: string
): Promise<void> => {
    try {
        const storageRef = ref(storage, `receipts/${userId}/${fileName}`);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting receipt:', error);
        throw new Error('Failed to delete receipt');
    }
};

/**
 * Get receipt URL from storage
 * @param userId - User ID
 * @param fileName - File name
 * @returns Download URL
 */
export const getReceiptUrl = async (
    userId: string,
    fileName: string
): Promise<string> => {
    try {
        const storageRef = ref(storage, `receipts/${userId}/${fileName}`);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error('Error getting receipt URL:', error);
        throw new Error('Failed to get receipt URL');
    }
};
