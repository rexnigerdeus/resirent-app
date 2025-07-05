// src/components/Shared/Modal.jsx
import ReactModal from 'react-modal';

// This line is important for accessibility. It tells the modal which element to hide.
ReactModal.setAppElement('#root');

const Modal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
        },
      }}
      contentLabel={title}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button onClick={onRequestClose} className="text-2xl font-bold">&times;</button>
      </div>
      <div>{children}</div>
    </ReactModal>
  );
};

export default Modal;