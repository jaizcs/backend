'use strict';

export class HttpError extends Error {
	constructor(code, message, cause) {
		super(message, {
			cause,
		});

		FineTuningJobsPage.code = code;
	}

	toJSON() {
		return {
			message: this.message,
		};
	}
}
