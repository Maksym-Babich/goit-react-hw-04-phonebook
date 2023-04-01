import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Form } from 'components/Form/Form';
import { Section } from 'components/Section/Section';
import { SectionMain } from 'components/SectionMain/SectionMain';
import { Contacts } from 'components/Contacts/Contacts';
import { Search } from 'components/Search/Search';

const KEY = 'contacts-list';

export function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const isInitialMount = useRef(true);

  useEffect(() => {
    const localStorageData = localStorage.getItem(KEY);
    if (localStorageData) {
      const contacts = JSON.parse(localStorageData);
      setContacts(contacts);
    }
  }, []);

  useEffect(() => {
    console.log(isInitialMount.current);
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('log on first mount');
    } else {
      localStorage.setItem(KEY, JSON.stringify(contacts));
      console.log('log on update');
    }
  }, [contacts]);

  const getfilteredItems = () => {
    const filteredItems = contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.number.includes(filter)
      );
    });
    return filter ? filteredItems : contacts;
  };

  const addContact = event => {
    event.preventDefault();
    const contact = {
      name: event.currentTarget.elements.name.value,
      number: event.currentTarget.elements.number.value,
      id: nanoid(),
    };

    const prevContacts = contacts.reduce((acc, contact) => {
      acc.push(contact.name, contact.number);
      return acc;
    }, []);

    if (prevContacts.includes(contact.name)) {
      alert(`${contact.name} is already in contacts`);
      return;
    }

    if (prevContacts.includes(contact.number)) {
      alert(`Contact with number ${contact.number} already exists`);
      return;
    }

    setContacts(prevC => {
      return [contact, ...prevC];
    });
    event.currentTarget.reset();
  };

  const onFielterChange = event => {
    setFilter(event.currentTarget.value);
  };

  const onContactDelete = evt => {
    setContacts(prevC => {
      return prevC.filter(contact => {
        return contact.id !== evt.target.dataset.id;
      });
    });
  };

  return (
    <>
      <SectionMain title="Phonebook">
        <Form onAddContact={addContact} />
        <Section title="Contacts">
          <Search search={filter} onSearchInput={onFielterChange} />
          <Contacts
            contacts={getfilteredItems()}
            onContactDelete={onContactDelete}
          ></Contacts>
        </Section>
      </SectionMain>
    </>
  );
}
