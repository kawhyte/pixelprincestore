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
  const { value, onChange } = props;

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
   * Handle asset changes from the AdminHighResUpload component
   */
  const handleAssetChange = useCallback(
    (newAsset: HighResAsset | null) => {
      if (newAsset) {
        // Build patches array
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
