'use client';

import styles from './page.module.css';
import { initTransport, getAppAndVersion } from '../lib/ledger.js';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

import { Stack, Group, Text } from '@mantine/core';
import { TransportOpenUserCancelled } from '@ledgerhq/errors';
import { IconUsb, IconBluetooth } from '@tabler/icons-react';

import Image from 'next/image';
import Header from '../components/header';
import { useViewportSize } from '@mantine/hooks';

async function getAppData(router, deviceType = 'usb') {
    if (deviceType === 'demo') {
        return router.push(`/wallet?deviceType=${deviceType}`);
    }

    if (deviceType !== 'usb' && deviceType !== 'bluetooth') {
        throw new Error(`Invalid device type: ${deviceType} - must be "usb" or "bluetooth"`);
    }

    try {
        /**
         * @type {Transport}
         */
        const transport = await initTransport(deviceType);
        const { name } = await getAppAndVersion(transport);

        if (name == 'Kaspa') {
            return router.push(`/wallet?deviceType=${deviceType}`);
        } else {
            notifications.show({
                title: 'Action Required',
                message: 'Please open the Kaspa app on your device.',
            });
        }
    } catch (e) {
        if (e instanceof TransportOpenUserCancelled) {
            notifications.show({
                title: 'Action Required',
                message:
                    'WebUSB is not supported in this browser. Please use a compatible browser.',
            });
        } else {
            console.error(e);
            if (e.message) {
                notifications.show({
                    title: 'Action Required',
                    message: `Could not interact with the Ledger device: ${e.message}`,
                });
            } else {
                notifications.show({
                    title: 'Action Required',
                    message: `Could not interact with the Ledger device.`,
                });
            }
        }
    }
}

export default function Home() {
    const router = useRouter();
    const { width } = useViewportSize();

    // const whitelist = ["kasvault.io", "preview.kasvault.io"];
    // let siteHostname = "kasvault.io";
    let siteHostname = 'preview.kasvault.io';

    // for (let i = 0; i < whitelist.length; i++) {
    //   if (window.location.hostname === whitelist[i]) {
    //     siteHostname = window.location.hostname;
    //     break;
    //   }
    // }

    const smallStyles = width <= 48 * 16 ? { fontSize: '1rem' } : {};

    return (
        <Stack className={styles.main}>
            <Header>
                <div>
                    Verify URL is{width <= 465 ? <br /> : <>&nbsp;</>}
                    <code>https://{siteHostname}</code>
                </div>
            </Header>

            <Group className={styles.center}>
                <Image
                    className={styles.logo}
                    src='/kasvault-full-stk.svg'
                    alt='KasVault'
                    width={180}
                    height={180}
                    priority
                />
            </Group>

            <Group>
                <Stack
                    className={styles.card}
                    onClick={() => {
                        getAppData(router, 'demo');
                    }}
                    align='center'
                >
                    <h2>
                        <Group style={smallStyles}>
                            <IconBluetooth styles={smallStyles} /> Go to Demo Mode{' '}
                            <span>-&gt;</span>
                        </Group>
                    </h2>
                    <Text>(Replaced with bluetooth in the future)</Text>
                </Stack>

                <Stack
                    className={styles.card}
                    onClick={() => {
                        getAppData(router, 'usb');
                    }}
                    align='center'
                >
                    <h2>
                        <Group style={smallStyles}>
                            <IconUsb /> Connect with USB <span>-&gt;</span>
                        </Group>
                    </h2>

                    <Text>All Nano devices</Text>
                </Stack>
            </Group>
        </Stack>
    );
}
