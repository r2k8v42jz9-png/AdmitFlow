# Ambient atmosphere assets

Subtle, text-free background washes generated with Higgsfield (`nano_banana_pro`),
upscaled to 2K (bytedance) and exported to WebP. Apple/Stripe (light) and Linear
(dark) restraint. **Not yet integrated** into any component.

## Files

| File | Dimensions | Source job |
|------|-----------|------------|
| `hero/hero-light.webp` | 2560×1434 | `5f21f8bb` (H2 light) → upscale `896835e6` |
| `hero/hero-dark.webp` | 2560×1434 | `1c98d40d` (H2 dark v2) → upscale `e209bd9c` |
| `hero/hero-poster.webp` | 1280×717 | derived from H2 light (LCP / reduced-motion / future H1 video poster) |
| `dashboard/dashboard-light.webp` | 2560×1434 | `5e509763` (D3 light) → upscale `6c91e971` |
| `dashboard/dashboard-dark.webp` | 2560×1434 | `767537aa` (D3 dark) → upscale `8d902d38` |
| `dashboard/dashboard-poster.webp` | 1280×717 | derived from D3 light (fast paint placeholder) |

## Usage (when approved for integration)

- Theme-aware `<picture>`: serve `*-light.webp` in light mode, `*-dark.webp` in `.dark`.
- `*-poster.webp` = lightweight static fallback for `prefers-reduced-motion` and the
  future H1 hero `<video poster>` attribute.
- Hero atmosphere sits **behind** the constellation + headline (`-z` layer); dashboard
  wash sits behind cards at very low opacity — must not reduce text legibility.
