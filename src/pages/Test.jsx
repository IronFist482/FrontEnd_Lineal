import { useState } from 'react';
import StepCard from '../components/StepCard';
import '../styles/Home.css';

export default function Test() {
    const steps = [
        {
            stepNumber: 1,
            operationName: "Intercambio de filas",
            operationDetail: "F1 ↔ F2",
            matrix: [
                [1, 2, 3, 4],
                [1, 2, 3, 4],
                [1, 2, 3, 4],
                [1, 2, 3, 4],
            ],
        },
        {
            stepNumber: 2,
            operationName: "Multiplicación de fila",
            operationDetail: "F2 = 3 × F2",
            matrix: [
                [1, 2, 3],
                [12, 15, 18],
                [7, 8, 9],
            ],
        },
        {
            stepNumber: 3,
            operationName: "Suma de filas",
            operationDetail: "F3 = F3 - 2F1",
            matrix: [
                 [1, 2, 3, 4, 5],
                 [1, 2, 3, 4, 5],
                 [1, 2, 3, 4, 7],
                 [1, 2, 3, 4, 9],
                 [1, 2, 3, 4, 9],
            ],
        },
    ];

    const [showAllSteps, setShowAllSteps] = useState(false);

    const stepsToDisplay = showAllSteps ? steps : steps.slice(0, 1);

    return (
        <div className="home-content-area">
            {stepsToDisplay.map((s) => (
                <StepCard
                    key={s.stepNumber}
                    stepNumber={s.stepNumber}
                    operationName={s.operationName}
                    operationDetail={s.operationDetail}
                    matrix={s.matrix}
                />
            ))}
            
            {steps.length > 1 && (
                <button 
                    onClick={() => setShowAllSteps(!showAllSteps)} 
                    className="show-all-btn"
                >
                    {showAllSteps ? "Ocultar pasos" : "Ver pasos completos"}
                </button>
            )}
        </div>
    );
}