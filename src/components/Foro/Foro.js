import { useState, useEffect } from 'react';

import './Foro.css';
import { generateName, generateGrado } from '../../funciones/funciones';

const Foro = ({ history }) => {
	const [info, setInfo] = useState({
		autor: generateName(),
		texto: '',
		curso: '',
		grado: generateGrado(),
		titulo: '',
		tipo: 'pub',
	});

	const [preguntas, setPreguntas] = useState([]);

	useEffect(() => {
		getQuestions();
	}, []);

	const getQuestions = () => {
		fetch('http://localhost:8080/edukt/foro/publicaciones')
			.then((res) => res.json())
			.then((respuesta) => {
				const { data } = respuesta;
				setPreguntas(data);
			})
			.catch((error) => console.log(error));
	};

	const handleInputChange = (name) => (e) => {
		setInfo({ ...info, [name]: e.target.value });
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const data = { ...info };

		fetch('http://localhost:8080/edukt/publicaciones', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				setInfo({
					...info,
					autor: generateName(),
					titulo: '',
					texto: '',
					curso: '',
					grado: generateGrado(),
				});
				getQuestions();
			})
			.catch((error) => console.log(error));
	};

	const handleGoQuestion = (id, info) => {
		history.push({ pathname: `/foro/pregunta/${id}`, info: info });
	};

	const questions = preguntas.map((pregunta, index) => (
		<tr
			key={index}
			onClick={() => handleGoQuestion(pregunta.id, pregunta)}
			style={{ cursor: 'pointer' }}
		>
			<th>{pregunta.titulo}</th>
			<th>{pregunta.texto}</th>
			<th>{pregunta.grado}</th>
			<th>{pregunta.curso}</th>
			<th>{pregunta.autor}</th>
		</tr>
	));

	return (
		<div className='container'>
			<div className='mb-4'>
				<div className='form-row mb-4'>
					<div className='col-md-8 has-search'>
						<span className='fa fa-search form-control-feedback'></span>
						<input type='text' className='form-control' placeholder='Buscar' />
					</div>

					<div className='col-md-2'>
						<select name='' id='' className='form-control'>
							<option value=''>Grado</option>
						</select>
					</div>

					<div className='col-md-2'>
						<select name='' id='' className='form-control'>
							<option value=''>Curso</option>
						</select>
					</div>
				</div>

				<table className='table table-hover'>
					<thead>
						<tr>
							<th scope='col'>Titulo</th>
							<th scope='col'>Pregunta</th>
							<th scope='col'>Grado</th>
							<th scope='col'>Curso</th>
							<th scope='col'>Autor</th>
						</tr>
					</thead>
					<tbody>{preguntas.length ? questions : null}</tbody>
				</table>

				{preguntas.length ? null : 'Cargando...'}
			</div>

			<h3>Pregunta algo</h3>

			<form action='' onSubmit={handleFormSubmit}>
				<input type='hidden' value={info.autor} />
				<input type='hidden' value={info.grado} />

				<div className='form-row'>
					<div className='col-md-4 form-group'>
						<label htmlFor='titulo'>Título</label>
						<input
							className='form-control'
							id='titulo'
							name='titulo'
							onChange={handleInputChange('titulo')}
							placeholder='Titulo de la pregunta'
							type='text'
							value={info.titulo}
						/>
					</div>

					<div className='col-md-12 form-group'>
						<label htmlFor='comment-area'>Pregunta</label>
						<textarea
							className='form-control'
							name='texto'
							id='comment-area'
							onChange={handleInputChange('texto')}
							rows='3'
							value={info.texto}
						></textarea>
					</div>

					<div className='col-md-3 form-group'>
						<label htmlFor='curso'>Curso</label>
						<select
							name='curso'
							className='form-control'
							onChange={handleInputChange('curso')}
							value={info.curso}
						>
							<option value='' disabled>
								Seleccione un curso
							</option>
							<option value='CTA'>Ciencia, Tecnología y Ambiente</option>
							<option value='Ciencias Sociales'>Ciencias Sociales</option>
							<option value='Comunicación'>Comunicación</option>
							<option value='Inglés'>Inglés</option>
							<option value='Matematicas'>Matemáticas</option>
						</select>
					</div>
				</div>

				<button className='btn btn-primary'>Publicar</button>
			</form>
		</div>
	);
};

export default Foro;
