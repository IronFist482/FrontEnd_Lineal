import '../styles/stepCard.css';

export default function StepCard({ stepNumber, operationName, operationDetail, matrix }) {

    const renderMatrix = (mat) => (
        <table className="matrix">
            <tbody>
                {mat.map((row, i) => (
                    <tr key={i}>
                        {row.map((value, j) => (
                            <td key={j}>{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="step-card">
            <div className="step-header">
                <h3>Paso {stepNumber}</h3>
                <p className="operation-name">{operationName}</p>
            </div>

            {operationDetail && (
                <div className="operation-detail">
                    <span>Operación:</span>
                    <code>{operationDetail}</code>
                </div>
            )}

            <div className="matrix-container">
                {renderMatrix(matrix)}
            </div>
            
        </div>
    );
}