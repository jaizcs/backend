create type "public"."UserRole" as enum('admin', 'staff');

create table
    "public"."Users" (
        "id" uuid not null default gen_random_uuid (),
        "email" character varying not null,
        "password" text not null,
        "name" character varying not null,
        "role" "UserRole" not null default 'staff'::"UserRole",
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now()
    );

alter table "public"."Users" enable row level security;

create unique index "Users_email_key" on public."Users" using btree (email);

create unique index "Users_pkey" on public."Users" using btree (id);

alter table "public"."Users"
add constraint "Users_pkey" primary key using index "Users_pkey";

alter table "public"."Users"
add constraint "Users_email_key" unique using index "Users_email_key";