import AdminDashboard from "../../components/admin/AdminDashboard";

import {
  listCharacterEntries,
  listGameEntries,
} from "../../lib/catalog";
import { SITE_NAME } from "../../lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Admin | ${SITE_NAME}`,
};

export default async function AdminPage() {
  const [characters, games] = await Promise.all([
    listCharacterEntries(),
    listGameEntries(),
  ]);

  return (
    <main className="min-h-screen">
      <AdminDashboard characters={characters} games={games} />
    </main>
  );
}
