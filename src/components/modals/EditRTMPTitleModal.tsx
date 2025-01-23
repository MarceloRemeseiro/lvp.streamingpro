import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { OutputProcess } from '@/types/processTypes';
import { outputService } from '@/services/outputService';
import Modal from '../ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface EditRTMPTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: OutputProcess;
  onUpdated?: () => void;
}

const EditRTMPTitleModal: FC<EditRTMPTitleModalProps> = ({
  isOpen,
  onClose,
  output,
  onUpdated
}) => {
  const [name, setName] = useState(output.metadata?.["restreamer-ui"]?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implementar updateRTMPTitle en outputService
      await outputService.updateRTMPTitle(output.id, name);
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error updating RTMP title:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el título');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-text dark:text-text-dark">
        Editar Título
      </Dialog.Title>

      <form onSubmit={handleSubmit} className="mt-4">
        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del output"
          protocol="rtmp"
          required
        />

        {error && (
          <div className="mt-4 text-sm text-error dark:text-error-dark">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            loadingText="Guardando..."
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRTMPTitleModal; 