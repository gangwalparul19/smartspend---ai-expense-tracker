import React from 'react';
import { X, Download, FileImage } from 'lucide-react';

interface ReceiptViewerProps {
    receiptUrl: string;
    fileName: string;
    onClose: () => void;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
    receiptUrl,
    fileName,
    onClose
}) => {
    const isPdf = fileName.toLowerCase().endsWith('.pdf');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <FileImage size={20} className="text-indigo-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">{fileName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={receiptUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {isPdf ? (
                        <iframe
                            src={receiptUrl}
                            className="w-full h-full min-h-[600px] rounded-xl"
                            title={fileName}
                        />
                    ) : (
                        <img
                            src={receiptUrl}
                            alt={fileName}
                            className="w-full h-auto rounded-xl"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
