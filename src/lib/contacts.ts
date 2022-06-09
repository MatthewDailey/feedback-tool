import { Contact } from "./models"

export const contactMatchQuery = (contact: Contact, query: string) =>
  contact.email.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  || contact.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  || contact.role?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  || contact.team?.toLocaleLowerCase().includes(query.toLocaleLowerCase())

export const filterParticipants = (contacts: Contact[], query: string): Contact[] =>
  contacts.filter((contact) => !query || contactMatchQuery(contact, query))