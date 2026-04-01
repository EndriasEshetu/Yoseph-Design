import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Search,
  Eye,
  MailOpen,
  Archive,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import type { ContactMessage, ContactMessageStatus } from '../../types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

const StatusBadge = ({ status }: { status: ContactMessageStatus }) => {
  const styles: Record<ContactMessageStatus, string> = {
    new: 'bg-amber-100 text-amber-900',
    read: 'bg-blue-100 text-blue-800',
    archived: 'bg-neutral-200 text-neutral-600',
  };
  return (
    <Badge
      variant="outline"
      className={`${styles[status]} border-none font-medium capitalize px-3 py-1 rounded-full`}
    >
      {status}
    </Badge>
  );
};

export const ContactManagement: React.FC = () => {
  const {
    contactMessages,
    loading,
    fetchContactMessages,
    updateContactMessageStatus,
    deleteContactMessage,
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | 'all'>(
    'all'
  );
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchContactMessages();
  }, [fetchContactMessages]);

  const filtered = contactMessages.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.phone && m.phone.includes(q)) ||
      m.category.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const setStatus = async (id: string, status: ContactMessageStatus) => {
    try {
      await updateContactMessageStatus(id, status);
      toast.success(
        status === 'read'
          ? 'Marked as read'
          : status === 'archived'
            ? 'Archived'
            : 'Marked as new'
      );
    } catch {
      toast.error('Could not update message');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteContactMessage(id);
      toast.success('Message deleted');
      setSelected((s) => (s?.id === id ? null : s));
    } catch {
      toast.error('Could not delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search name, email, category, message..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'new', 'read', 'archived'] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="capitalize shrink-0"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
        {loading && contactMessages.length === 0 ? (
          <p className="p-8 text-center text-neutral-500 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-neutral-500 text-sm">
            No messages match your filters.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-100">
                <TableHead>From</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow
                  key={m.id}
                  className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-100"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-neutral-400">{m.email}</span>
                      {m.phone && <span className="text-xs text-neutral-400">{m.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-700">{m.category}</TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {format(new Date(m.createdAt), 'MMM dd, yyyy · p')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelected(m)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setStatus(m.id, 'read')}
                            className="gap-2"
                          >
                            <MailOpen className="w-4 h-4" /> Mark read
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatus(m.id, 'archived')}
                            className="gap-2"
                          >
                            <Archive className="w-4 h-4" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatus(m.id, 'new')}
                            className="gap-2"
                          >
                            Mark new
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => remove(m.id)}
                            className="gap-2 text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 flex-wrap">
              Message from {selected?.name}
              {selected && <StatusBadge status={selected.status} />}
            </DialogTitle>
            <DialogDescription>
              {selected && (
                <>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-amber-600 hover:underline"
                  >
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <span className="ml-2">
                      · <a href={`tel:${selected.phone}`} className="text-amber-600 hover:underline">{selected.phone}</a>
                    </span>
                  )}
                  <span className="block mt-1 text-neutral-500">
                    {format(new Date(selected.createdAt), 'PPP p')} ·{' '}
                    {selected.category}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="py-2 overflow-y-auto">
              <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            {selected && selected.status !== 'read' && (
              <Button variant="outline" onClick={() => setStatus(selected.id, 'read')}>
                Mark read
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
