# Shadcn UI Layout Components cho E-commerce

## Components đã được triển khai:

### 1. **Card Component** (`card.jsx`)
- Sử dụng cho product cards
- Bao gồm: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Style: Border, shadow, rounded corners
- Hover effect: Shadow tăng khi hover

### 2. **Button Component** (`button.jsx`)
- Variants:
  - `default`: Primary button (Add to cart)
  - `destructive`: Danger button (Wishlist)
  - `outline`: Outlined button (Variants selector)
  - `secondary`, `ghost`, `link`: Các variants khác
- Sizes: `default`, `sm`, `lg`, `icon`
- Icons support với proper spacing

### 3. **Badge Component** (`badge.jsx`)
- Hiển thị tags và labels
- Variants: `default`, `secondary`, `destructive`, `outline`
- Sử dụng cho: Brand tags, Featured badge, Trending badge

### 4. **Input Component** (`input.jsx`)
- Form input với consistent styling
- Focus states với ring effect
- Disabled states
- Sử dụng cho: Quantity input

### 5. **Pagination Component** (`pagination.jsx`)
- Components: Pagination, PaginationContent, PaginationItem, PaginationLink
- PaginationPrevious, PaginationNext với text tiếng Việt
- Active state cho current page
- Disabled state cho first/last page

### 6. **Skeleton Component** (`skeleton.jsx`)
- Loading state animations
- ProductCardSkeleton: Skeleton cho product card
- CategorySkeleton: Skeleton cho category items

## Cải tiến so với Bootstrap:

### Design:
- ✅ Modern, clean design với Tailwind
- ✅ Smooth transitions và animations
- ✅ Better hover effects
- ✅ Consistent spacing system
- ✅ Better color scheme với semantic colors

### UX:
- ✅ Color picker với ring effect khi selected
- ✅ Size buttons với active state rõ ràng
- ✅ Wishlist button ở góc card dễ thấy hơn
- ✅ Skeleton loading thay vì loading gif
- ✅ Image zoom on hover
- ✅ Smooth page transitions

### Accessibility:
- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Focus states rõ ràng
- ✅ Semantic HTML

### Performance:
- ✅ Không phụ thuộc Bootstrap JavaScript
- ✅ Lighter bundle size
- ✅ CSS-only animations
- ✅ Better tree-shaking với modular components

## Layout Structure:

```
Products Page
├── Hero Section
│   ├── Heading
│   └── Description
├── Featured Categories
│   └── Grid of category cards (rounded, hover effect)
├── Featured Products
│   └── Grid (1-2-3 columns responsive)
│       └── Product Cards
│           ├── Image with zoom effect
│           ├── Wishlist button (top-left)
│           ├── Featured badge (top-right)
│           ├── Product info
│           │   ├── Vendor link
│           │   ├── Product title
│           │   ├── Brand badge
│           │   └── Price
│           └── Actions
│               ├── Variants selector (expandable)
│               │   ├── Quantity input
│               │   ├── Size buttons
│               │   ├── Color picker
│               │   └── Add to cart button
│               └── Simple add to cart (no variants)
├── Pagination
│   ├── Previous/Next buttons
│   ├── Page numbers
│   └── Page info
├── Trending Products Section
│   └── Same grid layout
└── Loading State
    └── Skeleton cards grid
```

## Color System:

- **Primary**: Product prices, links, buttons
- **Destructive**: Wishlist, featured badges
- **Secondary**: Brand badges
- **Muted**: Vendor info, descriptions
- **Background**: Card backgrounds

## Responsive Breakpoints:

- Mobile: 1 column
- Tablet: 2 columns (md)
- Desktop: 3 columns (lg)

## Future Enhancements:

1. **Dialog Component**: Quick view modal
2. **Toast Component**: Add to cart notifications
3. **Select Component**: Sort/filter dropdowns
4. **Accordion Component**: Filter sidebar
5. **Tabs Component**: Product tabs
6. **Slider Component**: Price range filter
7. **Hover Card**: Product quick preview
