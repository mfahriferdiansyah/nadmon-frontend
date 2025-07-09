# 📱 Mobile Style Guide - Nadmon Frontend

## 🎯 Design Philosophy

This guide establishes consistent mobile-first design patterns for the Nadmon frontend, emphasizing **glass morphism aesthetics**, **compact sizing**, and **thumb-friendly interactions**.

## 🎨 Visual Design System

### Glass Morphism Theme

**Primary Glass Components:**
- Background: `backdrop-blur-sm bg-white/10`
- Borders: `border border-white/20`
- Hover States: `hover:bg-white/15`

**Token-Specific Glass Variants:**
- **MON Theme**: `bg-purple-500/20 border border-purple-400/30`
- **COOKIES Theme**: `bg-orange-500/20 border border-orange-400/30`
- **Success**: `bg-green-500/20 border border-green-400/30`
- **Warning**: `bg-amber-500/20 border border-amber-400/30`
- **Error**: `bg-red-500/20 border border-red-400/30`

### Color Palette

**Text Hierarchy:**
- Primary: `text-white` (100% opacity)
- Secondary: `text-white/90` (90% opacity)
- Tertiary: `text-white/70` (70% opacity)
- Disabled: `text-white/50` (50% opacity)

**Interactive States:**
- Default: `text-white/70`
- Hover: `text-white`
- Active: `text-white`
- Disabled: `text-white/50`

## 📏 Spacing & Sizing Standards

### Mobile-Optimized Dimensions

**Component Padding:**
- **Compact**: `px-2 py-1.5` (wallet components, small buttons)
- **Standard**: `px-2.5 py-2` (buy buttons, form elements)
- **Large**: `px-3 py-2.5` (primary actions)

**Gap Spacing:**
- **Tight**: `gap-1` (icon + text in compact components)
- **Standard**: `gap-1.5` (most mobile layouts)
- **Loose**: `gap-2` (desktop or spacious layouts)

### Icon Sizing Scale

**Mobile Icons:**
- **Micro**: `w-2 h-2` (pack pricing icons)
- **Small**: `w-3 h-3` (wallet icons, button icons)
- **Medium**: `w-4 h-4` (primary actions, disabled states)
- **Large**: `w-5 h-5` (pack rarity icons, category tabs)

### Typography Scale

**Mobile Font Sizes:**
- **Micro**: `text-xs` (11px) - Mobile buttons, compact info
- **Small**: `text-sm` (14px) - Standard mobile text
- **Base**: `text-base` (16px) - Headers, important content
- **Large**: `text-lg` (18px) - Major headers

## 🔘 Interactive Components

### Button Standards

**Primary Buy Buttons:**
```css
py-2 px-2.5 rounded-lg font-bold text-xs backdrop-blur-sm
gap-1.5 flex items-center justify-center
```

**Secondary Actions:**
```css
py-1.5 px-2 rounded font-medium text-xs backdrop-blur-sm
gap-1.5 flex items-center
```

**Disabled States:**
```css
cursor-not-allowed bg-white/10 text-white/50 border-white/20
```

### Touch Targets

**Minimum Touch Area:** 44px × 44px (iOS/Android accessibility)
**Recommended:** 48px × 48px for primary actions

### Loading States

**Loading Icons:** `w-3 h-3 animate-spin` for mobile
**Loading Text:** "Confirm..." / "Processing..." (shortened for mobile)

## 📦 Component Patterns

### Wallet Handler Mobile Pattern

```tsx
// Container
<div className="flex items-center gap-1.5">
  
  // Balance Display
  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/10 border border-white/20 backdrop-blur-sm min-w-[60px]">
    <Image className="w-3 h-3" />
    <span className="text-xs font-medium font-mono">
  
  // Wallet Address
  <button className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-sm">
```

### Shop Popup Buy Buttons

```tsx
// Button Grid
<div className="grid grid-cols-2 gap-2">
  
  // Individual Button
  <button className="py-2 px-2.5 rounded-lg font-bold text-xs backdrop-blur-sm gap-1.5 flex items-center justify-center bg-purple-500/20 border border-purple-400/30">
    <Image className="w-3 h-3" />
    <span>Price Token</span>
  </button>
</div>
```

### Pack Cards Mobile Layout

```tsx
// Grid Container
<div className="grid grid-cols-2 gap-1.5">
  
  // Individual Card
  <div className="bg-white/5 border rounded p-1.5 backdrop-blur-md">
    // Compact content with reduced spacing
  </div>
</div>
```

## 🎛️ Layout Guidelines

### Mobile Breakpoints

- **Mobile**: `< 640px` (primary target)
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Container Constraints

**Mobile Popup Max Width:** `max-w-lg` (512px)
**Mobile Popup Height:** `max-h-[95vh]` (optimized screen usage)

### Responsive Patterns

**Mobile-First Approach:**
1. Design for mobile (320px - 640px)
2. Enhance for tablet
3. Optimize for desktop

**Content Strategy:**
- Prioritize essential information
- Hide or collapse secondary content
- Use progressive disclosure

## 🚀 Performance Considerations

### CSS Optimizations

**Backdrop Blur:** Use `backdrop-blur-sm` instead of `backdrop-blur-lg` for mobile performance
**Transitions:** Keep animations under 300ms for mobile responsiveness
**GPU Acceleration:** Use `transform` and `opacity` for animations

### Bundle Size

**Icon Strategy:** Use single icon set (Lucide React)
**Image Optimization:** WebP format, appropriate sizing
**CSS Purging:** Remove unused Tailwind classes

## ✅ Accessibility Standards

### Mobile Accessibility

**Touch Targets:** Minimum 44px for all interactive elements
**Contrast Ratios:** Maintain WCAG AA standards
**Focus States:** Visible focus indicators
**Screen Readers:** Proper ARIA labels

### Color Accessibility

**Glass Components:** Ensure text contrast meets AA standards
**State Indicators:** Use color + shape/icon combinations
**Error States:** Clear visual and semantic indicators

## 🧪 Testing Guidelines

### Mobile Testing Checklist

- [ ] Touch targets meet minimum size requirements
- [ ] Glass morphism renders correctly on various devices
- [ ] Animations perform smoothly (60fps)
- [ ] Text remains readable on all backgrounds
- [ ] Components scale properly across screen sizes

### Device Testing

**Primary Targets:**
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- Samsung Galaxy S21 (384px)
- Standard Android (360px)

## 📝 Component Implementation Examples

### Mobile Shop Popup Buy Button

```tsx
<button
  className="py-2 px-2.5 rounded-lg font-bold text-xs backdrop-blur-sm gap-1.5 flex items-center justify-center bg-purple-500/20 text-white hover:bg-purple-500/30 border border-purple-400/30 hover:border-purple-400/50"
  disabled={isLoading}
>
  {isLoading ? (
    <Loader2 className="w-3 h-3 animate-spin" />
  ) : (
    <>
      <Image src="/token/mon.png" className="w-3 h-3" />
      {price} MON
    </>
  )}
</button>
```

### Mobile Wallet Handler

```tsx
<div className="flex items-center gap-1.5">
  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/10 border border-white/20 backdrop-blur-sm min-w-[60px]">
    <Image src="/token/cookies.png" className="w-3 h-3" />
    <span className="text-amber-100 text-xs font-mono">{balance}</span>
  </div>
</div>
```

---

## 🔄 Version History

**v1.0** - Initial mobile style guide
- Glass morphism design system
- Mobile-first component patterns
- Accessibility standards
- Performance guidelines

---

*This style guide ensures consistent, accessible, and performant mobile experiences across the Nadmon frontend application.*