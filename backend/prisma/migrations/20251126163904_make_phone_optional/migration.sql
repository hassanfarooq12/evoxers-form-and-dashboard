-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "full_name" TEXT NOT NULL,
    "company_name" TEXT,
    "role_position" TEXT,
    "work_email" TEXT NOT NULL,
    "phone" TEXT,
    "website_links" TEXT,
    "services" TEXT NOT NULL,
    "services_other" TEXT,
    "video_count_option" TEXT,
    "video_custom_requirement" TEXT,
    "video_usage_platforms" TEXT NOT NULL,
    "has_raw_footage" TEXT,
    "web_services" TEXT NOT NULL,
    "chatbot_platform" TEXT,
    "has_existing_website" TEXT,
    "existing_website_link" TEXT,
    "website_purpose" TEXT,
    "brand_services" TEXT NOT NULL,
    "brand_name" TEXT,
    "brand_files_link" TEXT,
    "ad_goal" TEXT,
    "ad_budget" TEXT,
    "ad_target_locations" TEXT,
    "favorite_colors" TEXT,
    "business_model" TEXT,
    "future_vision" TEXT,
    "inspiration_brands" TEXT,
    "how_heard" TEXT
);
INSERT INTO "new_Submission" ("ad_budget", "ad_goal", "ad_target_locations", "brand_files_link", "brand_name", "brand_services", "business_model", "chatbot_platform", "company_name", "created_at", "existing_website_link", "favorite_colors", "full_name", "future_vision", "has_existing_website", "has_raw_footage", "how_heard", "id", "inspiration_brands", "phone", "role_position", "services", "services_other", "video_count_option", "video_custom_requirement", "video_usage_platforms", "web_services", "website_links", "website_purpose", "work_email") SELECT "ad_budget", "ad_goal", "ad_target_locations", "brand_files_link", "brand_name", "brand_services", "business_model", "chatbot_platform", "company_name", "created_at", "existing_website_link", "favorite_colors", "full_name", "future_vision", "has_existing_website", "has_raw_footage", "how_heard", "id", "inspiration_brands", "phone", "role_position", "services", "services_other", "video_count_option", "video_custom_requirement", "video_usage_platforms", "web_services", "website_links", "website_purpose", "work_email" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
