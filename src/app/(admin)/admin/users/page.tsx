"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  UserPlus,
  Mail,
  Calendar,
  Trash2,
  UserCog
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">User Management</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Users</span>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 px-4 text-sm font-semibold transition-all shadow-lg shadow-blue-900/20">
          <UserPlus className="size-4" />
          Add New User
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#1a211e] border-white/10 text-sm h-10 focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-zinc-600 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white h-10 px-4 gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">User</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Role</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Joined Date</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-10 rounded-full bg-white/5" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32 bg-white/5" />
                            <Skeleton className="h-3 w-48 bg-white/5" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="size-8 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <Users className="size-12 opacity-20" />
                        <p>No users found matching your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <TableRow key={user.id || user._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border border-white/10">
                            <AvatarFallback className="bg-blue-600/20 text-blue-400 font-bold text-xs uppercase">
                              {user.name?.substring(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">{user.name}</span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Mail className="size-3" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0
                          ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 
                            user.role === 'teacher' ? 'bg-amber-500/10 text-amber-400' : 
                            'bg-blue-500/10 text-blue-400'}
                        `}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 text-zinc-600" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1a211e] border-white/10 text-zinc-300 shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-widest px-3 py-2">Manage User</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                              <UserCog className="size-4 text-zinc-400" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                              <ShieldCheck className="size-4 text-zinc-400" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                              <Trash2 className="size-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
