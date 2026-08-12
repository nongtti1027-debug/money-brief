import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">새 글 작성</h1>
      <PostForm mode="create" />
    </div>
  );
}
