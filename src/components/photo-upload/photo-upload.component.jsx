import { useState } from "react";
import PropTypes from "prop-types";
import { Upload, Trash2 } from "lucide-react";
import "./photo-upload.component.scss";

const PhotoUpload = ({ onPhotoChange }) => {
  const [preview, setPreview] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    
    setImgLoaded(false);
    setError(null);

    // Validar tipo e tamanho localmente
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo: 5MB. Atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError(`Tipo não permitido. Use: JPEG, PNG, WEBP ou HEIC`);
      return;
    }

    // Preview local (NÃO faz upload ainda)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onPhotoChange(file); // Passa o ARQUIVO para o formulário
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    setImgLoaded(false);
    setError(null);
    onPhotoChange(null);
  };

  return (
    <div
      className="upload-frame"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="upload-center">
        <div className="upload-title">
          <h2 className="upload-profile">Foto de Perfil</h2>
          <p>Escolha uma foto bem bonita e que mostre seu rosto!</p>
          <p className="upload-info">Formatos: JPEG, PNG, WEBP • Máximo: 5MB</p>
        </div>

        <div className="upload-container">
          <div className="upload-dropzone">
            {preview ? (
              <div className="preview-img-wrapper">
                {!imgLoaded && (
                  <div className="img-loading-spinner"></div>
                )}
                <img
                  src={preview}
                  alt="preview"
                  className={`preview-img${!imgLoaded ? ' img-blur' : ''}`}
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
            ) : (
              <>
                <Upload className="upload-icon" size={40} />
                <p>Clique para enviar ou arraste aqui</p>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
              className="upload-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          {preview && (
            <button
              type="button"
              className="remove-photo-btn"
              onClick={handleRemovePhoto}
              aria-label="Remover foto"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        {error && (
          <div className="upload-error">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

PhotoUpload.propTypes = {
  onPhotoChange: PropTypes.func.isRequired,
};

export default PhotoUpload;
