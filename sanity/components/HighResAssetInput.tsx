'use client';

import React, { useCallback } from 'react';
import { set, unset, KeyedSegment } from 'sanity';
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
        // NOTE: Patches are relative to the parent of highResAsset (the array item)
        const patches: Array<ReturnType<typeof set> | ReturnType<typeof unset>> = [
          set(newAsset.assetType, ['highResAsset', 'assetType']),
          set(newAsset.filename, ['highResAsset', 'filename']),
          set(newAsset.uploadedAt || new Date().toISOString(), ['highResAsset', 'uploadedAt']),
        ];

        // Conditionally add URL patches based on type
        if (newAsset.assetType === 'cloudinary' && newAsset.cloudinaryUrl) {
          patches.push(set(newAsset.cloudinaryUrl, ['highResAsset', 'cloudinaryUrl']));
          if (newAsset.cloudinaryPublicId) {
            patches.push(set(newAsset.cloudinaryPublicId, ['highResAsset', 'cloudinaryPublicId']));
          }
          patches.push(unset(['highResAsset', 'externalUrl']));
        } else if (newAsset.assetType === 'external' && newAsset.externalUrl) {
          patches.push(set(newAsset.externalUrl, ['highResAsset', 'externalUrl']));
          patches.push(unset(['highResAsset', 'cloudinaryUrl']));
          patches.push(unset(['highResAsset', 'cloudinaryPublicId']));
        }

        // AUTO-DETECTION: If metadata exists, also update sibling fileSize and dimensions
        // This works with both simple paths and Sanity array structures
        if (newAsset.metadata && path.length > 0) {
          const fileSize = formatFileSize(newAsset.metadata.bytes);
          const dimensions = formatDimensions(newAsset.metadata.width, newAsset.metadata.height);

          // Debug: Log the path structure
          console.log('[HighResAssetInput] DEBUG path:', JSON.stringify(path, null, 2));
          console.log('[HighResAssetInput] DEBUG path types:', path.map((s: any) => typeof s));

          // Get the parent path (remove 'highResAsset' from the end)
          const parentPath = path.slice(0, -1);
          console.log('[HighResAssetInput] DEBUG parentPath:', JSON.stringify(parentPath, null, 2));

          /**
           * Check if a path segment is a valid Sanity KeyedSegment
           * KeyedSegment = {_key: string} - used for array item paths
           */
          const isKeyedSegment = (segment: any): segment is KeyedSegment => {
            return (
              typeof segment === 'object' &&
              segment !== null &&
              '_key' in segment &&
              typeof segment._key === 'string'
            );
          };

          /**
           * Validate that all segments are valid for Sanity patches
           * Valid segments: string | number | {_key: string}
           *
           * Example valid paths:
           * - ['sizes', {_key: 'abc123'}, 'highResAsset'] ✅ (array item)
           * - ['config', 'asset'] ✅ (simple object)
           * - ['items', 0, 'asset'] ✅ (array index)
           */
          const isValidSanityPath = (pathSegments: any[]): boolean => {
            return pathSegments.every((segment: any) =>
              typeof segment === 'string' ||
              typeof segment === 'number' ||
              isKeyedSegment(segment)
            );
          };

          // Validate path structure
          if (isValidSanityPath(parentPath)) {
            // Auto-update sibling fields with metadata
            // Since patches are relative to the parent array item, we use simple field names
            if (fileSize && fileSize !== '0 MB') {
              patches.push(set(fileSize, ['fileSize']));
              console.log('[HighResAssetInput] Auto-updated fileSize:', fileSize);
            }
            if (dimensions) {
              patches.push(set(dimensions, ['dimensions']));
              console.log('[HighResAssetInput] Auto-updated dimensions:', dimensions);
            }
          } else {
            // This should rarely happen - only if path contains invalid segments
            console.warn('[HighResAssetInput] Skipping auto-update: Invalid path structure', {
              parentPath,
              pathTypes: parentPath.map(s => typeof s),
            });
          }
        }

        // Apply all patches
        onChange(patches);
      } else {
        // Clear all values if asset is removed
        // Patches are relative to the parent array item
        onChange([
          unset(['highResAsset', 'assetType']),
          unset(['highResAsset', 'cloudinaryUrl']),
          unset(['highResAsset', 'externalUrl']),
          unset(['highResAsset', 'filename']),
          unset(['highResAsset', 'uploadedAt']),
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
