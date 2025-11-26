import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, Search, Eye, Trash2, ArrowLeft, LogOut } from "lucide-react";
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
  video_count_option?: string | null;
  video_custom_requirement?: string | null;
  video_usage_platforms?: string | null;
  has_raw_footage?: string | null;
  web_services?: string | null;
  chatbot_platform?: string | null;
  has_existing_website?: string | null;
  existing_website_link?: string | null;
  website_purpose?: string | null;
  brand_services?: string | null;
  brand_name?: string | null;
  brand_files_link?: string | null;
  ad_goal?: string | null;
  ad_budget?: string | null;
  ad_target_locations?: string | null;
  favorite_colors?: string | null;
  business_model?: string | null;
  future_vision?: string | null;
  inspiration_brands?: string | null;
  how_heard?: string | null;
  [key: string]: any;
};

// Auth helpers
const AUTH_KEY = "admin_authenticated";

const isAdminLoggedIn = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};

const loginAdmin = () => {
  localStorage.setItem(AUTH_KEY, "true");
};

const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
};

// Admin List View
export const AdminList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');
      const apiPath = apiUrl ? `${apiUrl}/api/${id}` : `/api/${id}`;
      const response = await fetch(apiPath, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      
      toast({ title: "Success", description: "Submission deleted successfully." });
      fetchSubmissions();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete submission.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    const headers = [
      "id", "created_at", "full_name", "company_name", "role_position",
      "work_email", "phone", "website_links", "services", "services_other",
      "video_count_option", "video_custom_requirement", "video_usage_platforms",
      "has_raw_footage", "web_services", "chatbot_platform", "has_existing_website",
      "existing_website_link", "website_purpose", "brand_services", "brand_name",
      "brand_files_link", "ad_goal", "ad_budget", "ad_target_locations",
      "favorite_colors", "business_model", "future_vision", "inspiration_brands", "how_heard"
    ];

    const rows = submissions.map((sub) =>
      headers
        .map((h) => {
          const val = sub[h] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Success", description: "CSV exported successfully." });
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.work_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Viewing {filteredSubmissions.length} of {submissions.length} submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} disabled={submissions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => { logoutAdmin(); navigate('/admin'); }}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No submissions found</div>
          ) : (
            <div className="rounded-md border border-border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap">
                        {submission.created_at
                          ? new Date(submission.created_at).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="font-medium">{submission.full_name}</TableCell>
                      <TableCell>{submission.work_email}</TableCell>
                      <TableCell>{submission.phone || "N/A"}</TableCell>
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
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/${submission.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(submission.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// Admin Detail View
export const AdminDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');
        const apiPath = apiUrl ? `${apiUrl}/api/${id}` : `/api/${id}`;
        const response = await fetch(apiPath);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Submission not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSubmission(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch submission.";
        toast({ title: "Error", description: message, variant: "destructive" });
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <p className="text-destructive mb-4">Submission not found.</p>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const entries = Object.entries(submission).filter(([key]) => key !== 'id');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Submission Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="border border-border rounded p-3"
              >
                <p className="text-xs uppercase text-muted-foreground mb-1">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm break-words">
                  {value == null || value === "" ? "—" : String(value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Main Admin Component with Login
const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAdminLoggedIn()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (username === "admin" && password === "admin123") {
      loginAdmin();
      setIsAuthenticated(true);
      toast({ title: "Access granted", description: "Welcome to the admin dashboard." });
    } else {
      toast({ title: "Access denied", description: "Incorrect credentials.", variant: "destructive" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <div className="flex flex-col items-center mb-6">
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter credentials to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return <AdminList />;
};

export default Admin;
