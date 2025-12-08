import ProfileClient from "@/components/ProfileClient";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return <ProfileClient session={session} />;
}
