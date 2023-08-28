import { generateToken } from '../helpers/jwt.js';
import { usePagination } from '../helpers/pagination.js';

/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction } NextFunction
 */

export class TicketController {
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createTicket(req, res, next) {
		try {
			const { type, description } = req.body;

			const { data: embeddings } = await req.ai.embeddings.create({
				input: description,
				model: 'text-embedding-ada-002',
			});

			const [{ embedding }] = embeddings;

			const { data: ticket } = await req.db
				.from('Tickets')
				.insert({
					description,
					embedding,
					type,
				})
				.select('id')
				.single();

			const token = generateToken({
				id: ticket.id,
				role: 'authenticated',
				app_metadata: {
					type: 'ticket',
				},
			});

			res.status(201).json({
				id: ticket.id,
				accessToken: token,
			});
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchTickets(req, res, next) {
		try {
			const { page = 1, status } = req.query;
			const { id: userId, role: userRole } = req.user;

			const { count } = await req.db.from('Tickets').select('*', {
				count: 'exact',
				head: true,
			});

			const { limit, rangeStart, rangeEnd, pageCount } = usePagination({
				count,
				limit: 10,
				page,
			});

			const dbQuery = req.db
				.from('Tickets')
				.select(
					'id,type,description,isSatisfactory,status,resolution,UserId,createdAt,updatedAt',
				)
				.order('id', {
					ascending: false,
				})
				.limit(limit)
				.range(rangeStart, rangeEnd);

			if (userRole === 'staff') dbQuery.eq('UserId', userId);
			if (status) dbQuery.eq('status', status);

			const { data: tickets } = await dbQuery;

			res.status(200).json({
				data: tickets,
				page,
				pageCount,
				totalCount: count,
			});
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchSimilarResolution(req, res, next) {
		try {
			const { id } = req.params;
			const { data: ticket } = await req.db
				.from('Tickets')
				.select()
				.eq('id', id)
				.single();

			const description = ticket.description;
			console.log(description);
			const { data: embeddings } = await req.ai.embeddings.create({
				input: description,
				model: 'text-embedding-ada-002',
			});

			const [{ embedding }] = embeddings;

			const { data: tickets } = await req.db.rpc('match_tickets', {
				queryEmbedding: embedding,
				ticketType: ticket.type,
				matchThreshold: 0.9, // Choose an appropriate threshold for your data
				matchCount: 5, // Choose the number of matches
			});

			if (tickets?.length === 0) {
				return res.status(200).json({ resolution: null });
			}
			console.log(tickets);
			const formattedTicketDescriptions = tickets
				.map((el, i = 1) => {
					i++;
					return `${i}.${el.resolution}.`;
				})
				.join('\n');
			const prompt = `for this question bellow \n '${description}' \n chose one best answer from ${tickets.length} answer below and  only display answer without the answer number \n ${formattedTicketDescriptions}`;

			const { choices } = await req.ai.chat.completions.create({
				messages: [{ role: 'user', content: prompt }],
				model: 'gpt-3.5-turbo',
			});

			const { error } = await req.db.from('Messages').insert({
				TicketId: +id,
				message: choices[0].message.content,
				role: 'ai',
			});

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async assignCustomerSupport(req, res, next) {
		try {
			const { id: ticketId } = req.params;

			// push ticket to queue
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async resolveTicket(req, res, next) {
		try {
			const { id: ticketId } = req.params;

			const { data: ticket } = await req.db
				.from('Tickets')
				.update({
					status: 'resolved',
				})
				.eq('id', ticketId)
				.select('id,UserId')
				.single();

			// add user to customer support queue if neeeded

			res.status(200).send();
		} catch (err) {
			next(err);
		}
	}
}
