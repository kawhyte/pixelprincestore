/**
 * TypeScript declarations for Cloudinary Upload Widget
 * Loaded via script tag in app/layout.tsx
 */

interface CloudinaryUploadWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  sources?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  maxImageFileSize?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  clientAllowedFormats?: string[];
  maxChunkSize?: number;
  folder?: string;
  tags?: string[];
  context?: Record<string, string>;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  cropping?: boolean;
  croppingAspectRatio?: number;
  croppingDefaultSelectionRatio?: number;
  croppingShowDimensions?: boolean;
  croppingCoordinatesMode?: 'custom' | 'face';
  showSkipCropButton?: boolean;
  theme?: 'default' | 'white' | 'minimal';
  styles?: Record<string, string | number>;
  language?: string;
  text?: Record<string, string>;
}

interface CloudinaryUploadWidgetError {
  status: string;
  statusText: string;
  message?: string;
}

interface CloudinaryUploadWidgetResult {
  event: 'success' | 'queues-end' | 'close' | 'display-changed' | 'source-changed' | 'abort' | 'batch-cancelled' | 'tags' | 'upload-added' | 'publicid' | 'retry' | 'show-completed' | 'queues-start';
  info?: {
    id?: string;
    batchId?: string;
    asset_id?: string;
    public_id?: string;
    version?: number;
    version_id?: string;
    signature?: string;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
    created_at?: string;
    tags?: string[];
    bytes?: number;
    type?: string;
    etag?: string;
    placeholder?: boolean;
    url?: string;
    secure_url?: string;
    folder?: string;
    original_filename?: string;
    path?: string;
    thumbnail_url?: string;
  };
}

type CloudinaryUploadWidgetCallback = (
  error: CloudinaryUploadWidgetError | null,
  result: CloudinaryUploadWidgetResult
) => void;

interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
  isShowing: () => boolean;
  isMinimized: () => boolean;
  minimize: () => void;
  update: (options: Partial<CloudinaryUploadWidgetOptions>) => void;
}

interface Cloudinary {
  createUploadWidget: (
    options: CloudinaryUploadWidgetOptions,
    callback: CloudinaryUploadWidgetCallback
  ) => CloudinaryUploadWidget;
  openUploadWidget: (
    options: CloudinaryUploadWidgetOptions,
    callback: CloudinaryUploadWidgetCallback
  ) => void;
}

declare global {
  interface Window {
    cloudinary?: Cloudinary;
  }
}

export {};
