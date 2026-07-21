import AdminDashboard from "../../components/admin/AdminDashboard";

import { listCharacterEntries } from "../../lib/catalog";
import { SITE_NAME } from "../../lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Admin | ${SITE_NAME}`,
};

export default async function AdminPage() {
  const list = await listCharacterEntries();

  return (
    <main className="min-h-screen">
      <AdminDashboard characters={list} />
    </main>
  );
}
