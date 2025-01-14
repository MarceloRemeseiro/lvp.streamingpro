import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { OutputProcess } from '@/types/processTypes';
import { outputService } from '@/services/outputService';
import Modal from './Modal';

interface EditRTMPOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: OutputProcess;
  onUpdated?: () => void;
}

const EditRTMPOutputModal: FC<EditRTMPOutputModalProps> = ({
  isOpen,
  onClose,
  output,
  onUpdated
}) => {
  const [name, setName] = useState(output.metadata?.["restreamer-ui"]?.name || '');
  const [url, setUrl] = useState(output.config?.output?.[0]?.address || '');
  const [streamKey, setStreamKey] = useState(output.config?.output?.[0]?.options?.[13] || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await outputService.updateRTMPOutput(output.id, {
        type: 'rtmp',
        name,
        url,
        streamKey,
        streamId: output.reference
      });

      onUpdated?.();
    } catch (error) {
      console.error('Error updating RTMP output:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el output');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-text-primary">
        Editar Output RTMP
      </Dialog.Title>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-muted">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md 
              bg-card-background text-text-primary
              focus:ring-2 focus:ring-protocol-rtmp-border"                   
              disabled
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-text-muted">
              URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md 
              bg-card-background text-text-primary
              focus:ring-2 focus:ring-protocol-rtmp-border"                   
              required
            />
          </div>

          <div>
            <label htmlFor="streamKey" className="block text-sm font-medium text-text-muted">
              Stream Key
            </label>
            <input
              type="text"
              id="streamKey"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md 
              bg-card-background text-text-primary
              focus:ring-2 focus:ring-protocol-rtmp-border"                   
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-error">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-card-background px-4 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-info-background focus:outline-none focus:ring-2 focus:ring-protocol-rtmp-border focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-text-light hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRTMPOutputModal; 