"use client";
import Link from "next/link";
import Icon from "./Icon";
import { useUIContext } from "@/contexts/UIContext";
import { DiscordURL, TwitterURL, FarcasterURL, EmailURL } from "@/lib/urls";

export default function HeaderLinks() {
  const { scrollPosition } = useUIContext();

  return (
    <>
      <Link
        href={DiscordURL}
        target="_blank"
        rel="noopener"
      >
        <Icon icon="gtp:discord-monochrome" className={`${scrollPosition < 100 ? "size-[39px] desktop:size-[42px]" : "size-[26px] desktop:size-[30px]"} text-blue1 transition-all duration-300 ease-out `} />
      </Link>
      <Link
        href={TwitterURL}
        target="_blank"
        rel="noopener"
      >
        <Icon icon="gtp:x-monochrome" className={`${scrollPosition < 100 ? "size-[39px] desktop:size-[42px]" : "size-[26px] desktop:size-[30px]"} text-blue1 transition-all duration-300 ease-out `} />
      </Link>
      <Link
        href={FarcasterURL}
        target="_blank"
        rel="noopener"
      >
        <Icon icon="gtp:farcaster-monochrome" className={`${scrollPosition < 100 ? "size-[39px] desktop:size-[42px]" : "size-[26px] desktop:size-[30px]"} text-blue1 transition-all duration-300 ease-out `} />
      </Link>
      <Link
        href={EmailURL}
        target="_blank"
        rel="noopener"
      >
        <Icon icon="mdi:email" className={`${scrollPosition < 100 ? "size-[39px] desktop:size-[42px]" : "size-[26px] desktop:size-[30px]"} text-blue1 transition-all duration-300 ease-out `} />
      </Link>
    </>
  );
}
