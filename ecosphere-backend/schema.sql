CREATE SCHEMA "public";
CREATE TABLE "activity_logs" (
	"log_id" uuid PRIMARY KEY,
	"user_id" uuid,
	"module" varchar(50),
	"action" varchar(255),
	"entity_id" uuid,
	"timestamp" timestamp,
	"ip_address" varchar(100)
);
CREATE TABLE "audit_findings" (
	"finding_id" uuid PRIMARY KEY,
	"audit_id" uuid,
	"severity" varchar(30),
	"description" text,
	"recommendation" text,
	"resolved" boolean
);
CREATE TABLE "audits" (
	"audit_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"audit_name" varchar(255),
	"audit_type" varchar(100),
	"auditor" varchar(255),
	"scheduled_date" date,
	"completed_date" date,
	"status" varchar(50),
	"findings" text
);
CREATE TABLE "badges" (
	"badge_id" uuid PRIMARY KEY,
	"badge_name" varchar(100),
	"description" text,
	"icon" varchar(255),
	"points_required" integer
);
CREATE TABLE "carbon_emissions" (
	"emission_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"facility" varchar(255),
	"department" varchar(100),
	"emission_source" varchar(150),
	"emission_type" varchar(100),
	"quantity" numeric,
	"unit" varchar(20),
	"reporting_month" date,
	"verified" boolean,
	"created_by" uuid
);
CREATE TABLE "challenges" (
	"challenge_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"title" varchar(255),
	"description" text,
	"category" varchar(50),
	"points" integer,
	"start_date" date,
	"end_date" date,
	"status" varchar(50)
);
CREATE TABLE "compliance_checks" (
	"compliance_id" uuid PRIMARY KEY,
	"policy_id" uuid,
	"department" varchar(100),
	"compliance_percentage" numeric,
	"checked_on" date,
	"remarks" text
);
CREATE TABLE "csr_projects" (
	"project_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"title" varchar(255),
	"description" text,
	"budget" numeric,
	"location" varchar(255),
	"start_date" date,
	"end_date" date,
	"status" varchar(50)
);
CREATE TABLE "emission_reductions" (
	"reduction_id" uuid PRIMARY KEY,
	"emission_id" uuid,
	"reduction_amount" numeric,
	"description" text,
	"completed_on" date,
	"verified" boolean
);
CREATE TABLE "employee_participation" (
	"participation_id" uuid PRIMARY KEY,
	"project_id" uuid,
	"user_id" uuid,
	"hours_contributed" numeric,
	"joined_on" date,
	"feedback" text
);
CREATE TABLE "employee_wellness" (
	"wellness_id" uuid PRIMARY KEY,
	"user_id" uuid,
	"wellness_score" numeric,
	"survey_score" numeric,
	"recorded_date" date,
	"remarks" text
);
CREATE TABLE "esg_goals" (
	"goal_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"category" varchar(30),
	"title" varchar(255),
	"target_value" numeric,
	"current_value" numeric,
	"unit" varchar(30),
	"deadline" date,
	"status" varchar(30)
);
CREATE TABLE "esg_score_history" (
	"history_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"score_type" varchar(30),
	"score" numeric(5, 2),
	"recorded_date" date
);
CREATE TABLE "esg_scores" (
	"score_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"environmental_score" numeric(5, 2),
	"social_score" numeric(5, 2),
	"governance_score" numeric(5, 2),
	"overall_score" numeric(5, 2),
	"calculated_on" date
);
CREATE TABLE "leaderboard" (
	"id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"user_id" uuid,
	"total_points" integer,
	"ranking" integer,
	"calculated_on" date
);
CREATE TABLE "notification_settings" (
	"id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"email_notifications" boolean,
	"push_notifications" boolean,
	"weekly_reports" boolean,
	"compliance_alerts" boolean
);
CREATE TABLE "organizations" (
	"organization_id" uuid PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"industry" varchar(100),
	"headquarters" varchar(255),
	"fiscal_year_start" date,
	"logo_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE TABLE "policies" (
	"policy_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"policy_name" varchar(255),
	"category" varchar(100),
	"version" varchar(20),
	"effective_date" date,
	"expiry_date" date,
	"owner" uuid,
	"status" varchar(50)
);
CREATE TABLE "report_templates" (
	"template_id" uuid PRIMARY KEY,
	"template_name" varchar(255),
	"description" text,
	"report_type" varchar(100)
);
CREATE TABLE "reports" (
	"report_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"report_name" varchar(255),
	"report_type" varchar(100),
	"generated_by" uuid,
	"generated_at" timestamp,
	"file_url" text
);
CREATE TABLE "system_settings" (
	"id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"timezone" varchar(100),
	"currency" varchar(20),
	"language" varchar(50),
	"fiscal_year" varchar(20)
);
CREATE TABLE "user_badges" (
	"id" uuid PRIMARY KEY,
	"badge_id" uuid,
	"user_id" uuid,
	"awarded_on" date
);
CREATE TABLE "user_challenges" (
	"id" uuid PRIMARY KEY,
	"challenge_id" uuid,
	"user_id" uuid,
	"progress" numeric,
	"completed" boolean,
	"earned_points" integer,
	"completed_at" timestamp
);
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY,
	"organization_id" uuid,
	"full_name" varchar(255),
	"email" varchar(255) CONSTRAINT "users_email_key" UNIQUE,
	"department" varchar(100),
	"designation" varchar(100),
	"role" varchar(50),
	"status" varchar(30),
	"joined_date" date,
	"created_at" timestamp DEFAULT now()
);
CREATE UNIQUE INDEX "activity_logs_pkey" ON "activity_logs" ("log_id");
CREATE UNIQUE INDEX "audit_findings_pkey" ON "audit_findings" ("finding_id");
CREATE UNIQUE INDEX "audits_pkey" ON "audits" ("audit_id");
CREATE UNIQUE INDEX "badges_pkey" ON "badges" ("badge_id");
CREATE UNIQUE INDEX "carbon_emissions_pkey" ON "carbon_emissions" ("emission_id");
CREATE UNIQUE INDEX "challenges_pkey" ON "challenges" ("challenge_id");
CREATE UNIQUE INDEX "compliance_checks_pkey" ON "compliance_checks" ("compliance_id");
CREATE UNIQUE INDEX "csr_projects_pkey" ON "csr_projects" ("project_id");
CREATE UNIQUE INDEX "emission_reductions_pkey" ON "emission_reductions" ("reduction_id");
CREATE UNIQUE INDEX "employee_participation_pkey" ON "employee_participation" ("participation_id");
CREATE UNIQUE INDEX "employee_wellness_pkey" ON "employee_wellness" ("wellness_id");
CREATE UNIQUE INDEX "esg_goals_pkey" ON "esg_goals" ("goal_id");
CREATE UNIQUE INDEX "esg_score_history_pkey" ON "esg_score_history" ("history_id");
CREATE UNIQUE INDEX "esg_scores_pkey" ON "esg_scores" ("score_id");
CREATE UNIQUE INDEX "leaderboard_pkey" ON "leaderboard" ("id");
CREATE UNIQUE INDEX "notification_settings_pkey" ON "notification_settings" ("id");
CREATE UNIQUE INDEX "organizations_pkey" ON "organizations" ("organization_id");
CREATE UNIQUE INDEX "policies_pkey" ON "policies" ("policy_id");
CREATE UNIQUE INDEX "report_templates_pkey" ON "report_templates" ("template_id");
CREATE UNIQUE INDEX "reports_pkey" ON "reports" ("report_id");
CREATE UNIQUE INDEX "system_settings_pkey" ON "system_settings" ("id");
CREATE UNIQUE INDEX "user_badges_pkey" ON "user_badges" ("id");
CREATE UNIQUE INDEX "user_challenges_pkey" ON "user_challenges" ("id");
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE UNIQUE INDEX "users_pkey" ON "users" ("user_id");
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("audit_id");
ALTER TABLE "audits" ADD CONSTRAINT "audits_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "carbon_emissions" ADD CONSTRAINT "carbon_emissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id");
ALTER TABLE "carbon_emissions" ADD CONSTRAINT "carbon_emissions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("policy_id");
ALTER TABLE "csr_projects" ADD CONSTRAINT "csr_projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "emission_reductions" ADD CONSTRAINT "emission_reductions_emission_id_fkey" FOREIGN KEY ("emission_id") REFERENCES "carbon_emissions"("emission_id");
ALTER TABLE "employee_participation" ADD CONSTRAINT "employee_participation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "csr_projects"("project_id");
ALTER TABLE "employee_participation" ADD CONSTRAINT "employee_participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "employee_wellness" ADD CONSTRAINT "employee_wellness_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "esg_goals" ADD CONSTRAINT "esg_goals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "esg_score_history" ADD CONSTRAINT "esg_score_history_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "esg_scores" ADD CONSTRAINT "esg_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "policies" ADD CONSTRAINT "policies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "policies" ADD CONSTRAINT "policies_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("user_id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("user_id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("badge_id");
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("challenge_id");
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id");