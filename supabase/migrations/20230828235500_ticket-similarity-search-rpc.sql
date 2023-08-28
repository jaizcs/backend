set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_tickets("queryEmbedding" vector, "ticketType" character varying, "matchThreshold" double precision, "matchCount" integer)
 RETURNS TABLE(id bigint, resolution text, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  select
    t.id,
    t.resolution,
    1 - (t.embedding <=> "queryEmbedding") as similarity
  from "Tickets" t
  where 1 - (t.embedding <=> "queryEmbedding") > "matchThreshold" AND t."isSatisfactory" = true AND t.type = "ticketType" 
  order by similarity desc
  limit "matchCount";
$function$
;


