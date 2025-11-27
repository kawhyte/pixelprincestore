# Troubleshooting: Product Not Showing

## 🔍 Debug Checklist

### Step 1: Check Product Status in Sanity Studio

1. Go to `http://localhost:3000/studio`
2. Click on your product
3. Look at the top-right corner

**✅ Should say:** "Published" with a green dot
**❌ If it says:** "Draft" or "Changes since last publish"

**Solution:** Click the **"Publish"** button in the bottom-right corner

---

### Step 2: Use the Debug Endpoint

Visit: `http://localhost:3000/api/debug-sanity`

**Expected Response (if working):**
```json
{
  "success": true,
  "productCount": 1,
  "products": [
    {
      "id": "your-product-slug",
      "title": "Your Product Title",
      "hasPreviewImage": true,
      "sizesCount": 4
    }
  ]
}
```

**If productCount is 0:**
- Product is not published (only a draft)
- Product is in wrong dataset
- GROQ query has an issue

---

### Step 3: Check Browser Console

1. Open `http://localhost:3000/free-downloads`
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for errors (red text)

**Common errors:**
- `Failed to fetch` - Network issue
- `Invalid environment variable` - .env.local problem
- `404` - Product not found

---

### Step 4: Force Refresh the Page

The page uses ISR (Incremental Static Regeneration) with 60-second cache:

**Option A:** Wait 60 seconds and refresh
**Option B:** Force clear cache:
1. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or restart your dev server

---

### Step 5: Check the Server Terminal

Look at your terminal where `npm run dev` is running.

**Look for:**
- Build errors
- TypeScript errors
- Sanity connection errors

**If you see errors**, they'll tell you exactly what's wrong.

---

## 📋 Complete Diagnostic

Run through this checklist:

- [ ] ✅ Dev server is running (`npm run dev`)
- [ ] ✅ Product created in Sanity Studio
- [ ] ✅ Product is **PUBLISHED** (not draft)
- [ ] ✅ Product has a preview image
- [ ] ✅ Product has at least one size
- [ ] ✅ Product has `allSizesZip` field filled
- [ ] ✅ Slug was generated (click "Generate" button)
- [ ] ✅ Environment variables in `.env.local` are correct
- [ ] ✅ Waited 60 seconds or restarted dev server
- [ ] ✅ Checked debug endpoint (`/api/debug-sanity`)
- [ ] ✅ No errors in browser console
- [ ] ✅ No errors in server terminal

---

## 🔧 Common Fixes

### Fix 1: Publish the Product

The #1 most common issue!

1. Go to Studio: `http://localhost:3000/studio`
2. Click your product
3. Click **"Publish"** button (bottom right)
4. Wait 60 seconds
5. Refresh `/free-downloads`

### Fix 2: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Fix 3: Check Image Upload

If the image didn't upload properly:

1. In Sanity Studio, click the product
2. Click the preview image field
3. Re-upload the image
4. Click "Publish"

### Fix 4: Verify Slug

The slug must be generated:

1. In Sanity Studio, open your product
2. Look at the "Slug" field
3. If empty, click **"Generate"** next to it
4. Should show: `current: "your-title"` with a green checkmark
5. Click "Publish"

### Fix 5: Check Required Fields

All required fields must be filled:

**Required:**
- Title ✅
- Slug ✅
- Artist ✅
- Description ✅
- Preview Image ✅
- At least 1 size ✅
- allSizesZip ✅

---

## 🐛 Still Not Working?

### Test with GROQ in Vision

1. Go to `http://localhost:3000/studio/vision`
2. Paste this query:
   ```groq
   *[_type == "product"] {
     title,
     slug,
     _id,
     "status": select(
       !defined(_id) => "not saved",
       defined(_id) && defined(_originalId) => "draft",
       "published"
     )
   }
   ```
3. Click "Execute"

**What you should see:**
```json
[
  {
    "title": "Your Product",
    "slug": { "current": "your-product" },
    "_id": "...",
    "status": "published"
  }
]
```

**If status is "draft":**
- Your product is not published
- Go back and click "Publish"

**If you see nothing:**
- Product wasn't saved
- Wrong dataset selected

---

## 📊 Understanding the Data Flow

```
Sanity Studio (Create)
    ↓ (Save Draft)
Sanity Studio (Publish)
    ↓
Sanity Content Lake (Published)
    ↓
Next.js fetches via getAllProducts()
    ↓
/free-downloads page shows product
```

**Key:** The product must be **PUBLISHED**, not just saved!

---

## 🆘 Getting More Help

If still stuck, check:

1. **Debug endpoint output:**
   ```
   http://localhost:3000/api/debug-sanity
   ```

2. **Sanity project dashboard:**
   ```
   https://www.sanity.io/manage/personal/project/hwfffekz
   ```

3. **Check if dataset is correct:**
   - Studio might be using "production"
   - .env.local might be using different dataset

---

## ✅ Success Indicators

You know it's working when:

- Debug endpoint shows `"productCount": 1` (or more)
- Product appears on `/free-downloads` page
- Clicking product goes to detail page
- Images load correctly
- No console errors

---

**Most Common Issue:** 🎯 **Forgetting to click "Publish"** in Sanity Studio!

Always click **Publish** after making changes!
