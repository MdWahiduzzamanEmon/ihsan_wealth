import Image from "next/image";

interface IhsanLogoProps {
  size?: number;
  className?: string;
}

export function IhsanLogo({ size = 24, className }: IhsanLogoProps) {
  return (
    <Image
      src="/favicon.svg"
      alt="IhsanAI"
      width={size}
      height={size}
      className={`rounded-full ${className || ""}`}
    />
  );
}
