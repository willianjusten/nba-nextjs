"use client";

import { ArrowIcon } from "@/components/ArrowIcon";

function BackButton() {
  return (
    <div
      className="flex max-w-fit items-center py-5 transition-all duration-200 hover:cursor-pointer hover:opacity-60"
      onClick={() => window.history.back()}>
      <ArrowIcon size={16} />
      <span className="pl-3 text-xl">Back</span>
    </div>
  );
}

export default BackButton;
