import { Users } from "lucide-react";
import Link from "next/link";
import React, { JSX } from "react";

export default function ViewFamilies() {
  return (
   <Link href={"/dashboard/families"}>
    <DashboardCard
      icon={<Users className="size-4" />}
      title={"View my families"}
      subtitle={"View and manage your family trees, add new members."}
    />
   </Link>
  );
}

export function DashboardCard({
  icon,
  title,
  subtitle,
  isDisabled = false,
  limitMessage,
}: {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  isDisabled?: boolean;
  limitMessage?: string;
}) {
  return (
    <section 
      className={`
        bg-background rounded-xl border p-4 flex flex-col gap-2 h-full
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-background-muted cursor-pointer'
        }
      `}
    >
      <div className="text-xl font-cardo text-foreground flex items-center gap-2">
        {icon}
        <h6>{title}</h6>
      </div>
      <p className="text-xs sm:text-sm text-foreground-muted text-left">
        {subtitle}
      </p>
      {limitMessage && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg mt-auto">
          <p className="text-xs text-destructive font-medium">
            {limitMessage}
          </p>
        </div>
      )}
    </section>
  );
}