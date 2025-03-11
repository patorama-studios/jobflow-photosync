
import { useState } from 'react';

interface DefaultSectionsProps {
  scheduling?: boolean;
  address?: boolean;
  customer?: boolean;
  photographer?: boolean;
  product?: boolean;
  customItems?: boolean;
  notes?: boolean;
}

export const useAppointmentSections = (defaultSections: DefaultSectionsProps = {}) => {
  // Sections open/closed state
  const [schedulingOpen, setSchedulingOpen] = useState(defaultSections.scheduling !== false);
  const [addressOpen, setAddressOpen] = useState(defaultSections.address === true);
  const [customerOpen, setCustomerOpen] = useState(defaultSections.customer === true);
  const [photographerOpen, setPhotographerOpen] = useState(defaultSections.photographer === true);
  const [productOpen, setProductOpen] = useState(defaultSections.product === true);
  const [customItemsOpen, setCustomItemsOpen] = useState(defaultSections.customItems === true);
  const [notesOpen, setNotesOpen] = useState(defaultSections.notes === true);

  return {
    schedulingOpen,
    addressOpen,
    customerOpen,
    photographerOpen,
    productOpen,
    customItemsOpen,
    notesOpen,
    setSchedulingOpen,
    setAddressOpen,
    setCustomerOpen,
    setPhotographerOpen,
    setProductOpen,
    setCustomItemsOpen,
    setNotesOpen
  };
};
