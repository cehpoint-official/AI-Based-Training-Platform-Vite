// src/components/ConfirmationModal.jsx
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ConfirmationForQuestions = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-30 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center bg-black bg-opacity-30">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-20 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-300">
                  {message}
                </p>
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none transition-colors duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none transition-colors duration-200"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default  ConfirmationForQuestions;
