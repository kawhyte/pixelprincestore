# Testing Guide for Free Downloads System

This guide covers comprehensive testing procedures for the digital art download system with weekly limits.

---

## Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [Functional Testing](#functional-testing)
3. [Browser Compatibility](#browser-compatibility)
4. [Mobile Testing](#mobile-testing)
5. [Error Scenario Testing](#error-scenario-testing)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Security Testing](#security-testing)
9. [Testing Checklist](#testing-checklist)
10. [Bug Reporting](#bug-reporting)

---

## Pre-Testing Setup

### Development Environment

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open in browser**:
   ```
   http://localhost:3000
   ```

3. **Enable dev mode** (bypass download limits):
   - Create `.env.local` if it doesn't exist
   - Add: `DISABLE_DOWNLOAD_LIMIT=true`
   - Restart dev server

### Test Data Preparation

For full testing, you'll need test files in `private/free/`:

```bash
# Create placeholder test files (or use real artwork)
cd private/free

# Option 1: Use real artwork (recommended)
# Place your actual PNG files here

# Option 2: Create test placeholders (for structure testing only)
# Note: These won't be valid print-ready files
for art in ethereal-dreams vintage-map zen-garden botanical-study; do
  for size in 4x5 8x10 16x20 40x50cm; do
    touch "${art}-${size}.png"
  done
done

# Generate ZIP files
cd ../..
npm run generate-zips
```

### Browser DevTools Setup

Open DevTools in your browser:
- **Chrome/Edge**: F12 or Cmd+Option+I (Mac)
- **Firefox**: F12 or Cmd+Option+I (Mac)
- **Safari**: Cmd+Option+I (enable Developer menu first)

Enable these tabs:
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Application/Storage**: Inspect cookies

---

## Functional Testing

### 1. Gallery Page Display

**Test**: `/free-downloads` page loads correctly

- [ ] Page loads without errors
- [ ] All 4 art cards display
- [ ] Preview images load (or placeholder alts show)
- [ ] Download tracking status shows
- [ ] "X downloads remaining" message displays
- [ ] Hover effects work on cards
- [ ] "View Details" text appears on hover
- [ ] Earth-tone backgrounds show correctly
- [ ] Back to Home link works

**Expected behavior**: Gallery displays all artwork with correct styling and download status.

---

### 2. Detail Page Navigation

**Test**: Click on art card navigates to detail page

- [ ] Clicking card navigates to `/art/[id]`
- [ ] Detail page loads without errors
- [ ] Large preview image displays
- [ ] Title and artist name show correctly
- [ ] Description text is readable
- [ ] Tags display with sage-green badges
- [ ] "Back to Free Downloads" link works
- [ ] Size selector grid displays
- [ ] Download buttons visible

**Expected behavior**: Detail page renders with all artwork information and interactive elements.

---

### 3. Size Selection

**Test**: Size selector works correctly

- [ ] First size is auto-selected on page load
- [ ] Clicking different sizes updates selection
- [ ] Selected size shows green highlight
- [ ] Selected size shows checkmark icon
- [ ] Downloaded sizes show "Downloaded ✓" badge
- [ ] Downloaded sizes have lavender background
- [ ] Size dimensions display correctly
- [ ] File sizes display correctly
- [ ] "Recommended for" text shows for each size

**Expected behavior**: Size selection is intuitive and visual feedback is clear.

---

### 4. Single Size Download

**Test**: Download individual size works

1. Select a size (e.g., 8"×10")
2. Click "Download [Size]" button

- [ ] Button shows loading state ("Downloading...")
- [ ] API request to `/api/claim-art?artId=...&sizeId=...` fires
- [ ] File downloads to browser Downloads folder
- [ ] Filename format: `{title}-{size}.png`
- [ ] Confetti animation plays on success
- [ ] Success toast notification appears
- [ ] Download tracking updates (remaining count decreases)
- [ ] Size shows "Downloaded ✓" badge after download
- [ ] Cookie updates in DevTools → Application → Cookies

**Expected behavior**: File downloads successfully with visual celebration and tracking updates.

---

### 5. ZIP Bundle Download

**Test**: Download all sizes as ZIP works

1. Click "Download All Sizes (ZIP)" button

- [ ] Button shows loading state ("Preparing...")
- [ ] API request to `/api/claim-art?artId=...&type=all` fires
- [ ] ZIP file downloads to browser Downloads folder
- [ ] Filename format: `{title}-all-sizes.zip`
- [ ] Confetti animation plays on success
- [ ] Success toast notification appears
- [ ] Download tracking updates (remaining count decreases)
- [ ] Button changes to "ZIP Already Downloaded ✓"
- [ ] Cookie updates in DevTools

**Expected behavior**: ZIP bundle downloads with all sizes and instructions included.

---

### 6. ZIP Contents Verification

**Test**: Downloaded ZIP contains correct files

1. Download a ZIP file
2. Extract/open the ZIP

- [ ] ZIP opens without errors (Mac & Windows)
- [ ] Contains HOW-TO-OPEN.txt
- [ ] Contains all 4 size PNGs
- [ ] File naming matches config
- [ ] HOW-TO-OPEN.txt has Mac instructions
- [ ] HOW-TO-OPEN.txt has Windows instructions
- [ ] HOW-TO-OPEN.txt has printing tips
- [ ] All files are valid PNGs (not corrupted)

**Expected behavior**: ZIP contains complete artwork bundle with instructions.

---

### 7. Weekly Limit Enforcement

**Test**: 3 downloads per week limit works

**Without DISABLE_DOWNLOAD_LIMIT** (production mode):

1. Download 3 sizes (any combination)
2. Try to download a 4th

- [ ] First 3 downloads work normally
- [ ] After 3rd download, remaining shows "0"
- [ ] Download buttons become disabled
- [ ] Button text changes to "Weekly Limit Reached"
- [ ] Attempting 4th download shows error toast
- [ ] Error message: "You've reached your weekly limit..."
- [ ] Reset date shows in error message

**With DISABLE_DOWNLOAD_LIMIT=true** (dev mode):

- [ ] Unlimited downloads allowed
- [ ] No limit enforcement
- [ ] Tracking still updates

**Expected behavior**: Limit enforces after 3 downloads with clear messaging.

---

### 8. Already Downloaded Prevention

**Test**: Can't download same size twice

1. Download 8"×10" size
2. Try to download 8"×10" again

- [ ] First download succeeds
- [ ] Size shows "Downloaded ✓" badge
- [ ] Attempting second download shows error
- [ ] Error message: "You've already downloaded this size..."
- [ ] Remaining count doesn't decrease again

**Expected behavior**: System prevents duplicate downloads within the week.

---

### 9. Cookie Tracking Persistence

**Test**: Download tracking survives page reload

1. Download 1-2 sizes
2. Note remaining count
3. Refresh page
4. Check download status

- [ ] Remaining count persists after reload
- [ ] Downloaded sizes still show badges
- [ ] ZIP download state persists
- [ ] Cookie remains in DevTools → Application

**Expected behavior**: Download history persists across sessions via cookie.

---

### 10. Reset Date Display

**Test**: Reset date shows correctly

1. Download at least one size
2. Check status message

- [ ] Status shows "X downloads remaining"
- [ ] Status shows reset date (e.g., "Resets in 3 days")
- [ ] Format matches: "tomorrow", "in X days", "today"
- [ ] Date is 7 days from first download

**Expected behavior**: Users understand when downloads reset.

---

## Browser Compatibility

### Desktop Browsers

Test on these browsers (minimum):

#### Chrome (Latest)
- [ ] Windows 10/11
- [ ] macOS
- [ ] All features work
- [ ] No console errors
- [ ] Downloads work

#### Safari (Latest)
- [ ] macOS
- [ ] iOS 15+
- [ ] All features work
- [ ] No console errors
- [ ] Downloads work

#### Firefox (Latest)
- [ ] Windows 10/11
- [ ] macOS
- [ ] All features work
- [ ] No console errors
- [ ] Downloads work

#### Edge (Latest)
- [ ] Windows 10/11
- [ ] All features work
- [ ] No console errors
- [ ] Downloads work

### Known Browser Issues

Document any browser-specific issues found.

---

## Mobile Testing

### Responsive Design

Test on various screen sizes:

#### Mobile Portrait (375px - 428px)
- [ ] Gallery cards stack vertically
- [ ] Cards are tappable (adequate touch targets)
- [ ] Download tracking status visible
- [ ] Navigation works
- [ ] No horizontal scroll

#### Mobile Landscape (667px - 926px)
- [ ] Gallery shows 2 columns
- [ ] Content is readable
- [ ] Navigation works

#### Tablet Portrait (768px - 834px)
- [ ] Gallery shows 2 columns
- [ ] Detail page layout adapts
- [ ] Size selector grid is usable

#### Tablet Landscape (1024px+)
- [ ] Gallery shows 3-4 columns
- [ ] Detail page shows 2-column layout
- [ ] All features work

### Mobile Devices

#### iOS Safari
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (428px)
- [ ] iPad (768px)
- [ ] Touch interactions smooth
- [ ] Downloads work
- [ ] Confetti renders correctly
- [ ] Toasts display properly

#### Android Chrome
- [ ] Small phone (360px)
- [ ] Medium phone (412px)
- [ ] Large phone (428px)
- [ ] Tablet (800px+)
- [ ] Touch interactions smooth
- [ ] Downloads work

### Mobile-Specific Issues
- [ ] Buttons are easily tappable (min 44×44px)
- [ ] Text is readable without zooming
- [ ] Forms don't cause layout shift
- [ ] No content cut off
- [ ] Images load efficiently

---

## Error Scenario Testing

### 1. Missing File Error

**Test**: File doesn't exist in private/free/

1. Remove a PNG file from `private/free/`
2. Try to download that size

- [ ] API returns 500 error
- [ ] Error toast displays
- [ ] Message: "File not available. Please contact support."
- [ ] User is informed gracefully
- [ ] No console crashes

**Expected behavior**: Graceful error handling with user-friendly message.

---

### 2. Invalid Art ID

**Test**: Navigate to non-existent art

1. Visit `/art/invalid_id`

- [ ] 404 page displays
- [ ] "Artwork not found" message shows
- [ ] "Back to Gallery" link present
- [ ] No console errors
- [ ] Page is styled correctly

**Expected behavior**: Custom 404 page with navigation back.

---

### 3. Network Error

**Test**: Simulate network failure

1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Try to download

- [ ] Error toast appears
- [ ] Message: "Please check your connection..."
- [ ] Button returns to normal state
- [ ] No hanging loading states
- [ ] Can retry after reconnecting

**Expected behavior**: Network errors handled gracefully with retry capability.

---

### 4. Cleared Cookie Mid-Session

**Test**: Cookie deleted during use

1. Download 1-2 sizes
2. Open DevTools → Application → Cookies
3. Delete `pp_downloads` cookie
4. Refresh page

- [ ] Download tracking resets
- [ ] Message shows full limit available
- [ ] No console errors
- [ ] User can download again
- [ ] System creates new cookie

**Expected behavior**: System handles missing cookie gracefully.

---

### 5. Limit Reached Error

**Test**: Exceed weekly limit

1. Download 3 sizes
2. Try to download 4th

- [ ] 403 error response
- [ ] Error toast shows
- [ ] Message includes reset date
- [ ] Buttons become disabled
- [ ] Status updates correctly

**Expected behavior**: Clear messaging about limit with reset information.

---

### 6. Duplicate Download Attempt

**Test**: Try downloading same size twice

1. Download 8"×10"
2. Try downloading 8"×10" again

- [ ] 403 error response
- [ ] Error toast shows
- [ ] Message: "You've already downloaded this size..."
- [ ] Tracking doesn't double-count
- [ ] User can select different size

**Expected behavior**: Prevents duplicate downloads clearly.

---

## Performance Testing

### Page Load Times

Use Lighthouse (Chrome DevTools → Lighthouse):

- [ ] Performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1

### Image Optimization

Check image loading:

- [ ] Card previews load quickly (< 0.5s on 3G)
- [ ] Detail images load smoothly
- [ ] WebP format used where supported
- [ ] Proper image sizing (no unnecessary large images)
- [ ] Lazy loading works for below-fold images

### Download Performance

Test file downloads:

- [ ] Single size download starts immediately
- [ ] ZIP download starts within 1-2 seconds
- [ ] No timeout errors for large files
- [ ] Multiple downloads don't block UI
- [ ] Progress indication clear

### API Response Times

Check Network tab:

- [ ] `/api/claim-art` responds < 500ms (with local files)
- [ ] No unnecessary API calls
- [ ] Efficient cookie parsing
- [ ] Streaming works for large files

---

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Skip to main content link (if applicable)
- [ ] Buttons activatable with Enter/Space
- [ ] Escape closes modals (if any)
- [ ] No keyboard traps

### Screen Reader Testing

Test with:
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **iOS**: VoiceOver (Settings → Accessibility)

Check:
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form fields have labels
- [ ] Headings create logical structure
- [ ] Links describe their destination
- [ ] Status messages announced
- [ ] Error messages announced

### Color Contrast

Use browser extensions:
- [WAVE](https://wave.webaim.org/extension/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)

Check:
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] Interactive elements distinguishable
- [ ] Color not sole indicator of state

### ARIA Implementation

- [ ] Proper ARIA labels on buttons
- [ ] Live regions for status updates
- [ ] Role attributes where appropriate
- [ ] No ARIA anti-patterns

---

## Security Testing

### Cookie Security

Check in DevTools → Application → Cookies:

- [ ] `httpOnly` flag set (prevents JS access)
- [ ] `secure` flag set (HTTPS only in production)
- [ ] `sameSite` set to 'lax' or 'strict'
- [ ] Reasonable `maxAge` (7 days)
- [ ] Cookie domain correct

### XSS Prevention

Test with malicious inputs:

- [ ] URL parameters sanitized
- [ ] No direct HTML injection possible
- [ ] Script tags escaped in content
- [ ] External links use `rel="noopener"`

### Path Traversal Prevention

Try malicious file paths:

```
/api/claim-art?artId=../../../etc/passwd
/api/claim-art?artId=art_1&sizeId=../../secret
```

- [ ] Invalid paths rejected
- [ ] Only allowed files accessible
- [ ] Proper error handling

---

## Testing Checklist

### Quick Pre-Deployment Checklist

Before deploying to production:

**Build & Compile**
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All pages statically generated

**Functional**
- [ ] Gallery page loads
- [ ] Detail pages load for all 4 artworks
- [ ] Downloads work (tested with real files)
- [ ] Weekly limit enforces
- [ ] Cookie tracking works
- [ ] ZIP generation script works

**Performance**
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] No console errors
- [ ] Fast page loads

**Browser Compatibility**
- [ ] Tested on Chrome
- [ ] Tested on Safari
- [ ] Tested on Firefox
- [ ] Tested on mobile (iOS/Android)

**Security**
- [ ] Cookie flags correct
- [ ] No XSS vulnerabilities
- [ ] File access restricted
- [ ] HTTPS enforced in production

---

## Bug Reporting

### Bug Report Template

When you find an issue, document it:

```markdown
## Bug Description
Brief summary of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Screen Size: 1920x1080
- Device: Desktop

## Screenshots
[Attach screenshots if applicable]

## Console Errors
[Copy any console errors]

## Network Request
[Copy failed API request/response]
```

### Severity Levels

- **Critical**: Blocks core functionality (downloads don't work)
- **High**: Major feature broken (limit not enforcing)
- **Medium**: Minor feature issue (styling glitch)
- **Low**: Cosmetic issue (typo, minor alignment)

---

## Automated Testing (Future)

For future implementation:

### Unit Tests (Jest)
```bash
npm test
```

Test coverage for:
- Download tracking utilities
- Cookie parsing functions
- Validation functions

### E2E Tests (Playwright/Cypress)
```bash
npm run test:e2e
```

Test scenarios:
- Complete download flow
- Limit enforcement
- Error handling

### Visual Regression Tests
- Screenshot comparison
- Layout consistency
- Cross-browser rendering

---

## Testing Log Template

Keep a log of testing sessions:

```markdown
# Testing Session: 2025-11-24

## Tester: Your Name
## Environment: Chrome 120, macOS 14, Desktop

### Tests Completed
- [x] Gallery page display
- [x] Single size download
- [x] ZIP download
- [ ] Mobile testing (pending)

### Issues Found
1. [Medium] Download button text wraps on mobile
2. [Low] Toast notification too fast

### Notes
- All core functionality working
- Need to test on real iOS device
```

---

## Next Steps After Testing

1. **Document all issues found**
2. **Prioritize critical fixes**
3. **Retest after fixes**
4. **Get user acceptance**
5. **Deploy to production**

---

**Last Updated**: 2025-11-24
**Version**: 1.0
