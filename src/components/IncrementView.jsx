"use client";
import { useEffect } from "react";

export default function IncrementView({ postId }) {
  useEffect(() => {
    if (postId) {
      fetch("/api/incrementView", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
    }
  }, [postId]);

  return null;
}