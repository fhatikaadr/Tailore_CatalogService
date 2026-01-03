# 🎨 Tailoré Frontend - Design Showcase

## UI Design Philosophy

### Theme: **BOLD BLACK PINK WHITE**
Inspired by high-fashion editorial design with a modern, edgy twist. The design prioritizes:
- **High contrast** for maximum readability
- **Bold typography** for strong visual hierarchy  
- **Sharp edges** for contemporary, minimal aesthetic
- **Pink accents** for energy and brand identity
- **Retro shadows** for depth and personality

---

## Color Palette

```
PRIMARY COLORS:
├─ Black    : #000000 (Backgrounds, borders, text)
├─ White    : #ffffff (Cards, backgrounds, text)
└─ Pink Neon: #ff477e (Accents, CTAs, highlights)

SECONDARY COLORS:
├─ Pink Soft: #ffeef2 (Subtle backgrounds, alternating rows)
├─ Gray     : #f4f4f4 (Page background)
└─ Pink Dark: #cc0033 (Hover states, warnings)
```

---

## Typography

**Font Family:** Inter (Google Fonts)
- **Regular (400)**: Body text, descriptions
- **Semibold (600)**: Labels, meta info
- **Extra Bold (800)**: Headings, buttons, emphasis

**Text Styles:**
- ALL CAPS for emphasis and hierarchy
- Letter spacing (1-3px) for readability
- High font weights for bold statements

---

## Component Library

### 1. Header
```
╔══════════════════════════════════════════════════════════╗
║  TAILORÉ.                        USER NAME    [LOGOUT]   ║
╚══════════════════════════════════════════════════════════╝
```
- Sticky navigation
- Black background
- Pink underline accent
- User info and auth buttons

### 2. Tabs
```
┌─────────┬─────────┐
│ CATALOG │INVENTORY│
└─────────┴─────────┘
```
- Active tab: black background, pink text
- Inactive: white background, black text
- No rounded corners (sharp edges)

### 3. Product Card
```
╔════════════════════════╗
║        👔              ║ ← Icon placeholder
╠════════════════════════╣
║ SANDRO                 ║ ← Brand (pink)
║ ASYMMETRIC DRESS       ║ ← Name (bold)
║ [M] [BLACK] [LOW STOCK]║ ← Badges
║ IDR 4,000,000          ║ ← Price (large)
║ STOCK: 8 AVAILABLE     ║ ← Stock info
║ ┌──────────────────┐   ║
║ │  VIEW DETAILS    │   ║ ← Button
║ └──────────────────┘   ║
╚════════════════════════╝
  ▓▓▓▓▓▓▓▓ ← Hard shadow
```

### 4. Search & Filters
```
┌─────────────────────────────────────────────────────┐
│ [Search input.............] [Brand▼] [Category▼]   │
│ [Color▼]                                            │
│                                                     │
│ [APPLY FILTERS]     [RESET]                        │
└─────────────────────────────────────────────────────┘
```

### 5. Modal
```
                ┌──────────────────────┐
                │ PRODUCT DETAILS    [×]│
                ├──────────────────────┤
                │                      │
                │  [Product info...]   │
                │                      │
                │  [Price, stock...]   │
                │                      │
                └──────────────────────┘
                  ▓▓▓▓▓▓▓▓▓▓▓
```

### 6. Buttons
```
Primary:
┌────────────────┐
│  CHECKOUT NOW  │  ← Black bg, white text
└────────────────┘
     Hover: Pink bg

Secondary:
┌────────────────┐
│     RESET      │  ← White bg, black text, black border
└────────────────┘
     Hover: Pink soft bg
```

### 7. Table
```
╔═══════════════════════════════════════════════════════╗
║ PRODUCT │ BRAND │ SIZE │ QTY │ AVAILABLE │ ACTION   ║ ← Black header
╠═══════════════════════════════════════════════════════╣
║ Dress   │ Zara  │  M   │ 50  │    45     │ [ADJUST] ║ ← White row
╠───────────────────────────────────────────────────────╣
║ Blouse  │ H&M   │  S   │ 30  │    28     │ [ADJUST] ║ ← Pink soft row
╚═══════════════════════════════════════════════════════╝
```

### 8. Statistics Cards
```
╔════════════════╗  ╔════════════════╗  ╔════════════════╗
║ TOTAL PRODUCTS ║  ║   LOW STOCK    ║  ║ OUT OF STOCK   ║
║ ──────────────║  ║ ────────────── ║  ║ ────────────── ║
║      156       ║  ║       23       ║  ║       12       ║
╚════════════════╝  ╚════════════════╝  ╚════════════════╝
```
- Black background
- White text with pink labels
- Hard shadows

---

## Interaction Design

### Hover States
- **Buttons**: Black → Pink, lift up 2-4px
- **Cards**: Lift up 4px, increase shadow
- **Links**: Underline, color change

### Focus States
- Input fields: Pink border, pink soft background
- Buttons: Pink background

### Loading States
- Text: "LOADING..." with animated dots
- Centered, bold, uppercase

### Error States
- Alert box: Pink soft background, dark pink text
- Border: 2px solid black

### Success States
- Alert box: Light green background, green text
- Border: 2px solid black

---

## Layout Structure

### Desktop Grid
```
┌─────────────────────────────────────────────────────┐
│                    HEADER                           │
├─────────────────────────────────────────────────────┤
│  TABS: [CATALOG] [INVENTORY]                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ Product │ │ Product │ │ Product │ │ Product │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ Product │ │ Product │ │ Product │ │ Product │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                     │
│           [PREV] [1] [2] [3] [NEXT]               │
└─────────────────────────────────────────────────────┘
```

### Mobile Stack
```
┌──────────────┐
│    HEADER    │
├──────────────┤
│ TABS         │
├──────────────┤
│ Filters      │
│ (stacked)    │
├──────────────┤
│ Product 1    │
├──────────────┤
│ Product 2    │
├──────────────┤
│ Product 3    │
├──────────────┤
│ Pagination   │
└──────────────┘
```

---

## Accessibility Features

- ✅ High contrast ratios (WCAG AA compliant)
- ✅ Clear focus indicators
- ✅ Readable font sizes (min 14px)
- ✅ Descriptive button labels
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Alt text for images (when implemented)

---

## Responsive Breakpoints

```css
/* Mobile First */
Default: 320px - 767px (mobile)
Tablet:  768px - 1023px (adjust grid to 2-3 columns)
Desktop: 1024px+ (full 4-column grid)
```

---

## Animation & Transitions

### Smooth Transitions (0.2s)
- Background color changes
- Border color changes
- Transform (lift/move)
- Shadow changes

### No Transitions
- Opacity (instant)
- Display properties
- Layout changes

---

## Brand Guidelines

### Do's ✅
- Use UPPERCASE for emphasis
- Maintain high contrast
- Keep sharp edges (no border radius)
- Use hard shadows (6-8px)
- Bold typography everywhere
- Pink accents sparingly
- Letter spacing for headers

### Don'ts ❌
- No rounded corners (except where necessary)
- No gradients (solid colors only)
- No light gray text (high contrast only)
- No mixed case in buttons/headers
- No subtle shadows (go bold!)
- No more than 3 colors per component

---

## Performance Optimizations

- ✅ Minimal external dependencies (Google Fonts only)
- ✅ Inline critical CSS
- ✅ Optimized grid layouts
- ✅ Lazy loading considerations
- ✅ Efficient DOM updates
- ✅ Debounced search inputs

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not officially supported)

---

## Design Inspirations

- **Fashion Editorial**: Vogue, Harper's Bazaar
- **E-commerce**: ASOS, Farfetch
- **Brutalism**: Raw, honest design
- **Swiss Style**: Grid-based, minimalist
- **Y2K Aesthetic**: Bold colors, hard edges

---

**Design System Complete! Ready for implementation and scaling. 🎨**
