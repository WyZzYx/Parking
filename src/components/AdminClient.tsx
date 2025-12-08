"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
 } from "@/components/ui/table";
import { Button } from "./ui/button";
import { formatDateWithSeconds } from "@/lib/utils";

type SortBy = "startTime" | "endTime" | "plate";
type SortDirection = "asc" | "desc";

export default function AdminClient() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("startTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: "10",
          sortBy,
          direction: sortDirection,
        });
        const response = await fetch(`/api/tickets/admin?${params.toString()}`);
        const data = await response.json();
        if (response.ok) {
          setTickets(data.tickets);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch admin tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [page, sortBy, sortDirection]);

  const handleSort = (newSortBy: SortBy) => {
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin Dashboard: All Tickets</h2>
      <div className="flex gap-2">
        <Button onClick={() => handleSort("startTime")} variant={sortBy === 'startTime' ? 'default' : 'outline'}>Sort by Start Time</Button>
        <Button onClick={() => handleSort("endTime")} variant={sortBy === 'endTime' ? 'default' : 'outline'}>Sort by End Time</Button>
        <Button onClick={() => handleSort("plate")} variant={sortBy === 'plate' ? 'default' : 'outline'}>Sort by Plate</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket: any) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.plate}</TableCell>
                <TableCell>{ticket.user.email}</TableCell>
                <TableCell>{formatDateWithSeconds(ticket.startTime)}</TableCell>
                <TableCell>{formatDateWithSeconds(ticket.endTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-between items-center">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}
