import { Card } from './ui/card';
import '../styles/ResultsSection.css';

export function ResultsSection({ result, explanation }) {
  return (
    <Card className="results-section-root">
      {/* Resultado */}
      <div className="results-section-result-wrapper">
        <h3 className="results-section-title">Resultado</h3>
        <div className="results-section-result-box">
          <p className="results-section-result-text">{result}</p>
        </div>
      </div>

      {/* Explicación paso a paso */}
      <div>
        <h3 className="results-section-title">Explicación paso a paso</h3>
        <div className="results-section-explanation-box">
          <ol className="results-section-explanation-list">
            {explanation.map((step, index) => (
              <li key={index} className="results-section-step-item">
                <span className="results-section-step-number">
                  {index + 1}
                </span>
                <p className="results-section-step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}