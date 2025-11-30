-- CreateTable
CREATE TABLE "review" (
    "id" UUID NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
