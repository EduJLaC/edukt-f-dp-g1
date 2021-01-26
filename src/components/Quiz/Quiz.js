import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'

import { generateName } from '../../funciones/funciones'
import styles from './Quiz.module.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formato, setFormato] = useState({
    preguntas: [],
    'quiz_id': '60033bbbc05e9c5717e1cdd3',
    username: generateName()
  });
  const [isValidado, setIsValidado] = useState(false);
  const [score, setScore] = useState(0);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isAprobado, setIsAprobado] = useState(true);
  const [profesor, setProfesor] = useState('');

  useEffect(() => {
    if (currentQuestion === 0) {
      const getQuestions = async () => {
        const response = await fetch('https://pp-edukt-back.herokuapp.com/edukt/quizzes/60033bbbc05e9c5717e1cdd3');

        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;

          throw new Error(message);
        }

        const { preguntas } = await response.json();

        setQuestions(preguntas);
      }

      getQuestions();
    } else if (currentQuestion === questions.length) {
      const validar = async () => {
        const response = await fetch('https://pp-edukt-back.herokuapp.com/edukt/quizzes/revisar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formato)
        });

        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;

          throw new Error(message);
        }

        const { puntaje, state: { estado, profesorAsignado } } = await response.json();

        if (estado === 'desaprobado') {
          setIsAprobado(false);
          setProfesor(profesorAsignado);
        }

        setScore(puntaje);
        setIsValidado(true);
      }

      validar();
    }
  }, [currentQuestion, formato]);

  const handleNextQuestion = (filtro) => {
    const { enunciado, alternativas } = questions[currentQuestion];

    const alternativasUpdated = [];

    alternativas.forEach(alternativa => alternativasUpdated.push({ ...alternativa }))

    alternativasUpdated.forEach(alternativa => {
      if (alternativa.descripcion === filtro) {
        alternativa.correcta = true;
      } else {
        alternativa.correcta = false;
      }
    });

    setFormato({
      ...formato, preguntas: [...formato.preguntas, {
        enunciado,
        alternativas: [...alternativasUpdated]
      }]
    });

    setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion + 1);
  };

  const handleGoClases = () => setIsRedirect(true);

  if (!questions.length) {
    return (
      <div className='container'>
        <p>Cargando...</p>
      </div>
    )
  }

  if (isRedirect) {
    return <Redirect to='/clases' />
  }

  return (
    <div className={['container', styles.quiz].join(' ')}>
      {
        currentQuestion === questions.length ? <div className={styles.scoreContainer}><p className={styles.textoScore}>{isValidado ? `Tu puntaje es ${score} de ${questions.length}` : 'Cargando'}</p>{!isAprobado && <span>Se te asignó el profesor {profesor}</span>}{isValidado && <button className='btn btn-primary' onClick={handleGoClases}>Ir a las clases</button>}</div> : (
          <>
            <div className='question-section'>
              <div className='question-count'>
                <span>Pregunta {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className='question-text'>
                {questions[currentQuestion].enunciado}
              </div>
            </div>

            <div className='answer-section'>
              {questions[currentQuestion].alternativas.map(
                a => {
                  const { descripcion, correcta } = a;
                  return (
                    <button
                      className='btn btn-outline-primary d-block w-100'
                      key={descripcion}
                      onClick={() => handleNextQuestion(descripcion)}
                      value={correcta}
                    >
                      {descripcion}
                    </button>
                  )
                }
              )}
            </div>
          </>
        )
      }
    </div>
  );
};

export default Quiz;