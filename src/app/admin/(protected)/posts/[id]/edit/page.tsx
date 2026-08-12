import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostForm } from "../../post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">글 수정</h1>
      <PostForm mode="edit" postId={post.id} initial={post} />
    </div>
  );
}
