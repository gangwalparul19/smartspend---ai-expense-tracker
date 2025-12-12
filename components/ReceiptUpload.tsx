import React, { useState, useRef } from 'react';
import { Camera, Upload, X, FileImage, Loader2 } from 'lucide-react';

interface ReceiptUploadProps {
    onUpload: (file: File) => Promise<void>;
    currentReceipt?: {
        url: string;
        fileName: string;
    };
    onRemove?: () => void;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
    onUpload,
    currentReceipt,
    onRemove
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload an image (JPG, PNG, WEBP)  or PDF file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Show preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

        // Upload file
        setUploading(true);
        try {
            await onUpload(file);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload receipt. Please try again.');
        } finally {
            setUploading(false);
            setPreview(null);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Receipt (Optional)
            </label>

            {currentReceipt ? (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileImage size={20} className="text-indigo-500" />
                        <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                                {currentReceipt.fileName}
                            </p>
                            <a
                                href={currentReceipt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View Receipt
                            </a>
                        </div>
                    </div>
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex-1 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-sm font-bold">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    <span className="text-sm font-bold">Upload Receipt</span>
                                </>
                            )}
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <p className="text-[10px] text-slate-400 text-center">
                        JPG, PNG, WEBP or PDF • Max 5MB
                    </p>
                </>
            )}

            {preview && (
                <div className="mt-2">
                    <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                </div>
            )}
        </div>
    );
};
