import { Switch, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar/Navbar';
import Clases from './components/Clases/Clases';
import Clase from './components/Clase/Clase';
import Foro from './components/Foro/Foro';
import Comentarios from './components/Comentarios/Comentarios';
import Game from './components/Game/Game'
import Quiz from './components/Quiz/Quiz'
import Asesorias from './components/Asesorias/Asesorias'
import Stomp from './components/Stomp/Stomp'

const App = () => (
	<div>
		<Navbar />

		<Switch>
			<Route path='/clases/clase/:id/quiz/:id' component={Quiz} />
			<Route path='/clases/clase/:id/game/:id' component={Game} />
			<Route path='/clases/clase/:id' component={Clase} />
			<Route path='/clases' component={Clases} />
			
			<Route path='/asesorias/asesoria/:id'  component={Stomp} />
			<Route path='/asesorias' component={Asesorias} />

			<Route path='/foro/pregunta/:id' component={Comentarios} />
			<Route path='/foro' component={Foro} />
			
			<Route path='/' />
		</Switch>
	</div>
);

export default App;

