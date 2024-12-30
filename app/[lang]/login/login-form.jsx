"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Correo electrónico inválido").min(1, "El correo electrónico es requerido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
});

const isDevelopment = process.env.NODE_ENV === 'development';

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  useEffect(() => {
    if (loginSuccess) {
      console.log("Efecto de redirección activado");
      router.push("/dashboard");
    }
  }, [loginSuccess, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      if (isDevelopment) {
        console.log("Modo desarrollo: Simulando inicio de sesión exitoso");
        toast.success("Inicio de sesión simulado exitoso (Modo Desarrollo)");
        console.log("Redirigiendo al dashboard...");
        setLoginSuccess(true);
      } else {
        toast.error("Inicio de sesión deshabilitado en modo producción.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isDevelopment && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Modo Desarrollo</p>
          <p>El inicio de sesión está simulado. Cualquier credencial válida será aceptada.</p>
        </div>
      )}
      <div>
        <Label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Correo Electrónico
        </Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          className={cn({ "border-red-500": errors.email })}
          placeholder="tu@email.com"
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="block mb-2 font-medium text-gray-700">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className={cn({ "border-red-500": errors.password })}
            placeholder="Tu contraseña"
            disabled={isPending}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message || "La contraseña no cumple con los requisitos de seguridad"}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
};

export default LogInForm;
