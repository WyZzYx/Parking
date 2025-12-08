"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { diffText, formatDateWithSeconds } from "@/lib/utils";

export default function TicketCard({ ticket }: { ticket: any }) {
  const [timeLeft, setTimeLeft] = useState(diffText(ticket.endTime));
  const isExpired = new Date(ticket.endTime) < new Date();

  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      const newTimeLeft = diffText(ticket.endTime);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === "Expired") {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket.endTime, isExpired]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="tracking-widest">{ticket.plate}</span>
          <Badge variant={isExpired ? "destructive" : "default"}>
            {ticket.durationMinutes} min
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Start:</strong> {formatDateWithSeconds(ticket.startTime)}</p>
        <p><strong>End:</strong> {formatDateWithSeconds(ticket.endTime)}</p>
        <p>
          <strong>Time Left:</strong>
          <span className={isExpired ? "text-red-500" : "text-green-600"}>
            {" "}{timeLeft}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
