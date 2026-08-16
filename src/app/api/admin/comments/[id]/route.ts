import { requireAdminApi } from "@/lib/auth";
import { deleteComment } from "@/lib/comments";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteComment(id);

  return Response.json({ ok: true });
}
