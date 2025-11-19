import React, { useState } from 'react';

const PreoperativeEvaluation: React.FC = () => {
  const [painLevel, setPainLevel] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState('');
  const [expectations, setExpectations] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluationData = {
      painLevel,
      anxietyLevel,
      expectations,
      previousExperience,
    };
    console.log('Evaluación Preoperatoria:', evaluationData);
    alert('Evaluación enviada con éxito');
  };

  return (
    <div className="preoperative-evaluation">
      <h2>Evaluación Preoperatoria Personalizada</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nivel de Dolor:</label>
          <input
            type="text"
            value={painLevel}
            onChange={(e) => setPainLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nivel de Ansiedad:</label>
          <input
            type="text"
            value={anxietyLevel}
            onChange={(e) => setAnxietyLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Expectativas:</label>
          <textarea
            value={expectations}
            onChange={(e) => setExpectations(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Experiencias Previas con Analgésicos:</label>
          <textarea
            value={previousExperience}
            onChange={(e) => setPreviousExperience(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar Evaluación</button>
      </form>
    </div>
  );
};

export default PreoperativeEvaluation;