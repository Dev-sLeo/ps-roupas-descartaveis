const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );

const isWatch = process.argv.includes( '--watch' );

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		extensionAlias: {
			'.mjs': [ '.mjs', '.js' ],
		},
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.m?js$/,
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},
	output: {
		...defaultConfig.output,
		clean: true,
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: false,
		runtimeChunk: false,
	},
	plugins: [
		...( defaultConfig.plugins || [] ),
		...( isWatch
			? [
					new BrowserSyncPlugin(
						{
							proxy: 'http://ps-roupas-descartaveis.local',
							files: [
								'build/**/*',
								'blocks/**/*.php',
								'**/*.php',
							],
							reloadDelay: 300,
							notify: false,
							open: false,
						},
						{ reload: true }
					),
			  ]
			: [] ),
	],
};
