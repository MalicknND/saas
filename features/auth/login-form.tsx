"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

const EMAIL_NOT_CONFIRMED_MESSAGE =
  "Vérifiez votre email avant de vous connecter. Consultez votre boîte de réception (et les spams).";

export function LoginForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true); // Inscription par défaut
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Le nom complet est requis");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSignUpEmail(email);
    setSignUpSuccess(true);
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signUpEmail,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      const msg =
        error.message?.toLowerCase().includes("email") &&
        error.message?.toLowerCase().includes("confirm")
          ? EMAIL_NOT_CONFIRMED_MESSAGE
          : error.message;
      setError(msg);
      return;
    }
    router.refresh();
  };

  if (signUpSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailCheck className="size-5" /> Vérifiez votre email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Un lien de confirmation a été envoyé à{" "}
            <strong>{signUpEmail}</strong>. Cliquez dessus pour activer votre
            compte, puis revenez pour vous connecter.
          </p>
          <p className="text-xs text-muted-foreground">
            Vous ne voyez pas l&apos;email ? Vérifiez vos spams.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={handleResendEmail}
            >
              Renvoyer l&apos;email de confirmation
            </Button>
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={() => {
                setSignUpSuccess(false);
                setError(null);
                setIsSignUp(false);
              }}
            >
              Aller à la connexion
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSignUp ? "Inscription" : "Connexion"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            isSignUp ? handleSignUp(e) : handleSignIn(e);
          }}
        >
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Marie Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={isSignUp ? "6 caractères minimum" : undefined}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          {isSignUp ? (
            <>
              Déjà un compte ?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
              >
                Créer un compte
              </button>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
