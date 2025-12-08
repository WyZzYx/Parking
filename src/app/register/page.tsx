import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
