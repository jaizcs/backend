create policy "messages_authenticated_all"
on "public"."Messages"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "tickets_authenticated_all"
on "public"."Tickets"
as permissive
for all
to authenticated
using (true)
with check (true);



