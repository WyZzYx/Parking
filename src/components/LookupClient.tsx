"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TicketCard from "./TicketCard";

export default function LookupClient() {
  const [plate, setPlate] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async () => {
    if (!plate.trim()) return;
    setIsLoading(true);
    setTicket(null);
    setMessage("");
    try {
      const response = await fetch(`/api/lookup?plate=${plate.toUpperCase()}`);
      const result = await response.json();
      if (response.ok) {
        setTicket(result);
      } else {
        setMessage(result.message || "No active parking found for this plate.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Public Lookup</h2>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Label htmlFor="lookup-plate" className="sr-only">Car Plate</Label>
          <Input
            id="lookup-plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Enter car plate"
            className="uppercase"
          />
        </div>
        <Button onClick={handleLookup} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      {ticket && <TicketCard ticket={ticket} />}
      {message && <p className="text-center text-muted-foreground">{message}</p>}
    </div>
  );
}
