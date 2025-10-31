import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Route Guard per proteggere le rotte con autenticazione JWT.
 * Controlla se il token è presente e valido; altrimenti reindirizza a login.
 */
export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const accessToken = localStorage.getItem('accessToken');

	// 1. Nessun token → login
	if (!accessToken) {
		router.navigate(['login']);
		return false;
	}

	try {
		// 2. Decodifica token
		const decoded: any = jwtDecode(accessToken);
		const now = Math.floor(Date.now() / 1000);

		// 3. Controlla scadenza
		if (decoded.exp < now) {
			console.warn('⚠️ Token scaduto, reindirizzo al login.');
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('username');
			localStorage.removeItem('userEmail');
			router.navigate(['login']);
			return false;
		}

		// Token valido
		return true;
	} catch (err) {
		console.error('❌ Token non valido:', err);
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('username');
		localStorage.removeItem('userEmail');
		router.navigate(['login']);
		return false;
	}
};
