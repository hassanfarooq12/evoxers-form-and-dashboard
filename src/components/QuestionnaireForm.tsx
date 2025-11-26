import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "./ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface FormData {
  full_name: string;
  company_name: string;
  role_position: string;
  work_email: string;
  phone: string;
  website_links: string;
  services: string[];
  services_other: string;
  video_count_option: string;
  video_custom_requirement: string;
  video_usage_platforms: string[];
  has_raw_footage: string;
  web_services: string[];
  chatbot_platform: string;
  has_existing_website: string;
  existing_website_link: string;
  website_purpose: string;
  brand_services: string[];
  brand_name: string;
  brand_files_link: string;
  ad_goal: string;
  ad_budget: string;
  ad_target_locations: string;
  favorite_colors: string;
  business_model: string;
  future_vision: string;
  inspiration_brands: string;
  how_heard: string;
}

type MultiSelectField = "services" | "video_usage_platforms" | "web_services" | "brand_services";

export const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    company_name: "",
    role_position: "",
    work_email: "",
    phone: "",
    website_links: "",
    services: [],
    services_other: "",
    video_count_option: "",
    video_custom_requirement: "",
    video_usage_platforms: [],
    has_raw_footage: "",
    web_services: [],
    chatbot_platform: "",
    has_existing_website: "",
    existing_website_link: "",
    website_purpose: "",
    brand_services: [],
    brand_name: "",
    brand_files_link: "",
    ad_goal: "",
    ad_budget: "",
    ad_target_locations: "",
    favorite_colors: "",
    business_model: "",
    future_vision: "",
    inspiration_brands: "",
    how_heard: "",
  });

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: MultiSelectField, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] ?? [];
      const nextArray = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      return { ...prev, [field]: nextArray };
    });
  };

  const getVisibleSteps = () => {
    const steps = [1, 2]; // Always show steps 1 & 2
    
    if (formData.services.includes("Video Editing") || formData.services.includes("Motion Graphics")) {
      steps.push(3);
    }
    if (formData.services.includes("Web / Software Development")) {
      steps.push(4);
    }
    if (formData.services.includes("Complete Brand Identity")) {
      steps.push(5);
    }
    if (formData.services.includes("Meta Ads (Facebook / Instagram)")) {
      steps.push(6);
    }
    
    steps.push(7); // Always show step 7
    return steps;
  };

  type ValidationError = {
    title: string;
    description: string;
  };

  const getCurrentStepValidationError = (): ValidationError | null => {
    switch (currentStep) {
      case 1:
        if (!formData.full_name || !formData.work_email) {
          return {
            title: "Required fields missing",
            description: "Please fill in all required fields.",
          };
        }
        break;
      case 2:
        if (formData.services.length === 0) {
          return {
            title: "Service selection required",
            description: "Please select at least one service.",
          };
        }
        break;
    }
    return null;
  };

  const ensureCurrentStepIsValid = () => {
    const error = getCurrentStepValidationError();
    if (error) {
      toast({ ...error, variant: "destructive" });
      return false;
    }
    return true;
  };

  const visibleSteps = getVisibleSteps();
  const totalSteps = visibleSteps.length;
  const currentStepIndex = visibleSteps.indexOf(currentStep);
  const currentStepValidationError = getCurrentStepValidationError();
  const isCurrentStepValid = !currentStepValidationError;

  const goToNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStep(visibleSteps[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(visibleSteps[currentStepIndex - 1]);
    }
  };

  const handleNextStep = () => {
    if (!ensureCurrentStepIsValid()) return;
    goToNextStep();
  };

  const handleSubmit = async () => {
    if (!ensureCurrentStepIsValid()) return;

    setIsSubmitting(true);
    try {
      // Prepare payload matching Prisma Submission model
      // Convert arrays to semicolon-separated strings for SQLite
      // Handle empty arrays by converting to empty strings
      const payload = {
        full_name: formData.full_name,
        company_name: formData.company_name || null,
        role_position: formData.role_position || null,
        work_email: formData.work_email,
        phone: formData.phone || null, // Optional field
        website_links: formData.website_links || null,
        services: formData.services && formData.services.length > 0 ? formData.services.join("; ") : '',
        services_other: formData.services_other || null,
        video_count_option: formData.video_count_option || null,
        video_custom_requirement: formData.video_custom_requirement || null,
        video_usage_platforms: formData.video_usage_platforms && formData.video_usage_platforms.length > 0 ? formData.video_usage_platforms.join("; ") : '',
        has_raw_footage: formData.has_raw_footage || null,
        web_services: formData.web_services && formData.web_services.length > 0 ? formData.web_services.join("; ") : '',
        chatbot_platform: formData.chatbot_platform || null,
        has_existing_website: formData.has_existing_website || null,
        existing_website_link: formData.existing_website_link || null,
        website_purpose: formData.website_purpose || null,
        brand_services: formData.brand_services && formData.brand_services.length > 0 ? formData.brand_services.join("; ") : '',
        brand_name: formData.brand_name || null,
        brand_files_link: formData.brand_files_link || null,
        ad_goal: formData.ad_goal || null,
        ad_budget: formData.ad_budget || null,
        ad_target_locations: formData.ad_target_locations || null,
        favorite_colors: formData.favorite_colors || null,
        business_model: formData.business_model || null,
        future_vision: formData.future_vision || null,
        inspiration_brands: formData.inspiration_brands || null,
        how_heard: formData.how_heard || null,
      };

      // Use relative path for single deployment, or env variable for separate deployment
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');
      const apiPath = apiUrl ? `${apiUrl}/api/submit` : '/api/submit';
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || `Server error: ${res.status}`);
      }

      const result = await res.json();
      console.log('Submission successful:', result);
      alert("Form submitted successfully!");
      navigate("/success");
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Basic Information</h2>
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" value={formData.full_name} onChange={(e) => updateFormData("full_name", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" value={formData.company_name} onChange={(e) => updateFormData("company_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="role_position">Role / Position</Label>
              <Input id="role_position" value={formData.role_position} onChange={(e) => updateFormData("role_position", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="work_email">Work Email *</Label>
              <Input id="work_email" type="email" value={formData.work_email} onChange={(e) => updateFormData("work_email", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">WhatsApp / Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} placeholder="+1 234 567 8900" />
            </div>
            <div>
              <Label htmlFor="website_links">Current Website / Social Links</Label>
              <Input id="website_links" value={formData.website_links} onChange={(e) => updateFormData("website_links", e.target.value)} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Services Required</h2>
            <div className="space-y-3">
              {["Web / Software Development", "Complete Brand Identity", "Video Editing", "Motion Graphics", "Meta Ads (Facebook / Instagram)", "Something else"].map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox id={service} checked={formData.services.includes(service)} onCheckedChange={() => toggleArrayValue("services", service)} />
                  <Label htmlFor={service} className="cursor-pointer">{service}</Label>
                </div>
              ))}
            </div>
            {formData.services.includes("Something else") && (
              <div className="mt-4">
                <Label htmlFor="services_other">Please describe what you need</Label>
                <Textarea id="services_other" value={formData.services_other} onChange={(e) => updateFormData("services_other", e.target.value)} rows={3} />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Video / Motion Graphics</h2>
            <div>
              <Label>How many videos do you need?</Label>
              <RadioGroup value={formData.video_count_option} onValueChange={(value) => updateFormData("video_count_option", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2 landscape + 2 portrait" id="vid1" />
                  <Label htmlFor="vid1">2 landscape + 2 portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4 landscape + 4 portrait" id="vid2" />
                  <Label htmlFor="vid2">4 landscape + 4 portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2 landscape only" id="vid3" />
                  <Label htmlFor="vid3">2 landscape only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2 portrait only" id="vid4" />
                  <Label htmlFor="vid4">2 portrait only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Custom" id="vid5" />
                  <Label htmlFor="vid5">Custom</Label>
                </div>
              </RadioGroup>
            </div>
            {formData.video_count_option === "Custom" && (
              <div>
                <Label htmlFor="video_custom">Explain your custom video requirement</Label>
                <Textarea id="video_custom" value={formData.video_custom_requirement} onChange={(e) => updateFormData("video_custom_requirement", e.target.value)} rows={3} />
              </div>
            )}
            <div>
              <Label>Where will these videos be used?</Label>
              <div className="space-y-2 mt-2">
                {["Instagram Reels", "TikTok", "YouTube", "Website", "Paid Ads", "Other"].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox id={platform} checked={formData.video_usage_platforms.includes(platform)} onCheckedChange={() => toggleArrayValue("video_usage_platforms", platform)} />
                    <Label htmlFor={platform}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Do you already have raw footage?</Label>
              <RadioGroup value={formData.has_raw_footage} onValueChange={(value) => updateFormData("has_raw_footage", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="footage1" />
                  <Label htmlFor="footage1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="footage2" />
                  <Label htmlFor="footage2">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mix of both" id="footage3" />
                  <Label htmlFor="footage3">Mix of both</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Web / Software Development</h2>
            <div>
              <Label>What do you need from us?</Label>
              <div className="space-y-2 mt-2">
                {[
                  "Complete website with chatbot",
                  "Complete website without chatbot",
                  "Only chatbot integration into existing website",
                  "Web application / dashboard (SaaS or internal tool)",
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox id={service} checked={formData.web_services.includes(service)} onCheckedChange={() => toggleArrayValue("web_services", service)} />
                    <Label htmlFor={service}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
            {formData.web_services.includes("Only chatbot integration into existing website") && (
              <div>
                <Label htmlFor="chatbot_platform">Which platform is your site built on?</Label>
                <Input id="chatbot_platform" value={formData.chatbot_platform} onChange={(e) => updateFormData("chatbot_platform", e.target.value)} placeholder="WordPress, Webflow, Custom, etc." />
              </div>
            )}
            <div>
              <Label>Do you already have a website?</Label>
              <RadioGroup value={formData.has_existing_website} onValueChange={(value) => updateFormData("has_existing_website", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="web1" />
                  <Label htmlFor="web1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="web2" />
                  <Label htmlFor="web2">No</Label>
                </div>
              </RadioGroup>
            </div>
            {formData.has_existing_website === "Yes" && (
              <div>
                <Label htmlFor="existing_website_link">Share your website link</Label>
                <Input id="existing_website_link" value={formData.existing_website_link} onChange={(e) => updateFormData("existing_website_link", e.target.value)} />
              </div>
            )}
            <div>
              <Label>What is the main purpose of the website?</Label>
              <RadioGroup value={formData.website_purpose} onValueChange={(value) => updateFormData("website_purpose", value)}>
                {["Lead generation", "Portfolio / brand presence", "E-commerce", "SaaS platform", "Internal tool", "Other"].map((purpose) => (
                  <div key={purpose} className="flex items-center space-x-2">
                    <RadioGroupItem value={purpose} id={purpose} />
                    <Label htmlFor={purpose}>{purpose}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Brand Identity</h2>
            <div>
              <Label>Which brand identity services do you need?</Label>
              <div className="space-y-2 mt-2">
                {["Complete brand identity", "Logo (new)", "Logo redesign / refresh", "Instagram post templates", "Brand guidelines document", "Other"].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox id={service} checked={formData.brand_services.includes(service)} onCheckedChange={() => toggleArrayValue("brand_services", service)} />
                    <Label htmlFor={service}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="brand_name">Brand name</Label>
              <Input id="brand_name" value={formData.brand_name} onChange={(e) => updateFormData("brand_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="brand_files_link">Link to existing brand files (optional)</Label>
              <Input id="brand_files_link" value={formData.brand_files_link} onChange={(e) => updateFormData("brand_files_link", e.target.value)} />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Meta Ads</h2>
            <div>
              <Label>Primary ad goal</Label>
              <RadioGroup value={formData.ad_goal} onValueChange={(value) => updateFormData("ad_goal", value)}>
                {["Leads", "Sales", "Bookings", "Traffic", "Awareness"].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <RadioGroupItem value={goal} id={goal} />
                    <Label htmlFor={goal}>{goal}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label>Estimated monthly ad budget</Label>
              <RadioGroup value={formData.ad_budget} onValueChange={(value) => updateFormData("ad_budget", value)}>
                {["Less than $200", "$200–$500", "$500–$1000", "Above $1000", "Not sure yet"].map((budget) => (
                  <div key={budget} className="flex items-center space-x-2">
                    <RadioGroupItem value={budget} id={budget} />
                    <Label htmlFor={budget}>{budget}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="ad_target_locations">Which countries/cities do you want to target?</Label>
              <Textarea id="ad_target_locations" value={formData.ad_target_locations} onChange={(e) => updateFormData("ad_target_locations", e.target.value)} rows={2} />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Creative Direction</h2>
            <div>
              <Label htmlFor="favorite_colors">Your 3–5 favourite colors</Label>
              <Textarea id="favorite_colors" value={formData.favorite_colors} onChange={(e) => updateFormData("favorite_colors", e.target.value)} rows={2} placeholder="e.g., Deep navy, coral orange, mint green..." />
            </div>
            <div>
              <Label htmlFor="business_model">Explain your business model</Label>
              <Textarea id="business_model" value={formData.business_model} onChange={(e) => updateFormData("business_model", e.target.value)} rows={3} />
            </div>
            <div>
              <Label htmlFor="future_vision">Where do you see your company in the next 1–3 years?</Label>
              <Textarea id="future_vision" value={formData.future_vision} onChange={(e) => updateFormData("future_vision", e.target.value)} rows={3} />
            </div>
            <div>
              <Label htmlFor="inspiration_brands">Share 2–3 brands whose visuals you like (optional)</Label>
              <Input id="inspiration_brands" value={formData.inspiration_brands} onChange={(e) => updateFormData("inspiration_brands", e.target.value)} placeholder="Apple, Nike, Airbnb..." />
            </div>
            <div>
              <Label htmlFor="how_heard">How did you hear about EVOXERS?</Label>
              <Select value={formData.how_heard} onValueChange={(value) => updateFormData("how_heard", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <ProgressBar currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStepIndex < totalSteps - 1 ? (
              <Button onClick={handleNextStep} disabled={!isCurrentStepValid}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
