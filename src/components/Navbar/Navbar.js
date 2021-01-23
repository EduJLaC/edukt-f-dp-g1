import { NavLink } from 'react-router-dom';

const Navbar = () => (
	<nav className='mb-4 navbar navbar-expand-lg navbar-dark bg-primary lighten-1'>
		<div className='container'>
			<NavLink className='navbar-brand' to='/'>
				EDUKT
			</NavLink>

			<button
				className='navbar-toggler'
				type='button'
				data-toggle='collapse'
				data-target='#navbarSupportedContent-555'
				aria-controls='navbarSupportedContent-555'
				aria-expanded='false'
				aria-label='Toggle navigation'
			>
				<span className='navbar-toggler-icon'></span>
			</button>

			<div className='collapse navbar-collapse' id='navbarSupportedContent-555'>
				<div className='navbar-nav mr-auto'>
					<NavLink className='nav-link' to='/clases'>
						Clases <span className='sr-only'>(current)</span>
					</NavLink>
					<NavLink className='nav-link' to='/asesorias'>
						Asesorias
					</NavLink>
					<NavLink className='nav-link' to='/foro'>
						Foro
					</NavLink>
				</div>
			</div>

			<div className='navbar-nav ml-auto nav-flex-icons'>
				<NavLink className='nav-link p-0 avatar' to='#'>
					<img
						src='https://mdbootstrap.com/img/Photos/Avatars/avatar-5.jpg'
						className='rounded-circle z-depth-0'
						height='35'
						alt=''
					/>
				</NavLink>
			</div>
		</div>
	</nav>
);

export default Navbar;
