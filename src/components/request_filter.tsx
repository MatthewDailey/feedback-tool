import * as React from 'react'
import { styled } from "./styled"
import { useFeedbackSessionRequestList } from "../lib/data"
import { Spacer } from "./spacer"

const FilterWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})
const StyledSelect = styled('select', {
  minWidth: 150
})

export const FilterSelectors = (props: {requestIds: string[], filterTeam?: string, setFilterTeam, filterRole?: string, setFilterRole}) => {
  const requests = useFeedbackSessionRequestList(props.requestIds)
  const allRoles = [...new Set(requests.map(r => r.requesteeRole))]
  const allTeams = [...new Set(requests.map(r => r.requesteeTeam))]

  const teamDefault = "No team filter."
  const roleDefault = "No role filter."
  return (
    <FilterWrapper>
      <StyledSelect defaultValue={teamDefault} onChange={(e) => props.setFilterTeam(e.target.value)}>
        <option key={teamDefault} value={""}>{teamDefault}</option>
        {
          allTeams.map(team => (
            team && <option key={team} value={team}>{team}</option>
          ))
        }
      </StyledSelect>
      <Spacer multiple={1} direction="x" />
      <StyledSelect defaultValue={roleDefault} onChange={(e) => props.setFilterRole(e.target.value)}>
        <option key={roleDefault} value={""}>{roleDefault}</option>
        {
          allRoles.map(role => (
            role && <option key={role} value={role}>{role}</option>
          ))
        }
      </StyledSelect>
    </FilterWrapper>
  )
}


