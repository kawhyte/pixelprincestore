/**
 * Type definitions for High-Resolution Asset Manager
 */

export type AssetType = 'cloudinary' | 'external';

export interface HighResAsset {
  assetType: AssetType;
  cloudinaryUrl?: string;
  externalUrl?: string;
  filename: string;
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
    format?: string;
    public_id?: string;
  };
}
