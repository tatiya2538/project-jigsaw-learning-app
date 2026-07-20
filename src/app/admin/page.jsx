import AdminDashboard from "../../components/admin/AdminDashboard";

import { characters } from "../../data/characters";

export const metadata = {
  title: "Admin | Buddhist Learning Card",
};

export default function AdminPage() {
  const list = Object.values(characters).map((character) => ({
    slug: character.slug,
    label: character.label,
  }));

  return (
    <main className="min-h-screen">
      <AdminDashboard characters={list} />
    </main>
  );
}
