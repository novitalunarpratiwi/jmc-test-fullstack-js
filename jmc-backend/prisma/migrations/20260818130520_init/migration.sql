-- CreateEnum
CREATE TYPE "role_permission_read" AS ENUM ('All', 'Own', 'No');

-- CreateEnum
CREATE TYPE "role_permission_update" AS ENUM ('All', 'Own', 'No');

-- CreateEnum
CREATE TYPE "role_permission_delete" AS ENUM ('All', 'Own', 'No');

-- CreateEnum
CREATE TYPE "pegawai_status_kawin" AS ENUM ('kawin', 'tidak kawin');

-- CreateEnum
CREATE TYPE "pegawai_status" AS ENUM ('Aktif', 'Nonaktif');

-- CreateTable
CREATE TABLE "activities" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "ua" VARCHAR(256),
    "ip" VARCHAR(64),
    "url" TEXT,
    "browser" VARCHAR(64),
    "platform" VARCHAR(64),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_data" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100),
    "tipe" VARCHAR(50),

    CONSTRAINT "master_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_wilayah" (
    "id" SERIAL NOT NULL,
    "kecamatan" VARCHAR(100),
    "kabupaten" VARCHAR(100),
    "provinsi" VARCHAR(100),

    CONSTRAINT "master_wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pegawai" (
    "id" SERIAL NOT NULL,
    "foto_pegawai" VARCHAR(255),
    "nip" VARCHAR(30),
    "nama_pegawai" VARCHAR(255),
    "email" VARCHAR(255),
    "nomor_hp" VARCHAR(20),
    "tempat_lahir" VARCHAR(100),
    "id_kecamatan" INTEGER,
    "alamat_lengkap" TEXT,
    "jarak_rumah_kantor" SMALLINT,
    "tanggal_lahir" DATE,
    "status_kawin" "pegawai_status_kawin",
    "jumlah_anak" SMALLINT DEFAULT 0,
    "tanggal_masuk" DATE,
    "id_jabatan" INTEGER,
    "id_departemen" INTEGER,
    "usia" INTEGER,
    "status" "pegawai_status" DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pegawai_pendidikan" (
    "id" SERIAL NOT NULL,
    "id_pegawai" INTEGER,
    "tingkat_pendidikan" VARCHAR(50),
    "nama_sekolah" VARCHAR(255),
    "tahun_lulus" INTEGER,

    CONSTRAINT "pegawai_pendidikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" SERIAL NOT NULL,
    "id_role" SMALLINT,
    "modul_fitur" VARCHAR(100),
    "akses" BOOLEAN DEFAULT false,
    "create" BOOLEAN DEFAULT false,
    "read" "role_permission_read" DEFAULT 'No',
    "update" "role_permission_update" DEFAULT 'No',
    "delete" "role_permission_delete" DEFAULT 'No',

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "id_role" SMALLINT,
    "id_pegawai" INTEGER,
    "username" VARCHAR(100),
    "password_hash" VARCHAR(255),
    "nama" VARCHAR(255),
    "email" VARCHAR(255),
    "last_session" VARCHAR(255),
    "last_login" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "disabled" SMALLINT DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" SMALLSERIAL NOT NULL,
    "nama_role" VARCHAR(100),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting_tunjangan" (
    "id" SERIAL NOT NULL,
    "base_fare" DOUBLE PRECISION NOT NULL,
    "berlaku_mulai" TIMESTAMP(3) NOT NULL,
    "minimum_kilometer" DOUBLE PRECISION NOT NULL,
    "maximum_kilometer" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_tunjangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tunjangan_transport" (
    "id" SERIAL NOT NULL,
    "id_pegawai" INTEGER NOT NULL,
    "bulan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jarak_km" DOUBLE PRECISION NOT NULL,
    "jumlah_hari_masuk" INTEGER NOT NULL,
    "nominal_tunjangan" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tunjangan_transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "detail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_created_by_idx" ON "activities"("created_by");

-- CreateIndex
CREATE INDEX "activities_updated_by_idx" ON "activities"("updated_by");

-- CreateIndex
CREATE INDEX "master_wilayah_kecamatan_idx" ON "master_wilayah"("kecamatan");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nip_key" ON "pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_email_key" ON "pegawai"("email");

-- CreateIndex
CREATE INDEX "pegawai_id_departemen_idx" ON "pegawai"("id_departemen");

-- CreateIndex
CREATE INDEX "pegawai_id_jabatan_idx" ON "pegawai"("id_jabatan");

-- CreateIndex
CREATE INDEX "pegawai_id_kecamatan_idx" ON "pegawai"("id_kecamatan");

-- CreateIndex
CREATE INDEX "pegawai_pendidikan_id_pegawai_idx" ON "pegawai_pendidikan"("id_pegawai");

-- CreateIndex
CREATE INDEX "role_permission_id_role_idx" ON "role_permission"("id_role");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_id_pegawai_idx" ON "user"("id_pegawai");

-- CreateIndex
CREATE INDEX "user_id_role_idx" ON "user"("id_role");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_departemen_fkey" FOREIGN KEY ("id_departemen") REFERENCES "master_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "master_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_kecamatan_fkey" FOREIGN KEY ("id_kecamatan") REFERENCES "master_wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai_pendidikan" ADD CONSTRAINT "pegawai_pendidikan_id_pegawai_fkey" FOREIGN KEY ("id_pegawai") REFERENCES "pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_pegawai_fkey" FOREIGN KEY ("id_pegawai") REFERENCES "pegawai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
