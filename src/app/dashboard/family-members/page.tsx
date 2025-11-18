import { Users } from "lucide-react";

export default function FamilyMembersPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Family Members Coming Soon</h1>
        <p className="text-muted-foreground max-w-[600px]">
          We&apos;re working on bringing you a comprehensive family members management system to help you track and organize your family tree, relationships, and important family information.
        </p>
      </div>
    </div>
  );
}
