'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';

interface ImageUploadProps {
  value: string; // Current image URL or base64
  onChange: (imageData: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Image", 
  required = false,
  className = ""
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP, or SVG)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64 for preview (in real app, you'd upload to a service)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#1A1A1A]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200
            ${isDragOver 
              ? 'border-[#1A1A1A] bg-[#F5F5F5]' 
              : 'border-[#E5E5E5] hover:border-[#1A1A1A] hover:bg-[#FCFCFC]'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-[#4D4D4D]" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-[#1A1A1A]">
                {isUploading ? 'Uploading...' : 'Upload logo image'}
              </p>
              <p className="text-xs text-[#4D4D4D] mt-1">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-[#4D4D4D]">
                PNG, JPG, GIF, WebP or SVG up to 5MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {/* Image Preview */}
        {value && !isUploading && (
          <div className="relative">
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-[#E5E5E5]">
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg border border-[#E5E5E5] overflow-hidden bg-white">
                    <img
                      src={value}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    Logo image uploaded
                  </p>
                  <p className="text-xs text-[#4D4D4D] mt-1">
                    {value.startsWith('data:') ? 'Uploaded file' : 'External URL'}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex-shrink-0 p-2 text-[#4D4D4D] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}