import { AuthForm } from '../login/auth-form';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <AuthForm mode="signup" />
    </div>
  );
}
