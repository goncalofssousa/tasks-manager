export type Filter = {
  label: string
  value: string
}

export type ActiveFilter = {
  group: FilterGroup,
  label: string, 
  value: string 
}

export type FilterGroup = 'priority' | 'favourite' | 'state'