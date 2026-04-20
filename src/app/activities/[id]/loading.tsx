export default function Loading() {
  return (
    <main className="w-full bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button Skeleton */}
        <div className="h-6 w-24 bg-white/10 rounded mb-8 animate-pulse" />

        {/* Image Skeleton */}
        <div className="w-full aspect-video rounded-lg bg-white/10 mb-8 animate-pulse" />

        {/* Badge Skeleton */}
        <div className="h-8 w-32 bg-white/10 rounded-full mb-6 animate-pulse" />

        {/* Title Skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-12 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="h-12 bg-white/10 rounded w-2/3 animate-pulse" />
        </div>

        {/* Meta Skeleton */}
        <div className="h-5 w-40 bg-white/10 rounded mb-8 animate-pulse" />

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-12">
          <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-12" />

        {/* Content Skeleton */}
        <div className="space-y-4 mb-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-white/10 rounded animate-pulse"
              style={{ width: i === 5 ? "60%" : "100%" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
