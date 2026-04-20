import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase.from("activities").select("id");
  return (data ?? []).map((activity) => ({ id: activity.id }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const supabase = createClient();
  const { data: activity } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (!activity) {
    return { title: "Not Found" };
  }

  return {
    title: activity.title,
    description: activity.summary,
  };
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const supabase = createClient();
  const { data: activity, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !activity) {
    notFound();
  }

  const createdDate = new Date(activity.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="w-full bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로 가기
        </Link>

        {/* Header Image */}
        {activity.image_url ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-8 bg-zinc-900">
            <img
              src={activity.image_url}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-black mb-8 flex items-center justify-center">
            <p className="text-white/20">No image</p>
          </div>
        )}

        {/* Category Badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-sm font-semibold text-white rounded-full border border-white/20">
            {activity.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          {activity.title}
        </h1>

        {/* Meta Info */}
        <p className="text-white/50 text-sm mb-8">
          {createdDate}
        </p>

        {/* Tags */}
        {activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {activity.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/5 text-white/70 text-sm rounded border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-12" />

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-lg">
            {activity.content}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-12" />

        {/* Footer CTA */}
        <div className="text-center py-12">
          <p className="text-white/60 mb-6">더 많은 활동을 보고 싶으신가요?</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors"
          >
            모든 활동 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
