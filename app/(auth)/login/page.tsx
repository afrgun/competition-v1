import { LoginForm } from "@/presentation/components/molecules/LoginForm";
import { AuthLayout } from "@/presentation/layouts";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
