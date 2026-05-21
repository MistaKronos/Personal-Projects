
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(admin)" | "/" | "/(admin)/brands" | "/(admin)/categories" | "/login" | "/logout" | "/(admin)/orders" | "/(admin)/products" | "/(admin)/users";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/(admin)": Record<string, never>;
			"/": Record<string, never>;
			"/(admin)/brands": Record<string, never>;
			"/(admin)/categories": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/(admin)/orders": Record<string, never>;
			"/(admin)/products": Record<string, never>;
			"/(admin)/users": Record<string, never>
		};
		Pathname(): "/" | "/brands" | "/categories" | "/login" | "/logout" | "/orders" | "/products" | "/users";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}