# UIjar 2.5 Component Registry

This project uses **UIjar 2.5** as its component registry instead of building UI components from scratch. UIjar is built on top of the shadcn CLI tooling and provides pre-styled, accessible components.

---

## Quick Reference

| Item | Value |
|------|-------|
| Registry URL | `https://ui-jar-v-2-5.vercel.app/r/{name}.json` |
| Install command | `npx shadcn@latest add @uijar/ui-component-name` |
| Config file | `components.json` |
| Components dir | `src/components/ui/` |
| Utility function | `cn()` from `@/lib/utils` |
| Style preset | `new-york` |

---

## Installing Components

Use the shadcn CLI with the `@uijar/` prefix to install from the registry:

```bash
# Install a single component
npx shadcn@latest add @uijar/ui-jar-button

# Install multiple components
npx shadcn@latest add @uijar/ui-jar-badge @uijar/ui-jar-card @uijar/ui-jar-input
```

Components are installed into `src/components/ui/` and can be imported like:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
```

---

## Currently Installed Components

These components are already installed and available in `src/components/ui/`:

- **alert** - Alert messages and notifications
- **badge** - Status badges and labels
- **button** - Primary interactive button with variants
- **card** - Card container with Header, Title, Description, Content, Footer
- **dialog** - Modal dialog overlay
- **input** - Text input field
- **label** - Form field label
- **progress** - Progress bar
- **radio-group** - Radio button group
- **separator** - Visual divider
- **tabs** - Tabbed navigation
- **tooltip** - Hover tooltip

---

## Available Components (Not Yet Installed)

These can be installed from the UIjar registry as needed:

- `ui-jar-textarea` - Multi-line text input
- `ui-jar-switch` - Toggle switch
- `ui-jar-checkbox` - Checkbox input
- `ui-jar-skeleton` - Loading skeleton placeholder
- `ui-jar-accordion` - Collapsible accordion
- `ui-jar-avatar` - User avatar

---

## Registry Configuration

The registry is configured in `components.json` at the project root:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@uijar": "https://ui-jar-v-2-5.vercel.app/r/{name}.json"
  }
}
```

The key part is the `registries` block that maps `@uijar` to the registry URL.

---

## Styling System

### CSS Variables (HSL)

All theme colors are defined as CSS variables in `src/app/globals.css` using HSL values. Components reference these via Tailwind utilities:

```css
/* Example variables (light mode) */
--background: 0 0% 100%;
--foreground: 222 47% 11%;
--primary: 221 83% 53%;        /* Blue */
--secondary: 210 40% 96%;
--muted: 210 40% 96%;
--destructive: 0 84% 60%;
--border: 214 32% 91%;
--ring: 221 83% 53%;
--radius: 0.75rem;
```

### Tailwind Integration

Colors are mapped in `tailwind.config.ts` using the CSS variables:

```ts
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... etc
}
```

### The `cn()` Utility

All components use `cn()` from `@/lib/utils` for intelligent class merging:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This prevents Tailwind class conflicts when overriding component styles.

---

## Component Patterns

### Button Variants

```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

{/* Sizes */}
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconHere /></Button>

{/* As child (renders as another element) */}
<Button asChild>
  <Link href="/somewhere">Navigate</Link>
</Button>
```

### Card Compound Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge Variants

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Form Inputs

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

---

## Key Dependencies

These are required by the UIjar components:

```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-progress": "^1.1.8",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-separator": "^1.1.8",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-tooltip": "^1.2.8",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0"
}
```

New component installations may add additional Radix UI primitives automatically.

---

## Rules for Claude

1. **Always use UIjar components** from `@/components/ui/` instead of writing raw HTML for buttons, cards, inputs, badges, etc.
2. **Install missing components** with `npx shadcn@latest add @uijar/ui-jar-component-name` before using them.
3. **Use `cn()`** when combining or overriding class names on UIjar components.
4. **Use the existing color tokens** (`text-primary`, `bg-primary`, `text-muted-foreground`, `border`, etc.) — don't hardcode hex or HSL values.
5. **Don't use Lucide icons directly** — if icons are needed, check what's available in the project first.
6. **Components support `className` overrides** — pass additional Tailwind classes to customize appearance.
7. **Use `asChild` on Button** when wrapping Next.js `<Link>` or other elements that need to be the rendered element.
