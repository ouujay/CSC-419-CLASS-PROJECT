import Image from "next/image";

export default function RoundedImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative rounded-full overflow-hidden border"
        style={{ width, height }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}
export function RoundedPreviewImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width, height }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}
