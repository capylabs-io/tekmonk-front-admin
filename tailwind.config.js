
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: 'true',
			padding: '8px',
			screens: {
				'2xl': '1400px',
				xl: '1200px',
				lg: '960px',
				md: '720px',
				sm: '640px'
			}
		},
		extend: {
			colors: {
				primary: {
					'25': '#FCF7FB',
					'50': '#FBF3FA',
					'100': '#F9E7F6',
					'200': '#F5D0EF',
					'300': '#EEABE4',
					'400': '#E578D5',
					'500': '#DC58C8',
					'600': '#BC4CAC',
					'700': '#9A1595',
					'800': '#83077E',
					'900': '#5A0057',
					'950': '#320130',
					'00': '#FCF7FB',
					'05': '#FBF3FA',
					'10': '#F9E7F6',
					'20': '#F5D0EF',
					'30': '#EEABE4',
					'40': '#E578D5',
					'50': '#DC58C8',
					'60': '#BC4CAC',
					'70': '#9A1595',
					'80': '#83077E',
					'90': '#5A0057',
					'95': '#320130'
				},
				grey: {
					'25': '#FCFCFD',
					'50': '#F9FAFB',
					'100': '#F2F4F7',
					'200': '#E4E7EC',
					'300': '#D0D5DD',
					'400': '#98A2B3',
					'500': '#667085',
					'600': '#475467',
					'700': '#344054',
					'800': '#1D2939',
					'900': '#101828',
					'950': '#0C111D'
				},
				gray: {
					'00': '#FFFFFF',
					'05': '#F9FAFB',
					'10': '#F2F4F7',
					'20': '#EBE4EC',
					'30': '#DDD0DD',
					'40': '#AC9EB1',
					'50': '#7C6C80',
					'60': '#5F4C62',
					'70': '#4B3C4E',
					'80': '#2F2433',
					'90': '#241028',
					'95': '#1A0C1D'
				}
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				marquee: {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(calc(-100% - var(--gap)))'
					}
				},
				'marquee-vertical': {
					from: {
						transform: 'translateY(0)'
					},
					to: {
						transform: 'translateY(calc(-100% - var(--gap)))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				marquee: 'marquee var(--duration) infinite linear',
				'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
			},
			fontFamily: {
				sans: [
					'var(--font-kanit)',
					'sans-serif'
				],
				dela: [
					'var(--font-dela)',
					'cursive'
				],
				nutito: [
					'var(--font-nunito)',
					'cursive'
				],
				kanit: [
					'var(--font-kanit)',
					'sans-serif'
				]
			},
			boxShadow: {
				'custom-gray': '0px 4px 0px #EBE4EC',
				'custom-primary': '0px 4px 0px #9A1595',
				'custom-destructive': '0px 4px 0px #FDA29B',
				'custom-destructive-secondary': '0px 4px 0px #AD3C34'
			},
			screens: {
				mobile: '440px',
				tabletHeader: '768px'
			},
			fontSize: {
				BodyXs: [
					'12px',
					{
						lineHeight: '1rem',
						fontWeight: '300'
					}
				],
				BodySm: [
					'14px',
					{
						lineHeight: '1.25rem',
						fontWeight: '300'
					}
				],
				BodyMd: [
					'16px',
					{
						lineHeight: '1.5rem',
						fontWeight: '300'
					}
				],
				BodyLg: [
					'20px',
					{
						lineHeight: '1.75rem',
						fontWeight: '300'
					}
				],
				BodySmLink: [
					'14px',
					{
						lineHeight: '1.25rem',
						fontWeight: '300'
					}
				],
				TextLabelCaption: [
					'10px',
					{
						lineHeight: '0.75rem',
						fontWeight: '400'
					}
				],
				SubheadXs: [
					'12px',
					{
						lineHeight: '16px',
						fontWeight: '500'
					}
				],
				SubheadSm: [
					'14px',
					{
						lineHeight: '20px',
						fontWeight: '500'
					}
				],
				SubheadMd: [
					'16px',
					{
						lineHeight: '24px',
						fontWeight: '500'
					}
				],
				SubheadLg: [
					'20px',
					{
						lineHeight: '28px',
						fontWeight: '500'
					}
				],
				HeadingXs: [
					'18px',
					{
						lineHeight: '28px',
						fontWeight: '600'
					}
				],
				HeadingSm: [
					'24px',
					{
						lineHeight: '32px',
						fontWeight: '600'
					}
				],
				HeadingMd: [
					'30px',
					{
						lineHeight: '40px',
						fontWeight: '600'
					}
				],
				HeadingLg: [
					'40px',
					{
						lineHeight: '48px',
						fontWeight: '600'
					}
				],
				DisplayXs: [
					'48px',
					{
						lineHeight: '56px',
						fontWeight: '600'
					}
				],
				DisplaySm: [
					'56px',
					{
						lineHeight: '64px',
						fontWeight: '600'
					}
				],
				DisplayMd: [
					'64px',
					{
						lineHeight: '72px',
						fontWeight: '600'
					}
				],
				DisplayLg: [
					'72px',
					{
						lineHeight: '76px',
						fontWeight: '600'
					}
				],
				DisplayXl: [
					'80px',
					{
						lineHeight: '84px',
						fontWeight: '600'
					}
				]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}