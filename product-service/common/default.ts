export const successHandler = (result) => {
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(result),
	};
};

export const errorHandler = (error) => {
	const {code, message} = error;

	return {
		statusCode: code || 501,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({message})
	};
};
