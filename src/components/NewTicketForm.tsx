"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { formatDateWithSeconds } from "@/lib/utils";

const durationOptions = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 h" },
  { value: 120, label: "2 h" },
  { value: 360, label: "6 h" },
  { value: 1440, label: "1 day" },
];

export default function NewTicketForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [plate, setPlate] = useState(session?.user?.carPlate || "");
  const [duration, setDuration] = useState(durationOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyTicket = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to buy a ticket.",
      });
      return;
    }
    if (!plate.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a car plate.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate, durationMinutes: duration }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create ticket.");
      }

      toast({
        title: "Success!",
        description: `Ticket bought for ${result.plate}, valid until ${formatDateWithSeconds(new Date(result.endTime))}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">New Parking Ticket</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="plate">Car Plate</Label>
          <Input
            id="plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="e.g., ABC-1234"
            className="uppercase"
          />
        </div>
        <div>
          <Label>Duration</Label>
          <RadioGroup
            value={String(duration)}
            onValueChange={(value) => setDuration(Number(value))}
            className="flex flex-wrap gap-4 pt-2"
          >
            {durationOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={String(opt.value)} id={`duration-${opt.value}`} />
                <Label htmlFor={`duration-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <Button onClick={handleBuyTicket} disabled={isLoading} className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        {isLoading ? "Processing..." : "Buy Ticket"}
      </Button>
    </div>
  );
}
