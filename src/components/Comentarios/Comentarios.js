import { useState, useEffect } from 'react';

import './Comentarios.css';
import { generateName } from '../../funciones/funciones';

const Comentarios = ({ location, history }) => {
	const [autorComment] = useState(generateName());
	const [textoComment, setTextoComment] = useState('');
	const [info, setInfo] = useState({});

	useEffect(() => {
		if (!location.info) history.push('/foro');
		else setInfo(location.info);
	}, [history, location.info]);

	const getComentarios = () => {
		fetch(`https://pp-edukt-back.herokuapp.com/edukt/foro/publicaciones/${info.id}`)
			.then((res) => res.json())
			.then((data) => {
				const { comentarios } = data.data;
				setInfo({ ...info, comentarios: comentarios });
			})
			.catch((error) => console.log(error));
	};

	const handleInputChange = (e) => {
		setTextoComment(e.target.value);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const data = {
			autor: autorComment,
			texto: textoComment,
			tipo: 'com',
		};

		fetch(`http://localhost:8080/edukt/foro/${info.id}/comentarios`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((respuesta) => {
				getComentarios();
				setTextoComment('');
			})
			.catch((error) => console.log(error));
	};

	if (!info.hasOwnProperty('comentarios'))
		return (
			<div className='container'>
				<h1>Cargando...</h1>
			</div>
		);

	const comentarios = info.comentarios.map((comentario) => {
		const comDate = new Date(comentario.fechaPub);
		const horas = comDate.getHours().toString();
		const minutos = comDate.getMinutes().toString();

		return (
			<div key={comentario.uuid} className='card mb-4'>
				<div className='card-body'>
					<span>
						{comentario.autor} .{' '}
						{`${horas}:${minutos.length > 1 ? minutos : `0${minutos}`}`}
					</span>

					<p className='card-text mt-2'>{comentario.texto}</p>
				</div>
			</div>
		);
	});

	return (
		<div className='container'>
			<div className='card mb-4'>
				<div className='card-body'>
					<span>
						Publicado por {info.autor} - {info.grado}° Grado - {info.curso}
					</span>

					<h1 className='my-4'>{info.titulo}</h1>

					<div className='d-flex justify-content-between'>
						<span>{info.comentarios.length} comentarios</span>

						<div>
							<button className='btn btn-primary mr-4'>Compartir</button>
							<button className='btn btn-danger'>Reportar</button>
						</div>
					</div>
				</div>
			</div>

			<h5 className='mb-3'>Comentar como {autorComment}</h5>

			<div className='card mb-4'>
				<div className='card-body comment-box'>
					{!info.comentarios.length ? (
						<p className='card-text'>No hay comentarios</p>
					) : (
						comentarios
					)}
				</div>
			</div>

			<h5 className='mb-3'>Comenta algo</h5>

			<form action='' onSubmit={handleFormSubmit}>
				<div className='form-row justify-content-end'>
					<div className='form-group col-md-12'>
						<textarea
							className='form-control'
							name='textoComment'
							id='comment-area'
							onChange={handleInputChange}
							rows='3'
							value={textoComment}
						></textarea>
					</div>

					<div className='col-md-auto'>
						<button type='submit' className='btn btn-primary'>
							Comentar
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Comentarios;