import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, MoreHorizontal, Mail, Shield, Eye, Edit, Trash2, Crown, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: "/api/placeholder/32/32",
    permissions: ["logs:read", "logs:write", "team:manage", "settings:write"]
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    email: "sarah.j@acmecorp.com",
    role: "Developer",
    status: "Active",
    lastActive: "5 minutes ago",
    avatar: "/api/placeholder/32/32",
    permissions: ["logs:read", "logs:write"]
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@acmecorp.com", 
    role: "Viewer",
    status: "Inactive",
    lastActive: "2 days ago",
    avatar: "/api/placeholder/32/32",
    permissions: ["logs:read"]
  },
  {
    id: "4",
    name: "Emily Rodriguez", 
    email: "emily.r@acmecorp.com",
    role: "Developer",
    status: "Active",
    lastActive: "1 hour ago",
    avatar: "/api/placeholder/32/32",
    permissions: ["logs:read", "logs:write"]
  }
];

const roles = [
  { 
    value: "admin", 
    label: "Admin", 
    description: "Full access to all features and settings",
    permissions: ["logs:read", "logs:write", "team:manage", "settings:write", "billing:manage"]
  },
  { 
    value: "developer", 
    label: "Developer", 
    description: "Can view and analyze logs, create filters",
    permissions: ["logs:read", "logs:write", "alerts:manage"]
  },
  { 
    value: "viewer", 
    label: "Viewer", 
    description: "Read-only access to logs and dashboards",
    permissions: ["logs:read"]
  }
];

const TeamManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  // Use static team members data
  const teamMembersData = teamMembers;
  const pendingInvitations = [];

    const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !inviteRole || !user?.organizationId) return;

    // Mock invitation - just show success message
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });

    setShowInviteDialog(false);
    setInviteEmail("");
    setInviteRole("viewer");
  };

    const handleUpdateRole = async (memberId: string, newRole: "admin" | "developer" | "viewer") => {
    // Mock role update - just show success message
    toast({
      title: "Role updated",
      description: "Team member role has been updated successfully",
    });
  };

    const handleRemoveMember = async (memberId: string) => {
    // Mock member removal - just show success message
    toast({
      title: "Member removed",
      description: "Team member has been removed successfully",
    });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    // Mock invitation cancellation
    console.log("Cancelled invitation:", invitationId);
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "developer":
        return <Key className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "Active" ? "secondary" : "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
          </div>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization's logging dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role.label)}
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembersData?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembersData?.filter(m => m.status === "Active").length || 0} active, {teamMembersData?.filter(m => m.status === "Inactive").length || 0} inactive
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembersData?.filter(m => m.role === "Admin").length || 0}</div>
              <p className="text-xs text-muted-foreground">Full access members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvitations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team's access and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembersData?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <span className="font-medium capitalize">{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(member.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.lastActive}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roles.find(r => r.label === member.role)?.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.split(':')[1]}
                          </Badge>
                        ))}
                        {(roles.find(r => r.label === member.role)?.permissions.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(roles.find(r => r.label === member.role)?.permissions.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            const newRole = prompt("Enter new role (Admin, Developer, Viewer):", member.role);
                            if (newRole && ["Admin", "Developer", "Viewer"].includes(newRole)) {
                              handleUpdateRole(member.id, newRole.toLowerCase() as "admin" | "developer" | "viewer");
                            }
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No team members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Overview of what each role can access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role.value} className="p-4 border border-border rounded-lg bg-gradient-surface">
                  <div className="flex items-center gap-2 mb-3">
                    {getRoleIcon(role.label)}
                    <div className="font-semibold">{role.label}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="space-y-1">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs mr-1">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeamManagement;