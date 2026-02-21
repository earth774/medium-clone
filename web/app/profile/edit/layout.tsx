import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile — Medium",
  description: "Edit your profile and change password",
};

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
