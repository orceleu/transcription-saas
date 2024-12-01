"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal, TextIcon, UserIcon } from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

import { Cloud, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loginWithGoogle } from "../login/auth";
import logo from "../../public/logo.jpg";
export default function navBar() {
  const router = useRouter();
  return (
    <div className="fixed top-0  w-full flex justify-between p-5 bg-gray-50 ">
      <div className="flex items-center gap-3">
        <Image
          src={logo}
          alt="logo"
          title="Logo"
          className="size-[40px] md:size-[50px] rounded-full"
        />

        <p className="text-xl font-semibold">AudiScribe</p>
      </div>

      <div className="hidden lg:flex items-center gap-5">
        <Button variant="link">Home</Button>
        <a href="#pricing" className="hover:underline">
          Pricing
        </a>
        <a href="#blog" className="hover:underline">
          Blog
        </a>
        <Button
          onClick={loginWithGoogle}
          className="bg-amber-700 hover:bg-amber-600"
        >
          Login
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign up
        </Button>
      </div>
      <div className="lg:hidden flex items-center gap-5">
        <Button
          className="bg-amber-700 hover:bg-amber-600"
          onClick={() => {
            router.push("/login");
          }}
        >
          Login
        </Button>{" "}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-3xl ">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>More</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/login");
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Sign up</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TextIcon className="mr-2 h-4 w-4" />
                <span>Blog</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
