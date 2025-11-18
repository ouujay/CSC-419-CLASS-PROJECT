import { Image as LImages } from "lucide-react";

export default function MediaPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <LImages className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Media Gallery Coming Soon</h1>
        <p className="text-muted-foreground max-w-[600px]">
          We&apos;re working on bringing you a comprehensive media management system to help you store, organize, and share your family photos, videos, and other important memories.
        </p>
      </div>
    </div>
  );
}
