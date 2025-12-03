'use client';

import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  ExternalLink,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import type {
  AdminHighResUploadProps,
  CustomerDownloadButtonProps,
  HighResAsset,
  CloudinaryUploadResult
} from '@/lib/types/high-res-asset';
import { extractCloudinaryPublicId } from '@/lib/cloudinary-utils';

/**
 * AdminHighResUpload Component
 *
 * Allows admins to upload high-res files via Cloudinary or provide external links.
 * Features smart fallback: if Cloudinary upload fails due to file size, automatically
 * switches to external link mode.
 */
export function AdminHighResUpload({
  onAssetChange,
  initialAsset
}: AdminHighResUploadProps) {
  const [mode, setMode] = useState<'choice' | 'cloudinary' | 'external' | 'preview'>('choice');
  const [asset, setAsset] = useState<HighResAsset | null>(initialAsset || null);
  const [externalUrl, setExternalUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from existing asset
  useEffect(() => {
    if (initialAsset) {
      setAsset(initialAsset);
      setMode('preview');
      if (initialAsset.externalUrl) {
        setExternalUrl(initialAsset.externalUrl);
      }
      setFilename(initialAsset.filename);
    }
  }, [initialAsset]);

  /**
   * Open Cloudinary Upload Widget
   * If replacing an existing Cloudinary asset, delete the old one first
   */
  const openCloudinaryWidget = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[HighResManager] Opening Cloudinary widget. Current asset:', asset);
    }

    // If replacing an existing Cloudinary asset, delete it first
    if (asset?.assetType === 'cloudinary') {
      // Try to get public_id from the stored field or extract from URL
      let publicId = asset.cloudinaryPublicId;

      if (!publicId && asset.cloudinaryUrl) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[HighResManager] No public_id stored, extracting from URL...');
        }
        publicId = extractCloudinaryPublicId(asset.cloudinaryUrl) || undefined;
      }

      if (publicId) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[HighResManager] Deleting old Cloudinary asset before uploading new one');
        }
        await deleteFromCloudinary(publicId);
      }
    }
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary is not configured. Please check environment variables.');
      return;
    }

    if (!window.cloudinary) {
      setError('Cloudinary widget is not loaded. Please refresh the page.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url'],
        multiple: false,
        maxFileSize: 10485760, // 10MB
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'tiff', 'psd', 'pdf'],
        folder: 'high-res-assets',
      },
      (error: any, result: CloudinaryUploadResult) => {
        if (error) {
          setIsUploading(false);

          // Smart Fallback: Check if error is due to file size
          if (error.message && (
            error.message.includes('File size') ||
            error.message.includes('too large') ||
            error.message.includes('exceeds')
          )) {
            setError('File exceeds 10MB limit. Please use an external link instead.');
            setMode('external');
          } else {
            setError(error.message || 'Upload failed. Please try again.');
          }
          return;
        }

        if (result && result.event === 'success' && result.info) {
          const newAsset: HighResAsset = {
            assetType: 'cloudinary',
            cloudinaryUrl: result.info.secure_url,
            cloudinaryPublicId: result.info.public_id, // Store for deletion
            filename: result.info.original_filename || 'download',
            uploadedAt: new Date().toISOString(),
            // Capture metadata for auto-detection
            metadata: {
              bytes: result.info.bytes,
              width: result.info.width,
              height: result.info.height,
            },
          };

          setAsset(newAsset);
          setFilename(newAsset.filename);
          setMode('preview');
          setIsUploading(false);
          onAssetChange(newAsset);

          widget.close();
        }
      }
    );

    widget.open();
  };

  /**
   * Save External Link
   */
  const handleSaveExternalLink = () => {
    if (!externalUrl || !filename) {
      setError('Please provide both URL and filename.');
      return;
    }

    // Basic URL validation
    try {
      new URL(externalUrl);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    const newAsset: HighResAsset = {
      assetType: 'external',
      externalUrl,
      filename,
      uploadedAt: new Date().toISOString(),
    };

    setAsset(newAsset);
    setMode('preview');
    setError(null);
    onAssetChange(newAsset);
  };

  /**
   * Delete asset from Cloudinary
   */
  const deleteFromCloudinary = async (publicId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[HighResManager] Attempting to delete asset with public_id:', publicId);
    }

    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      const result = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('[HighResManager] Deletion API response:', { status: response.status, result });
      }

      if (!response.ok) {
        console.error('[HighResManager] Failed to delete from Cloudinary:', result);
        alert(`Failed to delete from Cloudinary: ${result.error || 'Unknown error'}\nCheck console for details.`);
        // Don't throw - we still want to allow the user to proceed
        return false;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[HighResManager] ✅ Successfully deleted from Cloudinary:', publicId);
      }
      return true;
    } catch (error) {
      console.error('[HighResManager] Error deleting from Cloudinary:', error);
      alert(`Error deleting from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Reset/Clear Asset
   * If the current asset is from Cloudinary, delete it first
   */
  const handleReset = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[HighResManager] Reset called. Current asset:', asset);
    }

    // If current asset is from Cloudinary, delete it
    if (asset?.assetType === 'cloudinary') {
      // Try to get public_id from the stored field or extract from URL
      let publicId = asset.cloudinaryPublicId;

      if (!publicId && asset.cloudinaryUrl) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[HighResManager] No public_id stored, extracting from URL...');
        }
        publicId = extractCloudinaryPublicId(asset.cloudinaryUrl) || undefined;
        if (process.env.NODE_ENV === 'development') {
          console.log('[HighResManager] Extracted public_id:', publicId);
        }
      }

      if (publicId) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[HighResManager] Deleting Cloudinary asset before reset');
        }
        await deleteFromCloudinary(publicId);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HighResManager] Could not determine public_id for deletion');
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('[HighResManager] No Cloudinary asset to delete. Asset type:', asset?.assetType);
      }
    }

    setAsset(null);
    setExternalUrl('');
    setFilename('');
    setError(null);
    setMode('choice');
    onAssetChange(null);
  };

  /**
   * Render: Choice Screen
   */
  if (mode === 'choice') {
    return (
      <div className="rounded-lg border-2 border-dashed border-sage-300 bg-cream p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold text-charcoal">
          Add High-Resolution Asset
        </h3>
        <p className="mb-6 text-sm text-soft-charcoal">
          Choose how you want to provide the high-resolution file for download:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Cloudinary Upload Option */}
          <button
            onClick={() => setMode('cloudinary')}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-sage-400 bg-white p-6 transition-all hover:border-sage-500 hover:shadow-md"
          >
            <UploadCloud className="h-8 w-8 text-sage-500" />
            <div className="text-center">
              <p className="font-semibold text-charcoal">Upload to Cloudinary</p>
              <p className="mt-1 text-xs text-soft-charcoal">Files under 10MB</p>
            </div>
          </button>

          {/* External Link Option */}
          <button
            onClick={() => setMode('external')}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-lavender-400 bg-white p-6 transition-all hover:border-lavender-500 hover:shadow-md"
          >
            <ExternalLink className="h-8 w-8 text-lavender-500" />
            <div className="text-center">
              <p className="font-semibold text-charcoal">External Link</p>
              <p className="mt-1 text-xs text-soft-charcoal">Google Drive, Dropbox</p>
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render: Cloudinary Upload Mode
   */
  if (mode === 'cloudinary') {
    return (
      <div className="rounded-lg border-2 border-sage-400 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Upload to Cloudinary
          </h3>
          <button
            onClick={() => setMode('choice')}
            className="text-soft-charcoal hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-sage-50 p-4">
          <p className="text-sm text-soft-charcoal">
            Upload files up to <strong>10MB</strong>. Supported formats: PNG, JPG, TIFF, PSD, PDF.
          </p>
        </div>

        <button
          onClick={openCloudinaryWidget}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-500 px-6 py-4 font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              Choose File to Upload
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p>{error}</p>
              {error.includes('10MB') && (
                <button
                  onClick={() => setMode('external')}
                  className="mt-2 text-sm font-semibold underline"
                >
                  Switch to External Link
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render: External Link Mode
   */
  if (mode === 'external') {
    return (
      <div className="rounded-lg border-2 border-lavender-400 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Add External Link
          </h3>
          <button
            onClick={() => setMode('choice')}
            className="text-soft-charcoal hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-4 rounded-lg bg-lavender-50 p-4 text-sm text-soft-charcoal">
          <p><strong>Perfect for large files!</strong> Use Google Drive or Dropbox:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Google Drive:</strong> Right-click → Get link → "Anyone with the link"</li>
            <li><strong>Dropbox:</strong> Share → Copy link (change ?dl=0 to ?dl=1)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-charcoal">
              External Link URL *
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-lavender-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-charcoal">
              Filename *
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="moon-16x20.tiff"
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-lavender-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSaveExternalLink}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lavender-500 px-6 py-4 font-semibold text-white transition-all hover:bg-lavender-400 hover:shadow-lg"
          >
            <CheckCircle className="h-5 w-5" />
            Save External Link
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render: Preview/Success State
   */
  if (mode === 'preview' && asset) {
    const isCloudinary = asset.assetType === 'cloudinary';
    const displayUrl = isCloudinary ? asset.cloudinaryUrl : asset.externalUrl;

    return (
      <div className="rounded-lg border-2 border-green-400 bg-green-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Asset Ready!
              </h3>
              <p className="mt-1 text-sm text-soft-charcoal">
                {isCloudinary ? 'Uploaded to Cloudinary' : 'External link configured'}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-soft-charcoal hover:text-charcoal"
            title="Remove and start over"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 rounded-lg bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">Filename:</span>
            <span className="text-sm text-soft-charcoal">{asset.filename}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">Type:</span>
            <span className="text-sm text-soft-charcoal">
              {isCloudinary ? 'Cloudinary Upload' : 'External Link'}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm font-semibold text-charcoal">URL:</span>
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-xs truncate text-sm text-sage-600 hover:underline"
            >
              {displayUrl}
            </a>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-4 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-charcoal transition-all hover:border-charcoal"
        >
          Change Asset
        </button>
      </div>
    );
  }

  return null;
}

/**
 * CustomerDownloadButton Component
 *
 * Renders a download button for customers to download high-res files.
 * Works with both Cloudinary URLs and external links.
 */
export function CustomerDownloadButton({
  url,
  filename,
  size = 'md',
  variant = 'primary',
  className = '',
}: CustomerDownloadButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-sage-500 text-white hover:bg-sage-400',
    secondary: 'bg-white text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-white',
  };

  return (
    <a
      href={url}
      download={filename}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:shadow-lg ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <Download className="h-5 w-5" />
      Download
    </a>
  );
}
