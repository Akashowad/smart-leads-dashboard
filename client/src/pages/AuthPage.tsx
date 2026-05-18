import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";
import { Button, FieldError, Input } from "../components/ui";

interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormValues>();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (values: AuthFormValues) => {
    setLoading(true);
    setError("");
    try {
      if (mode === "login") await login(values.email, values.password);
      else await registerUser(values);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-ink dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">Smart Leads Dashboard</h1>
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
            Manage sales leads with secure authentication, filtered pipeline views, CSV exports, and role-aware controls.
          </p>
        </section>
        <form className="rounded-md border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5 flex rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            {(["login", "register"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`h-10 flex-1 rounded-md text-sm font-semibold capitalize ${mode === item ? "bg-white shadow-sm dark:bg-slate-950" : "text-slate-500"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-4">
            {mode === "register" ? (
              <label className="text-sm font-medium">
                Name
                <Input {...register("name", { required: mode === "register" ? "Name is required" : false })} />
                <FieldError message={errors.name?.message} />
              </label>
            ) : null}
            <label className="text-sm font-medium">
              Email
              <Input type="email" {...register("email", { required: "Email is required" })} />
              <FieldError message={errors.email?.message} />
            </label>
            <label className="text-sm font-medium">
              Password
              <Input type="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" } })} />
              <FieldError message={errors.password?.message} />
            </label>
            {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-100">{error}</div> : null}
            <Button disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
