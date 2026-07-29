import React from "react";
import { HeaderNav } from "@/components/dashboard/HeaderNav";
import { createServerClient } from "@/lib/supabase/server";
import AutoLogoutListener from "@/components/shared/AutoLogoutListener";

export default async function DashboardLayout({ children }) {
  const supabase = await createServerClient();

  // Ambil data user yang sedang login via getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "UNIT";
  let userName = "User Sekolah";
  let unitName = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(`
        full_name,
        role,
        units:unit_id (
          kcp_name,
          sentra_mikro
        )
      `)
      .eq("id", user.id)
      .single();

    if (profile) {
      userRole = profile.role;
      userName = profile.full_name || "User Sekolah";
      if (profile.units) {
        const u = profile.units;
        unitName = `${u.kcp_name || ''} (${u.sentra_mikro || ''})`;
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Client Listener untuk Auto Logout 30 Menit */}
      <AutoLogoutListener />

      {/* Header Sticky Navigation dengan Full Width Padding */}
      <HeaderNav
        userRole={userRole}
        userName={userName}
        unitName={unitName}
      />

      {/* Main Content Area - Full-Width Responsive */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Global Footer Minimalis */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-medium">
        SDIT AL IHSAN Command Center Portal • Enterprise Monitoring & Operational System
      </footer>
    </div>
  );
}