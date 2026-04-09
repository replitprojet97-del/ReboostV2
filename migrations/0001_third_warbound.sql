CREATE TABLE "chat_conversations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"assigned_admin_id" varchar,
	"subject" text,
	"status" text DEFAULT 'open' NOT NULL,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_type" text NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"file_url" text,
	"file_name" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_presence" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'offline' NOT NULL,
	"last_seen" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_messages" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "admin_messages" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "transfer_id" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_tier" text DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "completed_loans_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "defaulted_loans_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "chat_conversations_user_id_idx" ON "chat_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_admin_id_idx" ON "chat_conversations" USING btree ("assigned_admin_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_status_idx" ON "chat_conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_messages_conversation_id_idx" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_messages_sender_id_idx" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_receiver_id_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("sender_id","receiver_id","created_at");