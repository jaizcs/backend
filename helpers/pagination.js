'use strict';

export function usePagination({ count, page, limit }) {
	if (!limit) limit = 8;

	return {
		limit,
		rangeStart: (page - 1) * limit,
		rangeEnd: (page - 1) * limit + (limit - 1),
		pageCount: Math.ceil(count / limit),
	};
}
