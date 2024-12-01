"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useState } from "react";
export default function authLanding() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur : {count}</p>
      <Button onClick={() => setCount(count + 1)}>Incrémenter</Button>
    </div>
  );
}
