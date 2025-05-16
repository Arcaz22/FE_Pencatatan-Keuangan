// hooks/use-disclosure.ts
import * as React from 'react';

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    onOpenChange,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev)
  };
};
