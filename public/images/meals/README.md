# Meal photos

This folder holds the 27 JPEG photographs used in the "7-Day Meal Plans" section
(`src/content/meal-photos.ts` lists them). They are Pexels photographs (free
licence); each meal credits its photographer on the page.

If the `.jpg` files are missing — for example because a download only included
text files — the site still works: each photo falls back to the same image on
the Pexels CDN. To restore the local copies, run from the project root:

```bash
node scripts/fetch-meal-photos.mjs
```
