"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 z-10 flex w-full items-center justify-between bg-[rgba(239,246,255,0.7)] px-3 py-2 backdrop-blur-sm">
      <Link href={"/"}>
        <div className="relative h-10 w-32">
          <Image src={"/logo-full.svg"} alt="stusome" fill />
        </div>
      </Link>
      <div>
        <Button className="text-lg">
          Login
          <LogIn className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
