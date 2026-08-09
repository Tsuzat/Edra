import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

const RANDOM_COLORS = [
	'#6D28D9',
	'#7C3AED',
	'#4F46E5',
	'#2563EB',
	'#0284C7',
	'#0891B2',
	'#0D9488',
	'#0F766E',
	'#15803D',
	'#16A34A',
	'#65A30D',
	'#CA8A04',
	'#B45309',
	'#EA580C',
	'#DC2626',
	'#B91C1C',
	'#BE123C',
	'#E11D48',
	'#DB2777',
	'#C026D3',
	'#9333EA',
	'#7E22CE',
	'#86198F',
	'#9F1239'
] as const;

const RANDOM_NAMES = [
	'Lea Thompson',
	'Cyndi Lauper',
	'Tom Cruise',
	'Madonna',
	'Jerry Hall',
	'Joan Collins',
	'Winona Ryder',
	'Christina Applegate',
	'Alyssa Milano',
	'Molly Ringwald',
	'Ally Sheedy',
	'Debbie Harry',
	'Olivia Newton-John',
	'Elton John',
	'Michael J. Fox',
	'Axl Rose',
	'Emilio Estevez',
	'Ralph Macchio',
	'Rob Lowe',
	'Jennifer Grey',
	'Mickey Rourke',
	'John Cusack',
	'Matthew Broderick',
	'Justine Bateman',
	'Lisa Bonet'
] as const;

/** O(1) random pick — avoids `Array#at` polyfill and narrows return type */
function getRandomElement<const T>(list: readonly T[]): T {
	return list[Math.floor(Math.random() * list.length)] as T;
}

export const getRandomColor = (): string => getRandomElement(RANDOM_COLORS);
export const getRandomName = (): string => getRandomElement(RANDOM_NAMES);
export const getRandomUser = () => ({ name: getRandomName(), color: getRandomColor() });
