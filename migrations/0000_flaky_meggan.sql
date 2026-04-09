CREATE TABLE "admin_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"transfer_id" varchar,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"delivered_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" text NOT NULL,
	"setting_value" json NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar NOT NULL,
	CONSTRAINT "admin_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "amortization_schedule" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_id" varchar NOT NULL,
	"payment_number" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"payment_amount" numeric(12, 2) NOT NULL,
	"principal_amount" numeric(12, 2) NOT NULL,
	"interest_amount" numeric(12, 2) NOT NULL,
	"remaining_balance" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'unpaid' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" varchar NOT NULL,
	"actor_role" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" varchar,
	"metadata" json,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"bank_name" text NOT NULL,
	"bank_country" text,
	"iban" text NOT NULL,
	"bic" text,
	"account_label" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fees" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"fee_type" text NOT NULL,
	"reason" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp,
	"related_message_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"loan_id" varchar,
	"document_type" text NOT NULL,
	"loan_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"file_url" text NOT NULL,
	"cloudinary_public_id" text,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewer_id" varchar,
	"review_notes" text
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"loan_type" text NOT NULL,
	"loan_reference" text,
	"amount" numeric(12, 2) NOT NULL,
	"interest_rate" numeric(5, 2) NOT NULL,
	"duration" integer NOT NULL,
	"status" text DEFAULT 'pending_review' NOT NULL,
	"contract_status" text DEFAULT 'none' NOT NULL,
	"funds_availability_status" text DEFAULT 'pending' NOT NULL,
	"documents" json,
	"approved_at" timestamp,
	"approved_by" varchar,
	"rejected_at" timestamp,
	"rejection_reason" text,
	"next_payment_date" timestamp,
	"total_repaid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"contract_url" text,
	"signed_contract_url" text,
	"signed_contract_cloudinary_public_id" text,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"deletion_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transfer_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_id" varchar NOT NULL,
	"event_type" text NOT NULL,
	"message" text NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transfer_validation_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_id" varchar,
	"loan_id" varchar,
	"code" text NOT NULL,
	"delivery_method" text NOT NULL,
	"code_type" text DEFAULT 'initial' NOT NULL,
	"code_context" text,
	"sequence" integer DEFAULT 1 NOT NULL,
	"pause_percent" integer,
	"fee_id" varchar,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"consumed_at" timestamp,
	CONSTRAINT "transfer_validation_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"loan_id" varchar,
	"external_account_id" varchar,
	"transfer_reference" text,
	"amount" numeric(12, 2) NOT NULL,
	"recipient" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"current_step" integer DEFAULT 1 NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"fee_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"required_codes" integer DEFAULT 1 NOT NULL,
	"codes_validated" integer DEFAULT 0 NOT NULL,
	"is_paused" boolean DEFAULT false NOT NULL,
	"pause_percent" integer,
	"pause_codes_validated" integer DEFAULT 0 NOT NULL,
	"approved_at" timestamp,
	"suspended_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_otps" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"otp_code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"verification_token_expiry" timestamp,
	"reset_password_token" text,
	"reset_password_token_expiry" timestamp,
	"full_name" text NOT NULL,
	"phone" text,
	"preferred_language" text DEFAULT 'fr' NOT NULL,
	"account_type" text DEFAULT 'business' NOT NULL,
	"company_name" text,
	"siret" text,
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"kyc_status" text DEFAULT 'pending' NOT NULL,
	"kyc_submitted_at" timestamp,
	"kyc_approved_at" timestamp,
	"max_loan_amount" numeric(12, 2) DEFAULT '500000.00',
	"suspended_until" timestamp,
	"suspension_reason" text,
	"external_transfers_blocked" boolean DEFAULT false NOT NULL,
	"transfer_block_reason" text,
	"has_seen_welcome_message" boolean DEFAULT false NOT NULL,
	"profile_photo" text,
	"notification_email_alerts" boolean DEFAULT true NOT NULL,
	"notification_transfer_updates" boolean DEFAULT true NOT NULL,
	"notification_loan_reminders" boolean DEFAULT true NOT NULL,
	"notification_marketing_emails" boolean DEFAULT false NOT NULL,
	"active_session_id" text,
	"two_factor_secret" text,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "amortization_loan_id_idx" ON "amortization_schedule" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "transfer_id_idx" ON "transfer_validation_codes" USING btree ("transfer_id");--> statement-breakpoint
CREATE INDEX "loan_id_idx" ON "transfer_validation_codes" USING btree ("loan_id");