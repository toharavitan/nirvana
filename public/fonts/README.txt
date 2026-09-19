Rector font (rector-regular)
============================

The image-section titles (.rector-title, defined in src/app/globals.css) use
the Rector display font — the same face as the original Sendero site.

Rector is a LICENSED COMMERCIAL font and is intentionally NOT included in this
repository. To render titles in Rector, place your licensed font files here:

    public/fonts/rector-regular.woff2   (preferred)
    public/fonts/rector-regular.woff    (fallback)

Once these files exist, the @font-face rule in globals.css loads them
automatically — no other change needed. Until then, titles fall back to a
generic serif.
