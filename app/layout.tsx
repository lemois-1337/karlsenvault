import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'KarlsenVault',
    description: 'The frontend interface for your Ledger device',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <ColorSchemeScript />
                <link rel='shortcut icon' href='/favicon.svg' />
            </head>
            <body className={inter.className}>
                <MantineProvider
                    defaultColorScheme='dark'
                    theme={{
                        fontFamily: 'Lato',
                        fontFamilyMonospace: 'Roboto Mono,Courier New,Courier,monospace',
                        colors: {
                            brand: [
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                                '#38B6FF',
                            ],
                        },
                        primaryColor: 'brand',
                    }}
                >
                    <Notifications />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
