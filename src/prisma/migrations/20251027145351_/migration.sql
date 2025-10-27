-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROCESSING', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "basket" (
    "id" UUID NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "user_id" UUID NOT NULL,

    CONSTRAINT "basket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basket_items" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "basket_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "basket_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "user_id" UUID,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "id" UUID NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "city" TEXT,
    "street" TEXT,
    "date_of_delivery" TEXT,
    "order_id" UUID,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "basket_user_id_key" ON "basket"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_order_id_key" ON "shipping"("order_id");

-- AddForeignKey
ALTER TABLE "basket" ADD CONSTRAINT "basket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_basket_id_fkey" FOREIGN KEY ("basket_id") REFERENCES "basket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
