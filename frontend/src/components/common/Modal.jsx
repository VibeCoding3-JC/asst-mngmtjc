import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    footer,
    className = '',
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
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
                            <Dialog.Panel
                                className={`w-full ${sizes[size]} transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all ${className}`}
                            >
                                {/* Header */}
                                {(title || showClose) && (
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                        {title && (
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-semibold text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {showClose && (
                                            <button
                                                type="button"
                                                className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                onClick={onClose}
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Body */}
                                <div className="px-6 py-4">
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
