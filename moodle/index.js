
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const favicon = require('serve-favicon');
const Keycloak = require('keycloak-connect');
const mysql = require('mysql');

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "moodle",
	password: "password"
});

db.connect((err) => {
	if (err) throw err;
	
	console.log("Connecté à la base de données MySQL");
});

const app = express();
const memoryStore = new session.MemoryStore();

app.set('view engine', 'ejs');
app.set('views', require('path').join(__dirname, '/view'));
app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));
app.use(session({
    secret: 'KWhjV<T=-*VW<;cC5Y6U-{F.ppK+])Ub',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
}));

const keycloak = new Keycloak({
    store: memoryStore,
});

app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
}));


const parseToken = raw => {
    if (!raw || typeof raw !== 'string') return null;

    try {
        raw = JSON.parse(raw);
        const token = raw.id_token ? raw.id_token : raw.access_token;
        const content = token.split('.')[1];

        return JSON.parse(Buffer.from(content, 'base64').toString('utf-8'));
    } catch (e) {
        console.error('Error while parsing token: ', e);
    }
};

app.get('/', keycloak.protect(), (req, res, next) => {
    const details = parseToken(req.session['keycloak-token']);
    const embedded_params = {};

    if (details) {
        embedded_params.name = details.name;
        embedded_params.email = details.email;
        embedded_params.username = details.preferred_username;
    }

    res.render('home', {
        user: embedded_params,
    });
});

app.get('/login', keycloak.protect(), (req, res) => {
    return res.redirect('/');
});

app.get('/lecture/ue1', keycloak.enforcer(['Read asset:L1'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 1 AND valide = true;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
		
    	res.render('lecture', {
		    user: embedded_params,
		    notes: result
		});
    });
});

app.get('/lecture/ue2', keycloak.enforcer(['Read asset:L2'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 2 AND valide = true;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
		
    	res.render('lecture', {
		    user: embedded_params,
		    notes: result
		});
    });
});

app.get('/lecture/ue3', keycloak.enforcer(['Read asset:L3'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 3 AND valide = true;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
		
    	res.render('lecture', {
		    user: embedded_params,
		    notes: result
		});
    });
});

app.get('/ecriture/ue1', keycloak.enforcer(['Write asset:E1'], {
    resource_server_id: 'moodle'
}), (req, res) => {	
    db.query("SELECT * FROM note WHERE ue = 1;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('ecriture', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue1"
		});
    });
});

app.post('/ecriture/ue1', keycloak.enforcer(['Write asset:E1'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let nome = req.body.nome;
    let prenome = req.body.prenome;
    let notee = req.body.notee;
    
    if (nome && prenome && notee) {
    	db.query("INSERT INTO note (nome, prenome, note, ue) VALUES (?, ?, ?, 1)", [nome, prenome, notee], (err, result) => {
    		if (err) return res.status(500).end('Error while inserting in database: ' + err);
    		
    		res.redirect('/ecriture/ue1');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

app.get('/ecriture/ue2', keycloak.enforcer(['Write asset:E2'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 2;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('ecriture', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue2"
		});
    });
});

app.post('/ecriture/ue2', keycloak.enforcer(['Write asset:E2'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let nome = req.body.nome;
    let prenome = req.body.prenome;
    let notee = req.body.notee;
    
    if (nome && prenome && notee) {
    	db.query("INSERT INTO note (nome, prenome, note, ue) VALUES (?, ?, ?, 2)", [nome, prenome, notee], (err, result) => {
    		if (err) return res.status(500).end('Error while inserting in database: ' + err);
    		
    		res.redirect('/ecriture/ue2');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

app.get('/ecriture/ue3', keycloak.enforcer(['Write asset:E3'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 3;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('ecriture', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue3"
		});
    });
});

app.post('/ecriture/ue3', keycloak.enforcer(['Write asset:E3'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let nome = req.body.nome;
    let prenome = req.body.prenome;
    let notee = req.body.notee;
    
    if (nome && prenome && notee) {
    	db.query("INSERT INTO note (nome, prenome, note, ue) VALUES (?, ?, ?, 3)", [nome, prenome, notee], (err, result) => {
    		if (err) return res.status(500).end('Error while inserting in database: ' + err);
    		
    		res.redirect('/ecriture/ue2');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

app.get('/valider/ue1', keycloak.enforcer(['Validate asset:V1'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 1;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('validation', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue1"
		});
    });
});

app.post('/valider/ue1', keycloak.enforcer(['Validate asset:V1'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let idnote = req.body.idnote;
    let validation;
    if (req.body.validation == "valide") {
    	validation = true;
    } else {
    	validation = false;
    }
    
    if (idnote) {
    	db.query("UPDATE note SET valide = ? WHERE idnote = ?;", [validation, idnote], (err, result) => {
    		if (err) return res.status(500).end('Error while updating in database: ' + err);
    		
    		res.redirect('/valider/ue1');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

app.get('/valider/ue2', keycloak.enforcer(['Validate asset:V2'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 2;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('validation', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue2"
		});
    });
});

app.post('/valider/ue2', keycloak.enforcer(['Validate asset:V2'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let idnote = req.body.idnote;
    let validation;
    if (req.body.validation == "valide") {
    	validation = true;
    } else {
    	validation = false;
    }
    
    if (idnote) {
    	db.query("UPDATE note SET valide = ? WHERE idnote = ?;", [validation, idnote], (err, result) => {
    		if (err) return res.status(500).end('Error while updating in database: ' + err);
    		
    		res.redirect('/valider/ue2');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

app.get('/valider/ue3', keycloak.enforcer(['Validate asset:V3'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    db.query("SELECT * FROM note WHERE ue = 3;", (err, result) => {
    	if (err) return res.status(500).end('Error while reading database: ' + err);
    	
    	const details = parseToken(req.session['keycloak-token']);
		const embedded_params = {};

		if (details) {
		    embedded_params.name = details.name;
		    embedded_params.email = details.email;
		    embedded_params.username = details.preferred_username;
		}
    	
		res.render('validation', {
		    user: embedded_params,
		    notes: result,
		    ue: "ue3"
		});
    });
});

app.post('/valider/ue3', keycloak.enforcer(['Validate asset:V3'], {
    resource_server_id: 'moodle'
}), (req, res) => {
    let idnote = req.body.idnote;
    let validation;
    if (req.body.validation == "valide") {
    	validation = true;
    } else {
    	validation = false;
    }
    
    if (idnote) {
    	db.query("UPDATE note SET valide = ? WHERE idnote = ?;", [validation, idnote], (err, result) => {
    		if (err) return res.status(500).end('Error while updating in database: ' + err);
    		
    		res.redirect('/valider/ue3');
    	});
    } else {
    	return res.status(400).end("Wrong parameters");
    }
});

const server = app.listen(3000, '127.0.0.1', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Application running at http://%s:%s', host, port);
});
