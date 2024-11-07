import React, { useRef, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface DrawingCanvasProps {
  socket: Socket;
  isEnabled: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ socket, isEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        setContext(ctx);
      }
    }

    socket.on('draw', (data: { x: number; y: number; drawing: boolean }) => {
      if (!context) return;
      
      if (data.drawing) {
        context.lineTo(data.x, data.y);
        context.stroke();
      } else {
        context.beginPath();
        context.moveTo(data.x, data.y);
      }
    });

    socket.on('clearCanvas', () => {
      if (context) {
        context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      }
    });

    return () => {
      socket.off('draw');
      socket.off('clearCanvas');
    };
  }, [socket, context]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!isEnabled) return;
    
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    if (context) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      socket.emit('draw', { x: offsetX, y: offsetY, drawing: false });
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isEnabled || !isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    if (context) {
      context.lineTo(offsetX, offsetY);
      context.stroke();
      socket.emit('draw', { x: offsetX, y: offsetY, drawing: true });
    }
  };

  const stopDrawing = () => {
    if (!isEnabled) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context) {
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      socket.emit('clearCanvas');
    }
  };

  return (
    <div className="canvas-container" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{ 
          border: '1px solid #000',
          cursor: isEnabled ? 'crosshair' : 'not-allowed'
        }}
      />
      {isEnabled && (
        <button onClick={clearCanvas} style={{ position: 'absolute', top: 10, right: 10 }}>
          Clear
        </button>
      )}
      {!isEnabled && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            cursor: 'not-allowed'
          }}
        />
      )}
    </div>
  );
};

export default DrawingCanvas; 