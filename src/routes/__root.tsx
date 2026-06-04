import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { name: "description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Precision farming, carbon-neutral, uncompromised purity. Order your daily delivery today." },
      { name: "author", content: "Pure Drop Dairy Farms" },
      { name: "keywords", content: "pure drop dairy farms, fresh milk delivery, organic milk, farm to home, dairy farm, cow milk, buffalo milk, daily milk delivery" },
      { name: "theme-color", content: "#0B1F3A" },
      { property: "og:title", content: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { property: "og:description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Precision farming, carbon-neutral, uncompromised purity. Order your daily delivery today." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://puredrop-web.vercel.app" },
      { property: "og:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Pure Drop Dairy Farms — Fresh organic milk delivered from farm to home. Order your daily delivery today." },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: "Pure Drop Dairy Farms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@PureDropFarms" },
      { name: "twitter:creator", content: "@PureDropFarms" },
      { name: "twitter:title", content: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { name: "twitter:description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Order your daily delivery today." },
      { name: "twitter:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
      { name: "twitter:image:alt", content: "Pure Drop Dairy Farms — Fresh organic milk delivered from farm to home" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..600;1,400..600&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
