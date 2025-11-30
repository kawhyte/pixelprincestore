'use client';

import React, { useCallback } from 'react';
import { set, unset } from 'sanity';
import { ObjectInputProps } from 'sanity';
import { AdminHighResUpload } from '@/components/admin/HighResManager';
import type { HighResAsset } from '@/lib/types/high-res-asset';

/**
 * Sanity Studio Custom Input Component for High-Resolution Asset
 *
 * This component wraps the AdminHighResUpload component and integrates it
 * with Sanity's form system, handling value updates and persistence.
 */
export function HighResAssetInput(props: ObjectInputProps) {
  const { value, onChange, path } = props;

  // Convert Sanity value to our HighResAsset type
  const currentAsset: HighResAsset | null = value
    ? {
        assetType: value.assetType as 'cloudinary' | 'external',
        cloudinaryUrl: value.cloudinaryUrl,
        externalUrl: value.externalUrl,
        filename: value.filename,
        uploadedAt: value.uploadedAt,
      }
    : null;

  /**
   * Format bytes to human-readable MB
   */
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  /**
   * Format dimensions
   */
  const formatDimensions = (width?: number, height?: number): string => {
    if (!width || !height) return '';
    return `${width} × ${height} px`;
  };

  /**
   * Handle asset changes from the AdminHighResUpload component
   */
  const handleAssetChange = useCallback(
    (newAsset: HighResAsset | null) => {
      if (newAsset) {
        // Build patches array for highResAsset fields
        const patches = [
          set(newAsset.assetType, ['assetType']),
          set(newAsset.filename, ['filename']),
          set(newAsset.uploadedAt || new Date().toISOString(), ['uploadedAt']),
        ];

        // Conditionally add URL patches based on type
        if (newAsset.assetType === 'cloudinary' && newAsset.cloudinaryUrl) {
          patches.push(set(newAsset.cloudinaryUrl, ['cloudinaryUrl']));
          patches.push(unset(['externalUrl']));
        } else if (newAsset.assetType === 'external' && newAsset.externalUrl) {
          patches.push(set(newAsset.externalUrl, ['externalUrl']));
          patches.push(unset(['cloudinaryUrl']));
        }

        // AUTO-DETECTION: If metadata exists, also update parent fileSize and dimensions
        if (newAsset.metadata && path.length > 0) {
          const fileSize = formatFileSize(newAsset.metadata.bytes);
          const dimensions = formatDimensions(newAsset.metadata.width, newAsset.metadata.height);

          // Get the parent path (remove 'highResAsset' from the end)
          const parentPath = path.slice(0, -1);

          if (fileSize) {
            // Patch sibling fileSize field
            patches.push(set(fileSize, [...parentPath, 'fileSize']));
          }
          if (dimensions) {
            // Patch sibling dimensions field
            patches.push(set(dimensions, [...parentPath, 'dimensions']));
          }
        }

        // Apply all patches
        onChange(patches);
      } else {
        // Clear all values if asset is removed
        onChange([
          unset(['assetType']),
          unset(['cloudinaryUrl']),
          unset(['externalUrl']),
          unset(['filename']),
          unset(['uploadedAt']),
        ]);
      }
    },
    [onChange]
  );

  return (
    <div className="pt-4">
      <AdminHighResUpload
        initialAsset={currentAsset}
        onAssetChange={handleAssetChange}
      />
    </div>
  );
}
