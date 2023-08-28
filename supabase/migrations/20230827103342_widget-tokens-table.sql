create table "public"."WidgetTokens" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "token" text not null,
    "UserId" uuid not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


alter table "public"."WidgetTokens" enable row level security;

CREATE UNIQUE INDEX "WidgetTokens_pkey" ON public."WidgetTokens" USING btree (id);

alter table "public"."WidgetTokens" add constraint "WidgetTokens_pkey" PRIMARY KEY using index "WidgetTokens_pkey";

alter table "public"."WidgetTokens" add constraint "WidgetTokens_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"(id) ON DELETE CASCADE not valid;

alter table "public"."WidgetTokens" validate constraint "WidgetTokens_UserId_fkey";


