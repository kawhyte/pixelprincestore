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
        cloudinaryPublicId: value.cloudinaryPublicId,
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
        // Build patches array for highResAsset fields
        // Patches for fields WITHIN highResAsset are relative to the object itself
        const patches: Array<ReturnType<typeof set> | ReturnType<typeof unset>> = [
          set(newAsset.assetType, ['assetType']),
          set(newAsset.filename, ['filename']),
          set(newAsset.uploadedAt || new Date().toISOString(), ['uploadedAt']),
        ];

        // Conditionally add URL patches based on type
        if (newAsset.assetType === 'cloudinary' && newAsset.cloudinaryUrl) {
          patches.push(set(newAsset.cloudinaryUrl, ['cloudinaryUrl']));
          if (newAsset.cloudinaryPublicId) {
            patches.push(set(newAsset.cloudinaryPublicId, ['cloudinaryPublicId']));
          }
          patches.push(unset(['externalUrl']));
        } else if (newAsset.assetType === 'external' && newAsset.externalUrl) {
          patches.push(set(newAsset.externalUrl, ['externalUrl']));
          patches.push(unset(['cloudinaryUrl']));
          patches.push(unset(['cloudinaryPublicId']));
        }

        // Note: Auto-updating sibling fields (fileSize, dimensions) from metadata
        // is not supported due to Sanity's patching architecture limitations.
        // These fields should be updated manually in the Sanity Studio.

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
          unset(['cloudinaryPublicId']),
        ]);
      }
    },
    [onChange, path]
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
