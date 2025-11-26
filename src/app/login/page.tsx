import { AuthForm } from './auth-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <AuthForm mode="login" />
    </div>
  );
}
