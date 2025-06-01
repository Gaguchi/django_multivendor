import Modal from './Modal';

/**
 * Confirmation Modal Component for delete actions
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Function to call when modal should close
 * @param {function} props.onConfirm - Function to call when user confirms
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {string} props.type - Type of confirmation: 'danger', 'warning', 'info'
 * @param {boolean} props.loading - Show loading state on confirm button
 */
export default function ConfirmationModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to perform this action?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    loading = false
}) {
    const typeStyles = {
        danger: {
            iconColor: '#dc2626',
            buttonColor: '#dc2626',
            buttonHoverColor: '#b91c1c'
        },
        warning: {
            iconColor: '#d97706',
            buttonColor: '#d97706',
            buttonHoverColor: '#b45309'
        },
        info: {
            iconColor: '#2563eb',
            buttonColor: '#2563eb',
            buttonHoverColor: '#1d4ed8'
        }
    };

    const currentStyle = typeStyles[type];

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            closeOnOverlayClick={!loading}
        >
            <div style={{ textAlign: 'center' }}>
                {/* Icon */}
                <div 
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: `${currentStyle.iconColor}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}
                >
                    <i 
                        className="icon-alert-triangle"
                        style={{
                            fontSize: '24px',
                            color: currentStyle.iconColor
                        }}
                    />
                </div>

                {/* Message */}
                <p 
                    style={{
                        margin: '0 0 1.5rem 0',
                        color: '#374151',
                        fontSize: '1rem',
                        lineHeight: '1.5'
                    }}
                >
                    {message}
                </p>

                {/* Buttons */}
                <div 
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            opacity: loading ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#f9fafb';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = 'white';
                            }
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: currentStyle.buttonColor,
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = currentStyle.buttonHoverColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = currentStyle.buttonColor;
                            }
                        }}
                    >
                        {loading && (
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}
                            />
                        )}
                        {loading ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Modal>
    );
}
