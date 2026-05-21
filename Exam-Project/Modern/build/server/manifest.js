const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CAlzqw_c.js",app:"_app/immutable/entry/app.BiVCu6-1.js",imports:["_app/immutable/entry/start.CAlzqw_c.js","_app/immutable/chunks/B-bvReI8.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/entry/app.BiVCu6-1.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DzmgPRBM.js')),
			__memo(() => import('./chunks/1-DOyllpEM.js')),
			__memo(() => import('./chunks/2-Cq7Qvrln.js')),
			__memo(() => import('./chunks/3-BVyiY1yX.js')),
			__memo(() => import('./chunks/4-6TnZSi9h.js')),
			__memo(() => import('./chunks/5-Q_Q6k4xq.js')),
			__memo(() => import('./chunks/6-CQyfaEjU.js')),
			__memo(() => import('./chunks/7-CVB53UAq.js')),
			__memo(() => import('./chunks/8-XmpvEn6A.js')),
			__memo(() => import('./chunks/9-CeMXLqyE.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/(admin)/brands",
				pattern: /^\/brands\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(admin)/categories",
				pattern: /^\/categories\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BY8MPKhU.js'))
			},
			{
				id: "/(admin)/orders",
				pattern: /^\/orders\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(admin)/products",
				pattern: /^\/products\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(admin)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
