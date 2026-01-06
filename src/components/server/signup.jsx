import axios from "axios";

import config from "../../config";

/**
 * Generates a unique device fingerprint based on browser and device characteristics
 * @function generateDeviceFingerprint
 * @returns {string} A unique device fingerprint hash
 */
function generateDeviceFingerprint() {
    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.userAgentData?.platform || navigator.platform || 'unknown',
        plugins: (() => {
            try {
                return navigator.plugins ? Array.from(navigator.plugins).map(plugin => plugin.name).join(',') : 'unknown';
            } catch (e) {
                return 'unknown';
            }
        })()
    };
    

    // Create a hash from the fingerprint object
    const fingerprintString = JSON.stringify(fingerprint);
    let hash = 0;
    
    for (let i = 0; i < fingerprintString.length; i++) {
        const char = fingerprintString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16).padStart(16, '0');
}

async function getDeviceIp() {
    try {
        const response_ip = await fetch('https://api.ipify.org?format=json');
        const data = await response_ip.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch device IP:', error);
    }
}

export async function createAccount(formValues) {
    let deviceIP = await getDeviceIp();
    const response = await axios.post(`${config.dashboardSignup}`, formValues, {
        headers: {
            'x-forwarded-for': deviceIP,
            'x-device-fingerprint': generateDeviceFingerprint(),
        }
    });
    return response.data;
}