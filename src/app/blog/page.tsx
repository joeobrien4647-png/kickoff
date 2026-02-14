import { TripBlog } from "@/components/blog/trip-blog";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Trip Blog</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Auto-generated from your journal entries, photos, and experiences.
        </p>
      </section>
      <TripBlog />
    </div>
  );
}
