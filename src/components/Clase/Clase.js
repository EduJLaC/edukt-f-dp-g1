import { useState, useEffect } from 'react';

import { gifs } from './gifs';
import './Clase.css';
import Arrow from '../Arrow/Arrow';

const Clase = ({ location, history, match }) => {
	const [contenido, setContenido] = useState([]);
	const [counter, setCounter] = useState(0);
	const [images] = useState(gifs);

	useEffect(() => {
		if (location.contenido) setContenido(location.contenido);
		else history.push('/clases');
	}, [history, location.contenido]);

	const handleNextSeccion = () => {
		if (counter < 14) setCounter((prevState) => prevState + 1);
	};

	const handlePrevSeccion = () => {
		if (counter > 0) setCounter((prevState) => prevState - 1);
	};

	const handleStartQuiz = () => {
		history.push(`${location.pathname}/game/${match.params.id}`);
	};

	if (!contenido.length) return <h1>Cargando</h1>;

	return (
		<div className='container'>
			<div className='clase'>
				{counter === 14 ? (
					<div className='congrats-container'>
						<p className='texto congrats'>
							🎉🎉 FELICIDADES FINALIZASTE LA CLASE 🎉🎉
						</p>
					</div>
				) : (
					<div className='infoContainer'>
						{counter < 14 && (
							<div className='container-img mb-4 '>
								<img src={images[counter]} alt='' />
							</div>
						)}

						<p className='texto'>{contenido[counter].contenido}</p>
					</div>
				)}

				<Arrow
					clicked={handlePrevSeccion}
					direccion='left'
					disable={counter === 0 ? 'disable' : ''}
				/>
				<Arrow
					clicked={handleNextSeccion}
					direccion='right'
					disable={counter === 14 ? 'disable' : ''}
				/>

				{counter === 14 ? (
					<button
						className='btn btn-outline-primary next'
						onClick={handleStartQuiz}
					>
						Iniciar Juego
					</button>
				) : null}
			</div>
		</div>
	);
};

export default Clase;
