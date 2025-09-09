import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import SettingsSection from './SettingsSection';

const ControlPanel = ({ isOpen, onClose }) => {
  return (
    <Transition appear show={isOpen} as="div">
      {/* Backdrop */}
      <Transition.Child
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="modal-overlay"
        onClick={onClose}
      />

      {/* Slide-up Panel */}
      <Transition.Child
        as="div"
        enter="ease-out duration-300"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="ease-in duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
        className="fixed bottom-0 left-0 right-0 h-[75vh] modal-content z-50 overflow-hidden"
      >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="modal-header">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Control Panel
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto modal-body">
              <div className="space-y-4">
                <SettingsSection />
              </div>
            </div>
          </div>
      </Transition.Child>
    </Transition>
  );
};

export default ControlPanel;
