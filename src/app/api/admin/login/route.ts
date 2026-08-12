import { timingSafeEqual } from "crypto";
import { getSession } from "@/lib/session";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison to avoid leaking length via timing.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json(
      { error: "서버에 관리자 비밀번호가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !safeEqual(password, adminPassword)) {
    return Response.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  return Response.json({ ok: true });
}
