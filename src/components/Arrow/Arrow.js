import './Arrow.css';

const Arrow = ({ clicked, direccion, disable }) => (
	<i
		onClick={clicked}
		className={`fas fa-play arrow arrow-${direccion} ${disable}`}
	></i>
);

export default Arrow;