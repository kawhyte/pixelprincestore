/**
 * Type definitions for High-Resolution Asset Manager
 */

export interface HighResAsset {
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string; // For deletion purposes
  externalUrl?: string; // Legacy only — no new external uploads
  filename: string;
  width?: number;
  height?: number;
  bytes?: number;
  uploadedAt?: string;
}

export interface AdminHighResUploadProps {
  onAssetChange: (asset: HighResAsset | null) => void;
  initialAsset?: HighResAsset | null;
}

export interface CustomerDownloadButtonProps {
  url: string;
  filename: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export interface CloudinaryUploadResult {
  event: string;
  info?: {
    secure_url?: string;
    original_filename?: string;
    bytes?: number;
    width?: number;
    height?: number;
    format?: string;
    public_id?: string;
  };
}
