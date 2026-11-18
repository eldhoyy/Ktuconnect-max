# KeralaTimetable source integration

The authorized upstream repository is tracked here as a Git submodule so its
complete source tree, tools, datasets, HTML pages, scripts, PDFs and assets remain
available without flattening a separate static-site application into the
Next.js project root.

Upstream: https://github.com/KeralaTimetable/keralatimetable.github.io
Pinned revision: 9612b2a4238dfd31f0f136d9b56d552a0cb528dd

After cloning KTU Connect Max, initialize the source snapshot with:

```bash
git submodule update --init --recursive
```

This is a source/vendor integration point, not a claim that every upstream page
has already been ported into the native KTU Connect Max UI or deployed by Vercel.
The Next.js application should adapt features into its own components, APIs and
Supabase schema. Do not copy the upstream site's CNAME, hosting configuration,
secrets, database files or unrelated branding into the Next.js app.

The upstream repository currently contains roughly 364 tracked files and
approximately 107 MB of source/data/assets. The submodule keeps that history and
binary content intact without inflating the main repository's own Git object
store. Review updates before advancing the pinned revision.
