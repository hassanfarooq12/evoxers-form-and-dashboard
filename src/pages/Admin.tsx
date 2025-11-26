import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, Search, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Submission = {
  id: string;
  created_at: string;
  full_name: string;
  company_name?: string | null;
  role_position?: string | null;
  work_email: string;
  phone?: string | null;
  website_links?: string | null;
  services: string;
  services_other?: string | null;
  [key: string]: any;
};

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const ADMIN_PASSWORD = "evoxers-admin-123";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Access granted", description: "Welcome to the admin dashboard." });
    } else {
      toast({ title: "Access denied", description: "Incorrect password.", variant: "destructive" });
    }
  };

  const fetchSubmissions = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');
      const apiPath = apiUrl ? `${apiUrl}/api/all` : '/api/all';
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubmissions(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch submissions.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, fetchSubmissions]);

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    const headers = Object.keys(submissions[0]).join(",");
    const rows = submissions.map((sub) =>
      Object.values(sub)
        .map((val) => {
          if (Array.isArray(val)) return `"${val.join("; ")}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evoxers-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.work_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <div className="flex flex-col items-center mb-6">
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter password to continue</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-secondary hover:bg-secondary/90">
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Client Submissions</p>
          </div>
          <Button onClick={exportToCSV} disabled={submissions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{submission.full_name}</TableCell>
                      <TableCell>{submission.work_email}</TableCell>
                      <TableCell>{submission.company_name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {typeof submission.services === 'string' 
                            ? submission.services.split(',').slice(0, 2).map((service: string, i: number) => (
                                <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                  {service.trim()}
                                </span>
                              ))
                            : Array.isArray(submission.services)
                            ? submission.services.slice(0, 2).map((service: string, i: number) => (
                                <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                  {service}
                                </span>
                              ))
                            : null
                          }
                          {(() => {
                            const services = typeof submission.services === 'string' 
                              ? submission.services.split(',')
                              : Array.isArray(submission.services) 
                              ? submission.services 
                              : [];
                            return services.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{services.length - 2}
                              </span>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-foreground">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-foreground">{selectedSubmission.company_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedSubmission.work_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground">{selectedSubmission.phone || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const services = typeof selectedSubmission.services === 'string'
                      ? selectedSubmission.services.split(',').map(s => s.trim())
                      : Array.isArray(selectedSubmission.services)
                      ? selectedSubmission.services
                      : [];
                    return services.map((service: string, i: number) => (
                      <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              {selectedSubmission.business_model && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Model</p>
                  <p className="text-foreground">{selectedSubmission.business_model}</p>
                </div>
              )}

              {selectedSubmission.future_vision && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Future Vision</p>
                  <p className="text-foreground">{selectedSubmission.future_vision}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-4 border-t">
                Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
