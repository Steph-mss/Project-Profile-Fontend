import React from 'react';
import './ResultView.css';

interface ResultViewProps {
    result: any;
    status: string;
    onReset?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, status, onReset }) => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'profile' | 'sources' | 'raw'>('overview');
    const score = result?.score;
    const justification = result?.justification;
    const justificationLines = result?.justification_lines || [];
    const breakdown = result?.breakdown;
    const metaSources = result?.meta?.sources || [];

    const getScoreColor = (s: number) => {
        if (s >= 75) return '#10b981'; // green
        if (s >= 50) return '#f59e0b'; // amber
        return '#ef4444'; // red
    };

    const getScoreLevel = (s: number) => {
        if (s >= 75) return 'Très fiable';
        if (s >= 50) return 'Modérément fiable';
        return 'À vérifier';
    };

    return (
        <div className="result-view fade-in">
            <div className="result-header">
                <div className="result-title">
                    <h2>Résultats de l'Analyse</h2>
                    <div className={`status-badge status-${status.toLowerCase()}`}>
                        {(() => {
                            if (status === 'done') return '✓ Complété';
                            if (status === 'failed') return '✗ Échoué';
                            return 'Partiel';
                        })()}
                    </div>
                </div>
                {onReset && (
                    <button className="reset-btn" onClick={onReset} title="Nouvelle recherche">
                        ↻ Nouvelle recherche
                    </button>
                )}
            </div>

            {/* Score Card */}
            {score !== undefined && (
                <div className="score-card-main">
                    <div className="score-display">
                        <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
                            <span className="score-number">{score}</span>
                            <span className="score-max">/100</span>
                        </div>
                        <div className="score-info">
                            <div className="score-level" style={{ color: getScoreColor(score) }}>
                                {getScoreLevel(score)}
                            </div>
                            {justification && (
                                <p className="score-justification">{justification}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Vue d'ensemble
                </button>
                <button
                    className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profil
                </button>
                <button
                    className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sources')}
                >
                    Sources
                </button>

            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-pane">
                        {breakdown && (
                            <div className="breakdown-section">
                                <h3>Détails du Score</h3>
                                <div className="breakdown-grid">
                                    {Object.entries(breakdown).map(([key, val]: [string, any]) => (
                                        <div key={key} className="breakdown-item">
                                            <div className="breakdown-header">
                                                <span className="breakdown-label">
                                                    {key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1)}
                                                </span>
                                                <span className="breakdown-val">{val}</span>
                                            </div>
                                            <div className="breakdown-bar-container">
                                                <div
                                                    className="breakdown-bar"
                                                    style={{
                                                        width: `${Math.min(100, (val / 25) * 100)}%`,
                                                        backgroundColor: getScoreColor((val / 25) * 100),
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {justificationLines && justificationLines.length > 0 && (
                            <div className="justification-section">
                                <h3>Justification détaillée</h3>
                                <ul className="justification-list">
                                    {justificationLines.map((line: string) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="tab-pane">
                        <div className="profile-section">
                            <h3>Informations Personnelles</h3>
                            {result?.personal?.value ? (
                                <div className="info-grid">
                                    {Object.entries(result.personal.value).map(([key, val]: [string, any]) => (
                                        val && (
                                            <div key={key} className="info-item">
                                                <span className="info-label">{key}</span>
                                                <span className="info-value">{String(val).slice(0, 100)}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-state">Aucune donnée personnelle</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Sources Tab */}
                {activeTab === 'sources' && (
                    <div className="tab-pane">
                        <div className="sources-section">
                            <h3>Sources utilisées</h3>
                            {metaSources.length > 0 ? (
                                <div className="sources-list">
                                    {metaSources.map((source: string) => (
                                        <div key={source} className="source-item">
                                            <span className="source-badge">{source}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-state">Aucune source détectée</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Raw Data Tab */}
                {activeTab === 'raw' && (
                    <div className="tab-pane">
                        <div className="raw-data">
                            <h3>Données complètes (JSON)</h3>
                            <pre className="json-pre">{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};