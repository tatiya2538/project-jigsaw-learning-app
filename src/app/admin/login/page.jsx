import AdminLoginForm from "../../../components/admin/AdminLoginForm";

import { SITE_NAME } from "../../../lib/config";

export const metadata = {
  title: `Admin Login | ${SITE_NAME}`,
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
