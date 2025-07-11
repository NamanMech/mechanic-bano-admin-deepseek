import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

// सामान्य टोस्ट कॉन्फ़िगरेशन
const COMMON_OPTIONS = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 60,
  transition: Bounce,
  theme: 'colored',
};

// टोस्ट आईकन और स्टाइल्स
const TOAST_TYPES = {
  success: {
    icon: '✅',
    style: { background: '#4CAF50', color: '#FFFFFF' },
  },
  error: {
    icon: '❌',
    style: { background: '#F44336', color: '#FFFFFF' },
  },
  warning: {
    icon: '⚠️',
    style: { background: '#FF9800', color: '#FFFFFF' },
  },
  info: {
    icon: 'ℹ️',
    style: { background: '#2196F3', color: '#FFFFFF' },
  },
};

/**
 * कस्टम टोस्ट दिखाने के लिए उपयोगिता फ़ंक्शन
 * @param {string} type - टोस्ट प्रकार (success, error, warning, info)
 * @param {string} message - टोस्ट संदेश
 * @param {object} customOptions - कस्टम विकल्प (वैकल्पिक)
 */
const showToast = (type, message, customOptions = {}) => {
  // मान्यता जाँचें
  if (!message || typeof message !== 'string') {
    console.error('Invalid toast message:', message);
    return;
  }

  // टोस्ट प्रकार मान्य करें
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;
  
  // टोस्ट कंटेंट बनाएं
  const content = (
    <div className="toast-content">
      <span className="toast-icon">{toastType.icon}</span>
      <span className="toast-message">{message}</span>
    </div>
  );

  // विकल्प मर्ज करें
  const options = {
    ...COMMON_OPTIONS,
    ...customOptions,
    style: { ...COMMON_OPTIONS.style, ...toastType.style, ...customOptions.style },
    toastId: `${type}-${message.substring(0, 20)}`, // डुप्लीकेट टोस्ट रोकें
  };

  // टोस्ट दिखाएं
  toast(content, options);
};

// विशिष्ट टोस्ट फ़ंक्शन्स
export const showSuccessToast = (message, options) => 
  showToast('success', message, options);

export const showErrorToast = (message, options) => 
  showToast('error', message, options);

export const showWarningToast = (message, options) => 
  showToast('warning', message, options);

export const showInfoToast = (message, options) => 
  showToast('info', message, options);

// प्रॉमिस-आधारित टोस्ट (API कॉल्स के लिए उपयोगी)
export const promiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      pending: {
        render: messages.pending,
        ...COMMON_OPTIONS,
        icon: '⏳',
      },
      success: {
        render: messages.success,
        ...COMMON_OPTIONS,
        icon: '✅',
      },
      error: {
        render: messages.error,
        ...COMMON_OPTIONS,
        icon: '❌',
      }
    },
    COMMON_OPTIONS
  );
};
