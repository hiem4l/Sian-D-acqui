import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Upload, Crop as CropIcon, Save, X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadCropProps {
  currentImageUrl?: string;
  onImageSave: (imageUrl: string) => void;
  alt?: string;
  className?: string;
}

export function ImageUploadCrop({ 
  currentImageUrl, 
  onImageSave, 
  alt = "Image",
  className = "w-24 h-24"
}: ImageUploadCropProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset cropped image when currentImageUrl changes from outside
  React.useEffect(() => {
    // Si on a une nouvelle currentImageUrl qui est différente du crop actuel
    if (currentImageUrl && currentImageUrl !== croppedImageUrl) {
      setCroppedImageUrl('');
    }
  }, [currentImageUrl]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // aspect ratio 1:1 pour un carré
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropSave = async () => {
    if (imgRef.current && crop) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
        setCroppedImageUrl(croppedImageUrl);
        onImageSave(croppedImageUrl);
        setIsOpen(false);
        setImageSrc('');
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setImageSrc('');
    setCrop(undefined);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
  // Helper function to get the display image URL
  const getDisplayImageUrl = () => {
    // Priorité: image croppée > image actuelle 
    if (croppedImageUrl) return croppedImageUrl;
    if (currentImageUrl) {
      // Convertir les URLs relatives en URLs absolues
      if (currentImageUrl.startsWith('/')) return currentImageUrl;
      if (currentImageUrl.startsWith('blob:')) return currentImageUrl;
      if (currentImageUrl.startsWith('http')) return currentImageUrl;
      // Sinon c'est probablement un nom de fichier
      return `/images/pizzas/${currentImageUrl}`;
    }
    return null;
  };

  return (
    <>
      {/* Image cliquable */}
      <div 
        className={`${className} bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer group hover:bg-gray-200 transition-colors`}
        onClick={openFileDialog}
      >
        {getDisplayImageUrl() ? (
          <img 
            src={getDisplayImageUrl()!} 
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('ImageUploadCrop: Image failed to load:', getDisplayImageUrl());
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.upload-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'upload-fallback w-full h-full flex items-center justify-center text-gray-400';
                fallback.innerHTML = '🍕';
                parent.appendChild(fallback);
              }
            }}
            onLoad={(e) => {
              // Remove fallback when image loads
              const parent = e.currentTarget.parentElement;
              const fallback = parent?.querySelector('.upload-fallback');
              if (fallback) fallback.remove();
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            🍕
          </div>
        )}
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Badge pour indiquer qu'on peut cliquer */}
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <CropIcon className="w-3 h-3" />
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
      />

      {/* Dialog de crop */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CropIcon className="w-5 h-5" />
              <span>Rogner l'image</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {imageSrc && (
              <div className="max-h-96 overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  aspect={1}
                  circularCrop={false}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Image à rogner"
                    onLoad={onImageLoad}
                    style={{ maxHeight: '400px', width: 'auto' }}
                  />
                </ReactCrop>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              Glissez pour ajuster la zone de rognage. L'image sera redimensionnée en carré.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleCropSave} disabled={!crop}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}