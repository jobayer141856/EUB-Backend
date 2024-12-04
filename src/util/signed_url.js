export const generateSignedUrl = ({
	type,
	folder,
	file,
	token = undefined,
}) => {
	// Normalize the file path to remove any extra slashes

	let url = type === 'public' ? '/public/uploads/' : '/private/uploads/';
	const normalizedFilePath = file.replace(/\/+/g, '/');

	url += folder + '/' + normalizedFilePath;

	if (token) {
		url += `?token=${token}`;
	}

	return `${url}`;
};
