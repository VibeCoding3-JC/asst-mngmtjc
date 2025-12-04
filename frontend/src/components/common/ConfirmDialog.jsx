import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const icons = {
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    danger: XCircleIcon,
};

const colors = {
    warning: 'bg-warning-100 text-warning-600',
    info: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    danger: 'bg-danger-100 text-danger-600',
};

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'warning',
    loading = false,
}) => {
    const Icon = icons[type];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 p-2 rounded-full ${colors[type]}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">
                                                {message}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        variant={type === 'danger' ? 'danger' : 'primary'}
                                        onClick={onConfirm}
                                        loading={loading}
                                    >
                                        {confirmText}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmDialog;
