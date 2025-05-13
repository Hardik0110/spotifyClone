import express from 'express';
import { stringify } from 'querystring';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8888;
const host = '0.0.0.0'; // Listen on all network interfaces
const networkIP = '192.168.1.19';
const reactAppUrl = 'https://localhost:5173';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const client_id = 'f29485f82aba428f9f058c89fa168371';
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

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect(`${reactAppUrl}/callback?error=state_mismatch`);
    } else {
        // Redirect to React app with the code as a query parameter
        res.redirect(`${reactAppUrl}/callback?code=${code}`);
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