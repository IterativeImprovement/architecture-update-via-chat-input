export const CommandLog = ({ log }) => {
    if (!log.length) return null;

    return (
        <div style={styles.log}>
            {log.map((entry) => (
                <div key={entry.id} style={styles.logEntry}>
                    <span style={styles.logInput}>$ {entry.input}</span>
                    <span style={entry.type === 'error' ? styles.error : styles.success}>
                        {entry.type === 'error' ? '✗' : '✓'} {entry.message}
                    </span>
                </div>
            ))}
        </div>
    );
};

const styles = {
    log: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: 'monospace',
        fontSize: 12,
        overflowY: 'auto',
    },
    logEntry: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderLeft: '2px solid #e5e7eb',
        paddingLeft: 8,
    },
    logInput: { color: '#6b7280' },
    success: { color: '#16a34a' },
    error: { color: '#dc2626' },
};