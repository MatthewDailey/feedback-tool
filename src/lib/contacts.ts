import { Contact } from "./models"

export const filterParticipants = (contacts: Contact[], search: string): Contact[] =>
  contacts.filter((contact) =>
    !search
    || contact.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    || contact.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    || contact.role?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    || contact.team?.toLocaleLowerCase().includes(search.toLocaleLowerCase()))