# Blog Management Guide — KirovAds

## How the Blog Works

All blog posts are managed through two places:
1. **`blog/posts.json`** — the index of all posts (metadata only)
2. **`blog/posts/`** — individual HTML files with full post content

The homepage (`index.html`) and blog index (`blog/index.html`) automatically load and display posts from `posts.json`.

---

## Adding a New Blog Post

### Step 1: Add entry to `blog/posts.json`

Open `blog/posts.json` and add a new object to the array. Copy this template:

```json
{
  "slug": "your-post-url-slug",
  "title": "Your Post Title in English",
  "title_bg": "Заглавие на публикацията на български",
  "excerpt": "Short summary in English (2-3 sentences). Shown in listings.",
  "excerpt_bg": "Кратко резюме на български (2-3 изречения). Показва се в списъците.",
  "category": "Category Name",
  "date": "2025-06-01",
  "readTime": "6 min read",
  "published": true,
  "author": "Geno Kirov",
  "image": null
}
```

**Important:**
- `slug` must match the HTML filename (e.g. `"my-new-post"` → `blog/posts/my-new-post.html`)
- `published: false` hides the post from all listings without deleting it
- `image: null` shows the placeholder. Replace with `"../assets/images/blog/your-image.jpg"` when you have an image
- Add new posts at the **top** of the array so newest appear first

---

### Step 2: Create the post HTML file

Copy `blog/post.html` (the template) to `blog/posts/your-post-url-slug.html`.

Then replace all the placeholder text:
- `POST TITLE HERE` → your actual title
- `POST META DESCRIPTION HERE` → 150-160 character description for Google
- `POST-SLUG-HERE` → your slug
- `YYYY-MM-DD` → publish date
- `CATEGORY HERE` → category (matches posts.json)
- `DATE HERE` → human-readable date (e.g. "June 1, 2025")
- `READ TIME HERE` → estimated read time (e.g. "6 min read")
- The article body content sections

---

### Step 3: Add the Bulgarian translation (optional)

In the post HTML, you can add `data-bg="..."` attributes to the main heading and intro paragraphs. For the blog listing, the Bulgarian title and excerpt come from `posts.json` — the `title_bg` and `excerpt_bg` fields.

---

## Available Categories

Keep categories consistent for filtering. Suggested categories:
- `Meta Ads`
- `Google Ads`
- `Tracking & Analytics`
- `AI Marketing`
- `Marketing Strategy`
- `CRO & A/B Testing`
- `ROAS & Performance`
- `Business Growth`

---

## Adding Images

1. Place post images in `assets/images/blog/`
2. Recommended size: **1200 × 630px** (also works as OG image)
3. Format: JPG or WebP
4. In `posts.json`, change `"image": null` to `"image": "../assets/images/blog/your-image.jpg"`
5. In the post HTML, replace the `img-placeholder` div with:

```html
<img src="../../assets/images/blog/your-image.jpg"
     alt="Descriptive alt text"
     style="width:100%;border-radius:var(--radius-md);margin-bottom:2.5rem">
```

---

## Hiding / Unpublishing a Post

Set `"published": false` in `posts.json`. The post HTML file remains but won't appear in listings.

---

## GTM Events

The blog automatically fires these GTM events:
- `blog_click` — when a user clicks to read a post (includes post slug and location)
- `cta_click` — when any CTA button is clicked (includes location and label)

These events are already set up. No action needed when adding new posts.

---

## File Checklist for New Post

- [ ] Entry added to `blog/posts.json`
- [ ] `blog/posts/[slug].html` created from template
- [ ] Title, description, canonical URL updated in HTML
- [ ] Schema JSON-LD updated with correct date and details
- [ ] Post content written
- [ ] Image added (or placeholder left)
- [ ] Bulgarian translation added (optional but recommended)
