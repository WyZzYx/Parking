"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TicketCard from "./TicketCard";
import {Separator} from "@radix-ui/react-separator";

export default function MyTicketsClient() {
  const { data: session, status } = useSession();
  const [activeTickets, setActiveTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchTickets = async () => {
        setLoading(true);
        try {
          const [activeRes, historyRes] = await Promise.all([
            fetch("/api/tickets/me/current"),
            fetch("/api/tickets/me/history"),
          ]);
          const active = await activeRes.json();
          const history = await historyRes.json();
          if (activeRes.ok) setActiveTickets(active);
          if (historyRes.ok) setHistoryTickets(history);
        } catch (error) {
          console.error("Failed to fetch tickets", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <p>Loading tickets...</p>;
  }

  if (!session) {
    return <p>Please sign in to see your tickets.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Tickets</h2>
        {activeTickets.length > 0 ? (
          <div className="space-y-4">
            {activeTickets.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p>No active tickets.</p>
        )}
      </div>
      <Separator />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ticket History</h2>
        {historyTickets.length > 0 ? (
          <div className="space-y-4">
            {historyTickets.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p>No past tickets.</p>
        )}
      </div>
    </div>
  );
}
