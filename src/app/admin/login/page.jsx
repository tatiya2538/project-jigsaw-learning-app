import AdminLoginForm from "../../../components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Buddhist Learning Card",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
