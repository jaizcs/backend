'use strict';

import { app } from '../app.js';
import { PORT } from '../config.js';

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
