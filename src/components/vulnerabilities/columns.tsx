"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Vulnerability } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

const getSeverityBadge = (severity: Vulnerability['severity']) => {
    switch (severity) {
        case 'Critical': return "destructive";
        case 'High': return "secondary";
        case 'Medium': return "default";
        default: return "outline";
    }
}

export const columns: ColumnDef<Vulnerability>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Vulnerability",
    cell: ({ row }) => {
        const vulnerability = row.original;
        return (
            <Link href={`/dashboard/vulnerabilities/${vulnerability.id}`} className="hover:underline">
                <div className="font-medium">{vulnerability.name}</div>
                <div className="text-xs text-muted-foreground">{vulnerability.id}</div>
            </Link>
        )
    }
  },
  {
    accessorKey: "severity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const severity = row.getValue("severity") as Vulnerability['severity'];
        return <Badge variant={getSeverityBadge(severity)} className={cn(severity === "High" && "bg-orange-500 text-white")}>{severity}</Badge>
    }
  },
  {
    accessorKey: "cvss",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CVSS
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const cvss = parseFloat(row.getValue("cvss"));
        return <div className="text-center font-medium">{cvss.toFixed(1)}</div>
    }
  },
    {
    accessorKey: "assetType",
    header: "Asset Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
        const status = row.original.status;
        const isCritical = row.original.severity === 'Critical' && status === 'Open';
        return <div className="flex items-center gap-2">
            {isCritical && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>}
            <span>{status}</span>
        </div>
    }
  },
  {
    accessorKey: "timestamp",
    header: "Discovered",
    cell: ({ row }) => {
        const date = new Date(row.getValue("timestamp"));
        return <div>{date.toLocaleDateString()}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vulnerability = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/vulnerabilities/${vulnerability.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(vulnerability.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Assign to user</DropdownMenuItem>
            <DropdownMenuItem>Change status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
