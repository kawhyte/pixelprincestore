/**
 * Type definitions for High-Resolution Asset Manager
 */

export type AssetType = 'cloudinary' | 'external';

export interface HighResAsset {
  assetType: AssetType;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string; // For deletion purposes
  externalUrl?: string;
  filename: string;
  uploadedAt?: string;
  // Auto-detected metadata from Cloudinary
  metadata?: {
    bytes?: number;
    width?: number;
    height?: number;
  };
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
