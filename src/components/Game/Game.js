import { useState, useEffect } from 'react';

import styles from './Quiz.module.css';

const Game = ({ history, match }) => {
  const [level, setLevel] = useState('shuffle');
  const [contenidos, setContenidos] = useState([]);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const getContent = async () => {
      const response = await fetch(`https://pp-edukt-back.herokuapp.com/edukt/gamesCTA1G/?temaId=60031417eadee971f6ffd2ad&level=${level}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;

        throw new Error(message);
      }

      const { contents } = await response.json();

      setContenidos(contents);
    }

    getContent();

    return () => {
      clearInterval(clearMessage);
    }
  }, [level]);

  const handleChangeLevel = e => {
    if (e.target.value !== level) setLevel(e.target.value);
  };

  const handleSendWords = e => {
    e.preventDefault();

    const data = new FormData(e.target);

    const sendData = [];

    for (let value of data.values()) {
      sendData.push(value);
    }

    fetch(
      'https://pp-edukt-back.herokuapp.com/edukt/gamesCTA1G/validar/?temaId=60031417eadee971f6ffd2ad',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
      }
    )
      .then(res => res.json())
      .then(data => {
        const preguntasIncorrectas = [];

        data.forEach((val, i) => {
          if (val === false) {
            preguntasIncorrectas.push(i);
          }
        });

        if (preguntasIncorrectas.length) {
          let mensaje = '';

          if (preguntasIncorrectas.length === 1) {
            mensaje = `Te equivocaste en la palabra ${preguntasIncorrectas.map(
              p => p + 1
            )}`;
          } else {
            mensaje = 'Te equivocaste en las palabras ';
            preguntasIncorrectas.forEach((v, i) => {
              if (i === 0) {
                mensaje += `${v + 1} `;
              } else {
                mensaje += `y ${v + 1} `;
              }
            });
          }

          setMessage(mensaje);
        } else {
          setMessage('Correcto!');
          setIsComplete(true);
        }

        clearMessage();
      })
      .catch(error => console.log(error));
  };

  const clearMessage = () => setTimeout(() => {
    setMessage('');
  }, 1500);

  const splitText = texto =>
    texto.split(/\[|\]/).map((text, index) => {
      if (text === '*') {
        text = <input name={index} key={index} type='text' />;
      }
      return <span key={index}>{text}</span>;
    });

  const handleRedirectQuiz = () => {
    const { id } = match.params;
    history.push(`/clases/clase/${id}/quiz/${id}`);
  }

  return (
    <div className={['container', styles.quiz].join(' ')}>
      {!contenidos.length ? (
        <p>Cargando...</p>
      ) : (
          <>
            <h1 className='text-center mb-4'>Y ahora juguemos...</h1>

            {
              message === '' ? null : (<div
                className={`alert ${message === 'Correcto!' ? 'alert-success' : 'alert-danger'
                  }`}
                role='alert'
              >
                {message}
              </div>)
            }
            <form action='' onSubmit={handleSendWords}>
              {
                contenidos.map(contenido => {
                  return (
                    <div key={contenido.description}>
                      <h3>Oración</h3>


                      <p>{splitText(contenido.description)}</p>

                      <h3 className='mt-1'>Palabras</h3>

                      <div className='mb-4'>
                        {
                          contenido.words.map(word => {
                            return (
                              <button key={word} className='btn btn-success mr-2' value='word'>
                                {word}
                              </button>
                            )
                          })
                        }
                      </div>
                    </div>
                  )
                })
              }

              <button className='btn btn-secondary'>Validar</button>

            </form>

            <div className='mt-4 mb-4'>
              <h3 className='mb-2'>Nivel de dificultad</h3>

              <button
                className='btn btn-primary mr-2'
                onClick={handleChangeLevel}
                value='shuffle'
              >
                Fácil
              </button>

              <button
                className='btn btn-primary mr-2'
                onClick={handleChangeLevel}
                value='hide'
              >
                Intermedio
              </button>

              <button
                className='btn btn-primary'
                onClick={handleChangeLevel}
                value='both'
              >
                Difícil
              </button>
            </div>

            {
              isComplete ? <button onClick={handleRedirectQuiz} className='btn btn-outline-secondary'>Iniciar Quiz</button> : null
            }
          </>
        )}
    </div>
  );
};

export default Game;