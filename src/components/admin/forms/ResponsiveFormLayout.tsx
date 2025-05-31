import React from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const FormSection = ({ title, description, children, fullWidth = false }: FormSectionProps) => {
  return (
    <div className={`mb-8 ${fullWidth ? 'w-full' : 'w-full lg:max-w-2xl'}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-lg font-bold text-white mb-1">{title}</h2>}
          {description && <p className="text-white/70 text-sm">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

interface FormGroupProps {
  label?: string;
  helpText?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormGroup = ({ 
  label, 
  helpText, 
  required = false, 
  error, 
  children,
  className = ""
}: FormGroupProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {helpText && <p className="text-xs text-white/60">{helpText}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

const FormActions = ({ 
  children, 
  alignment = 'left',
  sticky = false
}: FormActionsProps) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`
      flex flex-wrap gap-3 ${alignmentClasses[alignment]}
      ${sticky ? 'sticky bottom-0 bg-gym-black/90 backdrop-blur-sm py-4 mt-8 z-10' : 'mt-8'} 
    `}>
      {children}
    </div>
  );
};

// Export components
export { FormSection, FormGroup, FormActions };
