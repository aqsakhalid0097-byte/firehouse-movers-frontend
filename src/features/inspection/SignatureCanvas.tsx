import React, { useRef } from 'react';
import { Eraser } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange?: (hasSig: boolean) => void;
  onDataUrlChange?: (dataUrl: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  onDataUrlChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = React.useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
    onSignatureChange?.(true);
    onDataUrlChange?.(canvas.toDataURL());
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange?.(false);
    onDataUrlChange?.('');
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-gray-500 rounded bg-white cursor-crosshair max-w-full h-auto touch-none"
      />
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={clearSignature}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
        <span className="text-gray-400 text-xs">
          {hasSignature ? 'Signature recorded' : 'Sign above to authorize this inspection'}
        </span>
      </div>
    </div>
  );
};
