import { Contact } from "./models"

export const filterParticipants = (contacts: Contact[], search: string): Contact[] =>
  contacts.filter((contact) =>
    !search
    || contact.email.includes(search)
    || contact.name.includes(search)
    || contact.role?.includes(search)
    || contact.team?.includes(search))