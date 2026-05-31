"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSignUpFailureStatus } from "./sign-up-errors";

function authRedirect(path: "/auth/sign-in" | "/auth/sign-up", status: string) {
  redirect(`${path}?status=${encodeURIComponent(status)}`);
}

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(formData: FormData) {
  const next = readRequiredString(formData, "next");

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/app";
  }

  return next;
}

export async function signInAction(formData: FormData) {
  if (!getSupabaseBrowserConfig()) {
    authRedirect("/auth/sign-in", "missing-config");
  }

  const email = readRequiredString(formData, "email");
  const password = readRequiredString(formData, "password");

  if (!email || !password) {
    authRedirect("/auth/sign-in", "missing-fields");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect("/auth/sign-in", "invalid-credentials");
  }

  redirect(safeNextPath(formData));
}

export async function signUpAction(formData: FormData) {
  if (!getSupabaseBrowserConfig()) {
    authRedirect("/auth/sign-up", "missing-config");
  }

  const email = readRequiredString(formData, "email");
  const password = readRequiredString(formData, "password");

  if (!email || password.length < 8) {
    authRedirect("/auth/sign-up", "invalid-sign-up");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    options: origin ? { emailRedirectTo: `${origin}/app/onboarding` } : undefined,
    password
  });

  if (error) {
    authRedirect("/auth/sign-up", getSignUpFailureStatus(error));
  }

  if (!data.session) {
    authRedirect("/auth/sign-in", "check-email");
  }

  redirect("/app/onboarding");
}

export async function signOutAction() {
  if (getSupabaseBrowserConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
