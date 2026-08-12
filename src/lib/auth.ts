import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireAdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminApi() {
  const session = await getSession();
  if (!session.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
