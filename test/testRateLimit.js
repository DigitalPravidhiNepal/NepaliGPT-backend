import axios from 'axios';

const BASE_URL = 'http://localhost:3030/api/v1'; // Change to your API URL

async function testRateLimit() {
    let status429Received = false;

    for (let i = 0; i < 12; i++) {
        try {
            const res = await axios.get(`${BASE_URL}`);
            console.log(`Request ${i + 1}:`, res.status);
        } catch (error) {
            if (error.response?.status === 429) {
                console.log(`Rate limit exceeded at request ${i + 1}`);
                status429Received = true;
                break;
            }
        }
    }

    if (status429Received) {
        console.log('✅ Rate limiting is working');
    } else {
        console.log('❌ Rate limiting is NOT working');
    }
}

testRateLimit();
