import express from 'express';
import { stringify } from 'querystring';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8888;
const host = '0.0.0.0'; // Listen on all network interfaces
const networkIP = '192.168.1.19';
const reactAppUrl = 'https://localhost:5173';

// Enable CORS
app.use(cors({
    origin: reactAppUrl,
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

const client_id = 'f29485f82aba428f9f058c89fa168371';
const client_secret = '0d2948882d7142469e6d363a34ca01b5'; // Using the same value as client_id for testing
const redirect_uri = `https://${networkIP}:${port}/callback`;

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect(`${reactAppUrl}/callback?error=state_mismatch`);
    } else {
        try {
            console.log('Exchanging code for token...');
            console.log('Code:', code);
            console.log('Redirect URI:', redirect_uri);
            
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
                },
                body: stringify({
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                })
            });

            const data = await response.json();
            console.log('Token response:', data);
            
            if (data.access_token) {
                // Send a page that sets the token in localStorage and dispatches an event
                res.send(`
                    <html>
                        <body>
                            <script>
                                localStorage.setItem('access_token', '${data.access_token}');
                                // Wait a bit to ensure the token is set
                                setTimeout(() => {
                                    window.dispatchEvent(new Event('tokenSet'));
                                    // Wait a bit more to ensure the event is processed
                                    setTimeout(() => {
                                        window.location.href = '${reactAppUrl}';
                                    }, 100);
                                }, 100);
                            </script>
                        </body>
                    </html>
                `);
            } else {
                console.error('Token exchange failed:', data);
                res.redirect(`${reactAppUrl}/callback?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(data))}`);
            }
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            res.redirect(`${reactAppUrl}/callback?error=server_error&details=${encodeURIComponent(error.message)}`);
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.crt'))
};

https.createServer(httpsOptions, app).listen(port, host, () => {
    console.log(`Server running at https://localhost:${port}`);
    console.log(`Server also accessible via your network IP at https://${networkIP}:${port}`);
}); 