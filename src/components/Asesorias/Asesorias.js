import { Link } from 'react-router-dom';

const Asesoria = () => {
	return (
		<div className='container'>
			<h3 className='mb-4'>Asesorias de C.T.A.</h3>

			<div className='card-deck'>
				<div className='card'>
					<div className='card-body'>
						<h5 className='card-title'>Los sentidos</h5>
						
						<p className='card-text'>Hablemos de los sentidos</p>
						
						<Link
							to={{
								pathname: '/asesorias/asesoria/0',
								contenido: []
							}}
							className='card-link'
						>
							Ir a la asesoría
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Asesoria;
