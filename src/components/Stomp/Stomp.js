import React, { useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs';

import { generateName } from '../../funciones/funciones';
import styles from './Stomp.module.css'

let client = null;
let updatedMensajes = [];
let subscriptionUsers = null;
let subscriptionMensajes = null;

const Stomp = () => {
	const [from] = useState(generateName());
	const [recipient, setRecipient] = useState('');
	const [usuariosActivos, setUsuariosActivos] = useState([])
	const [mensajes, setMensajes] = useState([]);
	const [mensaje, setMensaje] = useState('');

	useEffect(() => {
		connect();

		return () => disconnect();
	}, [])

	const connect = async () => {
		const res = await fetch('https://pp-edukt-back.herokuapp.com/edukt/rest/user-connect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: from })
		});

		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;

			throw new Error(message);
		}

		client = new Client({
			brokerURL: 'wss://pp-edukt-back.herokuapp.com/edukt/chat',
			debug: (str) => {
				console.log(str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.onConnect = frame => {
			updateUsers(from);

			subscriptionUsers = client.subscribe('/topic/active', () => {
				// console.log(username);
				updateUsers(from);
			});

			subscriptionMensajes = client.subscribe(`/user/${from}/message`, (message) => {
				updatedMensajes.push(JSON.parse(message.body))
				setMensajes([...updatedMensajes]);
			});
		};

		client.onStompError = ({ headers, body }) => {
			console.log(`Broker reported error: ${headers['message']}`);
			console.log(`Additional details: ${body}`);
		}

		client.activate();
	};

	const updateUsers = async (userName) => {
		// setUsuariosActivos([]);
		const res = await fetch(`https://pp-edukt-back.herokuapp.com/edukt/rest/active-users-except/${userName}`);
		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}
		const data = await res.json();
		if (!data.find(d => d === recipient)) {
			setRecipient('');
		}
		setUsuariosActivos(data);
	}

	const disconnect = async () => {
		/*const res = await fetch('https://pp-edukt-back.herokuapp.com/edukt/rest/user-disconnect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: from })
		});
		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}*/

		client.onDisconnect = frame => {
			subscriptionUsers.unsubscribe();
			subscriptionMensajes.unsubscribe();

			const res = await fetch('https://pp-edukt-back.herokuapp.com/edukt/rest/user-disconnect', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: from })
			});
			if (!res.ok) {
				const message = `An error has occured: ${res.status}`;
				throw new Error(message);
			}

		}

		client.onWebSocketClose = frame => {
			setUsuariosActivos([]);
			setRecipient('');
			setMensaje('')
			updatedMensajes = []
			setMensajes([...updatedMensajes])
		}

		client.deactivate();
	}

	const handleChangeMessage = e => setMensaje(e.target.value)

	const handleSendMessage = () => {
		if (mensaje !== '') {
			client.publish({
				destination: '/app/chat',
				body: JSON.stringify({
					from: from,
					text: mensaje,
					recipient: recipient
				}),
				headers: {
					sender: from
				}
			});
			setMensaje('');
		}
	}

	const handleDisconnectChat = () => disconnect();

	const selectUser = (user) => setRecipient(user);

	return (
		<div className='container'>
			<div className='row'>
				<div className="col-md-6">
					<div className='d-flex align-items-center mb-4'>
						<h4 style={{ margin: '0 2rem 0 0' }}>Username: {from}</h4>
						<button className='btn btn-danger' onClick={handleDisconnectChat}>Desconectarse</button>
					</div>

					<div className='mb-4'>
						{usuariosActivos.length > 0 && usuariosActivos.map(user => (<button onClick={() => selectUser(user)} className='btn btn-outline-success mr-2' key={user}>{user}</button>))}
					</div>

					<div>
						<p>Enviar mensaje a <span className="badge badge-secondary">{recipient}</span></p>
						<div className='input-group'>
							<input onChange={handleChangeMessage} type="text" className="form-control" placeholder="Mensaje" value={mensaje} />

							<div className="input-group-append">
								<button onClick={handleSendMessage} className="btn btn-primary" type="button">Button</button>
							</div>
						</div>
					</div>
				</div>

				<div className={["col-md-6", styles['chat-container']].join(' ')}>
					{mensajes.length > 0 && mensajes.map((chat, index) => (
						<div key={index} className={`alert alert-${chat.from === from ? 'info' : 'warning'} mb-2 d-flex justify-content-between align-items-center`}>
							<div style={{ maxWidth: '50%', height: 'auto', wordBreak: 'break-word' }}>
								{chat.text}
							</div>

							<span style={{ width: '40%', textAlign: 'right' }}>[<span style={{ color: '#007BFF' }}>{chat.from}</span> {chat.time}]</span>
						</div>
					))}

				</div>
			</div>
		</div>
	)
}

export default Stomp;