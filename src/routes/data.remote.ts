import { query } from '$app/server';

export const getGithubStars = query(async () => {
	let stars: number;
	try {
		const res = await fetch('https://api.github.com/repos/Tsuzat/Edra');
		const data = await res.json();
		stars = data.stargazers_count as number;
	} catch {
		stars = 0;
	}
	return stars < 1000 ? `${stars}` : `${(stars / 1000).toFixed(1)}K`;
});
