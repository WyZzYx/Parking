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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const sortLabels: Record<SortBy, string> = {
    startTime: "Start Time",
    endTime: "End Time",
    plate: "Plate",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Admin Dashboard: All Tickets</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by: {sortLabels[sortBy]} ({sortDirection.toUpperCase()})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("startTime")}>
              Sort by Start Time
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("endTime")}>
              Sort by End Time
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("plate")}>
              Sort by Plate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
