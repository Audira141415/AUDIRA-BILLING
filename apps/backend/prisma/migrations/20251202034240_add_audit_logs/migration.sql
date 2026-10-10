-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL PRIMARY KEY,
    "action" VARCHAR(100) NOT NULL,
    "user_id" INTEGER,
    "user_email" VARCHAR(255),
    "entity_type" VARCHAR(100),
    "entity_id" VARCHAR(255),
    "details" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" TEXT,
    "status" VARCHAR(20) DEFAULT 'SUCCESS',
    "error_message" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CreateIndex
CREATE INDEX "idx_audit_logs_action" ON "audit_logs"("action");
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs"("created_at");
CREATE INDEX "idx_audit_logs_status" ON "audit_logs"("status");