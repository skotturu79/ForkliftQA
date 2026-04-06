const cds = require('@sap/cds');
const path = require('path');
const express = require('express');

async function start() {
    cds.env.requires.auth = { kind: 'dummy' };
    cds.model = await cds.load(path.join(__dirname, 'catalog-service.cds'));

    const app = express();
    app.use('/app', express.static(path.join(__dirname, 'app')));
    app.get('/', (req, res) => res.redirect('/app/index.html'));

    await cds.connect.to('db');
    await cds.serve('all').from(cds.model).in(app);

    const port = process.env.PORT || 4004;
    app.listen(port, () => console.log(`ForkQA server listening on port ${port}`));
}

start().catch(err => { console.error('Failed to start:', err); process.exit(1); });
