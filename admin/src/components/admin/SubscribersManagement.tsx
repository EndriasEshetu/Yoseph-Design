import { useEffect, useMemo, useState } from "react";
import { Copy, Download, Mail, RefreshCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "../../config";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export const SubscribersManagement = () => {
  const token = useAdminAuthStore((state) => state.token);
  const logout = useAdminAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load subscribers");
      }

      const data = (await res.json()) as Subscriber[];
      setSubscribers(data);
      setSelectedIds((prev) =>
        prev.filter((id) => data.some((s) => s.id === id)),
      );
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      toast.error("Failed to load newsletter subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [query, subscribers]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((s) => selectedIds.includes(s.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visible = new Set(filtered.map((s) => s.id));
      setSelectedIds((prev) => prev.filter((id) => !visible.has(id)));
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      filtered.forEach((s) => next.add(s.id));
      return Array.from(next);
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const copyAllEmails = async () => {
    try {
      const emails = filtered.map((s) => s.email).join(", ");
      if (!emails) {
        toast.error("No emails to copy.");
        return;
      }
      await navigator.clipboard.writeText(emails);
      toast.success("Subscriber emails copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy emails:", error);
      toast.error("Failed to copy emails.");
    }
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("No subscribers to export.");
      return;
    }

    const rows = [
      ["Email", "Subscribed At"],
      ...filtered.map((s) => [s.email, new Date(s.createdAt).toISOString()]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exported.");
  };

  const bulkUnsubscribe = async () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one subscriber.");
      return;
    }

    const sure = window.confirm(
      `Unsubscribe ${selectedIds.length} selected user${selectedIds.length > 1 ? "s" : ""}?`,
    );
    if (!sure) return;

    setBulkDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        deletedCount?: number;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Failed to unsubscribe selected users");
      }

      const deleted = data.deletedCount ?? selectedIds.length;
      setSubscribers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      toast.success(`Unsubscribed ${deleted} user${deleted > 1 ? "s" : ""}.`);
    } catch (error: any) {
      console.error("Bulk unsubscribe failed:", error);
      toast.error(error?.message || "Failed to unsubscribe selected users.");
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Newsletter Subscribers
          </h2>
          <p className="text-sm text-neutral-500">
            View and manage users subscribed from the website footer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="destructive"
            onClick={bulkUnsubscribe}
            className="gap-2"
            disabled={selectedIds.length === 0 || bulkDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {bulkDeleting
              ? "Removing..."
              : `Unsubscribe Selected (${selectedIds.length})`}
          </Button>
          <Button variant="outline" onClick={copyAllEmails} className="gap-2">
            <Copy className="h-4 w-4" /> Copy Emails
          </Button>
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={fetchSubscribers}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          placeholder="Search subscriber email"
        />
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-100">
              <TableHead className="w-[48px] text-center">
                <input
                  type="checkbox"
                  aria-label="Select all visible subscribers"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  className="h-4 w-4"
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-neutral-500"
                >
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-neutral-500"
                >
                  No subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="hover:bg-neutral-50/50 border-b border-neutral-100"
                >
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      aria-label={`Select ${sub.email}`}
                      checked={selectedIds.includes(sub.id)}
                      onChange={() => toggleOne(sub.id)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <span className="font-medium text-sm">{sub.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(sub.email);
                          toast.success("Email copied");
                        } catch {
                          toast.error("Failed to copy email");
                        }
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-neutral-400">
        Total subscribers: {subscribers.length}
      </p>
    </div>
  );
};
