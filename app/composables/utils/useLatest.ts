import { first, sortBy } from 'lodash-es'

export const latest = (list: any[], property = 'createdAt') => {
  return first(
    sortBy(list, (item) => {
      const date = new Date(item[property])

      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value ${item[property]}`)
      }
      return date
    }).reverse(),
  )
}
