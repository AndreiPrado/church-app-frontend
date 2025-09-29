import React, { useState } from "react";
import { Upload, Trash2 } from "lucide-react"; 
import "./photo-upload.component.scss";

const PhotoUpload = ({ onPhotoChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onPhotoChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemovePhoto = () => {
    setPreview(null);
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
          <h2>Foto de Perfil</h2>
          <p>Escolha uma foto bem bonita e que mostre seu rosto!</p>
        </div>

        <div className="upload-container">
          <div className="upload-dropzone">
            {preview ? (
              <img src={preview} alt="preview" className="preview-img" />
            ) : (
              <>
                <Upload className="upload-icon" size={40} />
                <p>Clique para enviar</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
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
      </div>
    </div>
  );
};

export default PhotoUpload;
