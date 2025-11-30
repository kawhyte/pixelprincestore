# Hybrid High-Resolution Asset Manager - Implementation Plan

## Project Overview

**Objective:** Build a file management system for high-resolution digital assets with a hybrid approach:
- **Primary Method (< 10MB):** Cloudinary Upload Widget with free tier
- **Fallback Method (> 10MB):** Manual external links (Google Drive, Dropbox)

**Constraint:** No ongoing costs - Free tier only

---

## Phase 1: Environment & Dependencies Setup

### 1.1 Environment Variables
- [ ] Add Cloudinary credentials to `.env.local`
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Update `.env.example` with Cloudinary variable placeholders

### 1.2 Cloudinary Setup (Free Tier)
- [ ] Create free Cloudinary account (if not exists)
- [ ] Create unsigned upload preset with 10MB limit
- [ ] Configure upload preset settings:
  - Max file size: 10MB
  - Allowed formats: PNG, JPG, TIFF, PSD, PDF
  - Folder: `high-res-assets`
- [ ] Copy Cloud Name and Upload Preset name

### 1.3 Dependencies Check
- [ ] Verify `lucide-react` is installed (already in package.json)
- [ ] Verify Tailwind CSS is configured (already in project)
- [ ] Add Cloudinary widget script to app layout

---

## Phase 2: Database Schema Updates

### 2.1 Update Sanity Schema - artSize
**File:** `/sanity/schemaTypes/artSize.ts`

- [ ] Add `highResAsset` field to artSize schema
  ```typescript
  {
    name: 'highResAsset',
    title: 'High Resolution Asset',
    type: 'object',
    description: 'High-res file for this size (Cloudinary or external link)',
    fields: [
      {
        name: 'assetType',
        type: 'string',
        options: {
          list: [
            { title: 'Cloudinary Upload', value: 'cloudinary' },
            { title: 'External Link (Drive/Dropbox)', value: 'external' }
          ]
        }
      },
      {
        name: 'cloudinaryUrl',
        type: 'url',
        hidden: ({ parent }) => parent?.assetType !== 'cloudinary'
      },
      {
        name: 'externalUrl',
        type: 'url',
        hidden: ({ parent }) => parent?.assetType !== 'external'
      },
      {
        name: 'filename',
        type: 'string'
      }
    ]
  }
  ```

### 2.2 Schema Deployment
- [ ] Test schema changes in Sanity Studio (`npm run dev`)
- [ ] Verify new fields appear in Studio UI
- [ ] Deploy schema changes to production (if applicable)

---

## Phase 3: Component Development

### 3.1 Create HighResManager Component File
**File:** `/components/admin/HighResManager.tsx`

- [ ] Create directory `/components/admin/` if it doesn't exist
- [ ] Create the main component file

### 3.2 AdminHighResUpload Component
- [ ] Create component structure with TypeScript interface:
  ```typescript
  interface AdminHighResUploadProps {
    onAssetChange: (asset: HighResAsset) => void;
    initialUrl?: string;
    initialType?: 'cloudinary' | 'external';
  }
  ```

- [ ] Implement UI States:
  - [ ] Initial choice screen (Upload vs External Link)
  - [ ] Cloudinary upload mode with widget button
  - [ ] External link input mode
  - [ ] Preview/success state with asset details
  - [ ] Error state with helpful messages

- [ ] Implement Cloudinary Widget Integration:
  - [ ] Load Cloudinary widget script
  - [ ] Configure widget with cloud name and preset
  - [ ] Set 10MB max file size
  - [ ] Handle successful upload callback
  - [ ] Extract secure URL from response

- [ ] Implement Smart Fallback Logic:
  - [ ] Detect "File size too large" error from Cloudinary
  - [ ] Auto-switch to External Link mode on size error
  - [ ] Show user-friendly error message
  - [ ] Provide size guidance (e.g., "File exceeds 10MB limit")

- [ ] Implement External Link Mode:
  - [ ] Text input for URL
  - [ ] URL validation (Google Drive, Dropbox, etc.)
  - [ ] Preview/test link functionality
  - [ ] Extract filename from URL if possible

- [ ] Implement Reset/Change functionality:
  - [ ] Button to clear current asset
  - [ ] Return to choice screen
  - [ ] Confirm before clearing

### 3.3 CustomerDownloadButton Component
- [ ] Create component structure with TypeScript interface:
  ```typescript
  interface CustomerDownloadButtonProps {
    url: string;
    filename: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
  }
  ```

- [ ] Implement UI:
  - [ ] Styled button with lucide-react Download icon
  - [ ] Tailwind CSS styling matching site theme
  - [ ] Responsive design (mobile-friendly)
  - [ ] Hover/active states
  - [ ] Loading state (optional)

- [ ] Implement Download Logic:
  - [ ] Use `<a>` tag with `target="_blank"` for external links
  - [ ] Add `download` attribute with filename
  - [ ] Handle both Cloudinary and external links
  - [ ] Add `rel="noopener noreferrer"` for security

- [ ] Add Accessibility:
  - [ ] Proper ARIA labels
  - [ ] Keyboard navigation support
  - [ ] Screen reader friendly text

### 3.4 Export Components
- [ ] Export both components from HighResManager.tsx
- [ ] Add TypeScript type exports
- [ ] Create barrel export in `/components/admin/index.ts` (if pattern exists)

---

## Phase 4: Sanity Studio Integration

### 4.1 Create Custom Sanity Input Component
**File:** `/sanity/components/HighResAssetInput.tsx`

- [ ] Import AdminHighResUpload component
- [ ] Wrap component for Sanity Studio usage
- [ ] Handle Sanity's field value structure
- [ ] Implement onChange callback for Sanity
- [ ] Add validation for required fields

### 4.2 Register Custom Input in Schema
- [ ] Update artSize schema to use custom input component
- [ ] Test component rendering in Sanity Studio
- [ ] Verify data persistence in Sanity

---

## Phase 5: Frontend Integration

### 5.1 Add Cloudinary Script to Layout
**File:** `/app/layout.tsx`

- [ ] Add Cloudinary widget script to `<head>`:
  ```tsx
  <script
    src="https://upload-widget.cloudinary.com/global/all.js"
    async
  />
  ```
- [ ] Add TypeScript declaration for window.cloudinary (if needed)

### 5.2 Update Art Detail Page
**File:** `/app/art/[id]/art-detail-client.tsx` (or similar)

- [ ] Import CustomerDownloadButton component
- [ ] Add download buttons for each size option
- [ ] Pass high-res asset URL and filename
- [ ] Style download section to match existing design
- [ ] Add conditional rendering (only show if high-res available)

### 5.3 Create TypeScript Types
**File:** `/lib/types/high-res-asset.ts` (or add to existing types)

- [ ] Define HighResAsset interface:
  ```typescript
  export interface HighResAsset {
    assetType: 'cloudinary' | 'external';
    cloudinaryUrl?: string;
    externalUrl?: string;
    filename: string;
    uploadedAt?: string;
  }
  ```
- [ ] Export all related types

---

## Phase 6: Styling & UI Polish

### 6.1 Component Styling
- [ ] Match AdminHighResUpload to existing admin UI patterns
- [ ] Match CustomerDownloadButton to site theme colors:
  - Primary: sage/clay/lavender variants
  - Text: charcoal/soft-charcoal
  - Background: cream
- [ ] Add responsive breakpoints (mobile, tablet, desktop)
- [ ] Test dark mode compatibility (if applicable)

### 6.2 Icons Implementation
- [ ] Import icons from lucide-react:
  - `UploadCloud` for upload button
  - `ExternalLink` for external link mode
  - `Download` for customer download button
  - `AlertCircle` for error states
  - `CheckCircle` for success states
  - `X` for close/reset buttons
- [ ] Ensure consistent icon sizing

### 6.3 Animations & Transitions
- [ ] Add smooth transitions between states
- [ ] Add loading spinner for upload process
- [ ] Add success animation (optional - canvas-confetti is available)
- [ ] Add error shake animation (optional)

---

## Phase 7: Error Handling & Validation

### 7.1 AdminHighResUpload Error Handling
- [ ] Handle Cloudinary widget loading errors
- [ ] Handle network errors during upload
- [ ] Handle invalid file types
- [ ] Handle file size exceeded (trigger fallback)
- [ ] Handle invalid external URLs
- [ ] Handle missing environment variables
- [ ] Display user-friendly error messages

### 7.2 CustomerDownloadButton Error Handling
- [ ] Handle missing/invalid URLs gracefully
- [ ] Handle broken external links
- [ ] Show appropriate error message to user
- [ ] Add retry mechanism (optional)

### 7.3 Validation
- [ ] Validate URL format for external links
- [ ] Validate file extensions in URLs
- [ ] Validate required fields before save
- [ ] Add client-side validation feedback

---

## Phase 8: Testing

### 8.1 Component Testing
- [ ] Test AdminHighResUpload with small files (< 10MB)
- [ ] Test AdminHighResUpload with large files (> 10MB - should trigger fallback)
- [ ] Test external link input with various URL formats
- [ ] Test CustomerDownloadButton with Cloudinary URLs
- [ ] Test CustomerDownloadButton with Google Drive links
- [ ] Test CustomerDownloadButton with Dropbox links

### 8.2 Integration Testing
- [ ] Test complete workflow: Upload → Save → Download
- [ ] Test Sanity Studio custom input functionality
- [ ] Test data persistence in Sanity
- [ ] Test frontend display of download buttons
- [ ] Test responsive design on mobile devices
- [ ] Test in different browsers (Chrome, Firefox, Safari)

### 8.3 Edge Cases
- [ ] Test with no environment variables
- [ ] Test with invalid Cloudinary credentials
- [ ] Test with expired external links
- [ ] Test with very long filenames
- [ ] Test with special characters in filenames
- [ ] Test concurrent uploads (if applicable)

### 8.4 User Acceptance Testing
- [ ] Admin workflow: Can admin easily upload files?
- [ ] Admin workflow: Is fallback mechanism clear?
- [ ] Customer workflow: Can customers download files easily?
- [ ] Customer workflow: Do external links open correctly?

---

## Phase 9: Documentation

### 9.1 Code Documentation
- [ ] Add JSDoc comments to all components
- [ ] Document props and their types
- [ ] Add usage examples in component files
- [ ] Document environment variables needed

### 9.2 User Documentation
- [ ] Create admin guide for uploading high-res files
  - When to use Cloudinary vs External Links
  - How to get shareable Google Drive links
  - How to get shareable Dropbox links
- [ ] Create troubleshooting guide
- [ ] Add FAQ section

### 9.3 README Updates
- [ ] Update main README with new feature
- [ ] Add environment variable setup instructions
- [ ] Add Cloudinary setup instructions

---

## Phase 10: Deployment & Cleanup

### 10.1 Pre-Deployment Checklist
- [ ] Remove all console.log statements
- [ ] Remove all TODO comments
- [ ] Verify all environment variables are set
- [ ] Run TypeScript type checking (`npm run build`)
- [ ] Run linting (`npm run lint`)
- [ ] Test in production-like environment

### 10.2 Deployment
- [ ] Commit changes with descriptive message
- [ ] Push to repository
- [ ] Deploy to production (Vercel/other)
- [ ] Verify environment variables in production
- [ ] Test production build

### 10.3 Post-Deployment Verification
- [ ] Test upload functionality in production
- [ ] Test download functionality in production
- [ ] Monitor for errors in production logs
- [ ] Verify Cloudinary usage stays within free tier limits

### 10.4 Cleanup
- [ ] Remove unused imports
- [ ] Remove unused files/components
- [ ] Archive this implementation plan with completion date

---

## Technical Architecture Summary

### Component Hierarchy
```
AdminHighResUpload (Sanity Studio)
  ├─ Choice Screen
  ├─ Cloudinary Upload Mode
  │   └─ Cloudinary Widget (external script)
  ├─ External Link Mode
  │   └─ URL Input Form
  └─ Preview/Success State

CustomerDownloadButton (Frontend)
  └─ Download Link (<a> tag)
```

### Data Flow
```
1. Admin uploads file → Cloudinary Widget → Returns URL
   OR
   Admin enters external link → Validation → Store URL

2. Data saved to Sanity:
   {
     assetType: 'cloudinary' | 'external',
     cloudinaryUrl?: string,
     externalUrl?: string,
     filename: string
   }

3. Frontend fetches product → Render download buttons → Customer clicks → File downloads
```

### File Structure
```
pixelprincestore/
├── components/
│   └── admin/
│       ├── HighResManager.tsx (AdminHighResUpload + CustomerDownloadButton)
│       └── index.ts (exports)
├── sanity/
│   ├── components/
│   │   └── HighResAssetInput.tsx (Sanity wrapper)
│   └── schemaTypes/
│       └── artSize.ts (updated with highResAsset field)
├── lib/
│   └── types/
│       └── high-res-asset.ts (TypeScript types)
├── app/
│   ├── layout.tsx (Cloudinary script)
│   └── art/[id]/
│       └── art-detail-client.tsx (download buttons)
└── docs/
    └── high_res_implementation_plan.md (this file)
```

---

## Notes & Considerations

### Free Tier Limits (Cloudinary)
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **File Size:** 10 MB max per file (enforced in upload preset)

### External Link Best Practices
- Use Google Drive: "Anyone with the link can view" sharing
- Use Dropbox: Direct download links (replace `?dl=0` with `?dl=1`)
- Validate URLs before saving
- Test links periodically for availability

### Security Considerations
- Use unsigned upload preset (acceptable for free tier, admin-only use)
- Add `rel="noopener noreferrer"` to all external links
- Validate all URLs on client and server
- Never expose API secrets in client-side code

### Future Enhancements (Post-MVP)
- [ ] Analytics tracking for download counts
- [ ] Link expiration checks for external URLs
- [ ] Automatic file compression before upload
- [ ] Support for additional cloud storage providers
- [ ] Batch upload functionality
- [ ] Preview modal before download

---

## Success Criteria

✅ **Feature Complete When:**
1. Admin can upload files < 10MB via Cloudinary
2. Admin can paste external links for files > 10MB
3. Smart fallback automatically switches to external link mode on size error
4. Customers can download high-res files with one click
5. All data persists correctly in Sanity
6. UI matches existing site design
7. No TypeScript errors
8. All tests pass
9. Documentation complete
10. Deployed to production successfully

---

**Estimated Completion:** This implementation can be completed in phases over multiple sessions. Each phase can be checked off as completed. Use this document as your "save game" state.

**Last Updated:** 2025-11-29
**Status:** Ready to begin Phase 1
