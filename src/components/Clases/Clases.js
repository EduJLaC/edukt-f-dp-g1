import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Clases = () => {
	const [temas, setTemas] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8080/edukt/CTA1G')
			.then((res) => res.json())
			.then((data) => {
				const { temaCTAPrimerGradoes } = data._embedded;
				setTemas(temaCTAPrimerGradoes);
			})
			.catch((error) => console.log(error));
	}, []);

	if (!temas.length)
		return (
			<div className='container'>
				<h3>Cargando...</h3>
			</div>
		);

	const cards = temas.map((tema, index) => (
		<div key={index} className='card'>
			<div className='card-body'>
				<h5 className='card-title'>{tema.titulo}</h5>
				<p className='card-text'>{tema.descripcion}</p>
				<Link
					to={{
						pathname: `/clases/clase/${index}`,
						contenido: tema.secciones
					}}
					className='card-link'
				>
					Ir a la clase
				</Link>
			</div>
		</div>
	));

	return (
		<div className='container'>
			<h3 className='mb-4'>{temas[0].nombreCurso}</h3>

			<div className='card-deck'>{cards}</div>
		</div>
	);
};

export default Clases;
