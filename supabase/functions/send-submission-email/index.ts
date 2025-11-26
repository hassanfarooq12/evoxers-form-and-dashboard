import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SubmissionValue = string | string[] | null | undefined;

interface SubmissionData {
  full_name: string;
  company_name?: string | null;
  work_email: string;
  phone?: string | null;
  services: string[];
  created_at: string;
  role_position?: string | null;
  website_links?: string | null;
  services_other?: string | null;
  video_count_option?: string | null;
  video_custom_requirement?: string | null;
  video_usage_platforms?: string[] | null;
  has_raw_footage?: string | null;
  web_services?: string[] | null;
  chatbot_platform?: string | null;
  has_existing_website?: string | null;
  existing_website_link?: string | null;
  website_purpose?: string | null;
  brand_services?: string[] | null;
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
  [key: string]: SubmissionValue;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission: SubmissionData = await req.json();
    console.log("Received submission:", submission);

    // Format submission data for email
    const formatServices = (services: string[]) => services.join(", ");
    const formatArray = (arr?: string[]) => arr && arr.length > 0 ? arr.join(", ") : "N/A";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1D1616; color: #EEEEEE; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #D84040; }
            .section-title { color: #8E1616; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; margin-left: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Client Submission – EVOXERS</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Received: ${new Date(submission.created_at).toLocaleString()}</p>
            </div>
            <div class="content">
              
              <div class="section">
                <div class="section-title">📋 Basic Information</div>
                <div class="field"><span class="label">Full Name:</span><span class="value">${submission.full_name}</span></div>
                <div class="field"><span class="label">Company:</span><span class="value">${submission.company_name || "N/A"}</span></div>
                <div class="field"><span class="label">Role:</span><span class="value">${submission.role_position || "N/A"}</span></div>
                <div class="field"><span class="label">Email:</span><span class="value">${submission.work_email}</span></div>
                <div class="field"><span class="label">Phone:</span><span class="value">${submission.phone || "N/A"}</span></div>
                <div class="field"><span class="label">Website/Links:</span><span class="value">${submission.website_links || "N/A"}</span></div>
              </div>

              <div class="section">
                <div class="section-title">🎯 Services Required</div>
                <div class="field"><span class="value">${formatServices(submission.services)}</span></div>
                ${submission.services_other ? `<div class="field"><span class="label">Other:</span><span class="value">${submission.services_other}</span></div>` : ""}
              </div>

              ${submission.video_count_option ? `
              <div class="section">
                <div class="section-title">🎬 Video/Motion Graphics</div>
                <div class="field"><span class="label">Video Count:</span><span class="value">${submission.video_count_option}</span></div>
                ${submission.video_custom_requirement ? `<div class="field"><span class="label">Custom Requirement:</span><span class="value">${submission.video_custom_requirement}</span></div>` : ""}
                <div class="field"><span class="label">Usage Platforms:</span><span class="value">${formatArray(submission.video_usage_platforms)}</span></div>
                <div class="field"><span class="label">Has Raw Footage:</span><span class="value">${submission.has_raw_footage || "N/A"}</span></div>
              </div>
              ` : ""}

              ${submission.web_services && submission.web_services.length > 0 ? `
              <div class="section">
                <div class="section-title">💻 Web/Software Development</div>
                <div class="field"><span class="label">Services:</span><span class="value">${formatArray(submission.web_services)}</span></div>
                ${submission.chatbot_platform ? `<div class="field"><span class="label">Chatbot Platform:</span><span class="value">${submission.chatbot_platform}</span></div>` : ""}
                <div class="field"><span class="label">Has Existing Website:</span><span class="value">${submission.has_existing_website || "N/A"}</span></div>
                ${submission.existing_website_link ? `<div class="field"><span class="label">Website Link:</span><span class="value">${submission.existing_website_link}</span></div>` : ""}
                <div class="field"><span class="label">Website Purpose:</span><span class="value">${submission.website_purpose || "N/A"}</span></div>
              </div>
              ` : ""}

              ${submission.brand_services && submission.brand_services.length > 0 ? `
              <div class="section">
                <div class="section-title">🎨 Brand Identity</div>
                <div class="field"><span class="label">Services:</span><span class="value">${formatArray(submission.brand_services)}</span></div>
                <div class="field"><span class="label">Brand Name:</span><span class="value">${submission.brand_name || "N/A"}</span></div>
                ${submission.brand_files_link ? `<div class="field"><span class="label">Brand Files:</span><span class="value">${submission.brand_files_link}</span></div>` : ""}
              </div>
              ` : ""}

              ${submission.ad_goal ? `
              <div class="section">
                <div class="section-title">📱 Meta Ads</div>
                <div class="field"><span class="label">Ad Goal:</span><span class="value">${submission.ad_goal}</span></div>
                <div class="field"><span class="label">Budget:</span><span class="value">${submission.ad_budget || "N/A"}</span></div>
                <div class="field"><span class="label">Target Locations:</span><span class="value">${submission.ad_target_locations || "N/A"}</span></div>
              </div>
              ` : ""}

              <div class="section">
                <div class="section-title">💡 Creative Direction</div>
                <div class="field"><span class="label">Favorite Colors:</span><span class="value">${submission.favorite_colors || "N/A"}</span></div>
                <div class="field"><span class="label">Business Model:</span><span class="value">${submission.business_model || "N/A"}</span></div>
                <div class="field"><span class="label">Future Vision (1-3 years):</span><span class="value">${submission.future_vision || "N/A"}</span></div>
                ${submission.inspiration_brands ? `<div class="field"><span class="label">Inspiration Brands:</span><span class="value">${submission.inspiration_brands}</span></div>` : ""}
                <div class="field"><span class="label">How Heard:</span><span class="value">${submission.how_heard || "N/A"}</span></div>
              </div>

            </div>
            <div class="footer">
              <p>This email was automatically generated by the EVOXERS Client Questionnaire system.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "EVOXERS Client Portal <onboarding@resend.dev>",
      to: ["info@evoxers.com"],
      subject: `New Client Submission – EVOXERS | ${submission.full_name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
