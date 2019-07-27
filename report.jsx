var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')

module.exports = createReactClass({
  render() {
    return (<ReactPivot rows={rows}
      dimensions={dimensions}
      reduce={reducer}
      calculations={calculations}
      activeDimensions={['Date', 'Host']} />)
  }
})

const rows = require('./data.json')

const dimensions = [
  { value: 'date', title: 'Date' },
  { value: 'host', title: 'Host' },
  { value: 'uaOS', title: 'OS' },
  { value: 'uaBrowser', title: 'Browser' },
  // tz could have been shown better (UTC+x)
  // if I had found a way to templatize the value (UTC+x) like in calculations.
  // in case I find a way:
  // const hours = val / 60
  // return hours >= 0 ? `UTC-${hours}` : `UTC+${Math.abs(hours)}`
  { value: 'timezoneOffset', title: 'Timezone' }
]

var reducer = function (row, acc) {
  // acc.impressions = row.type === 'impression' ? (acc.impressions || 0) : (acc.impressions || 0) + 1
  // acc.impressions = (acc.impressions || 0) + (row.type === 'impression' ? 1 : 0)
  if (row.type === 'impression')
    acc.impressions = (acc.impressions || 0) + 1

  if (row.type === 'load')
    acc.loads = (acc.loads || 0) + 1

  if (row.type === 'display')
    acc.displays = (acc.displays || 0) + 1

  return acc
}

var calculations = [
  { title: 'Impressions', value: 'impressions', template: templateForReducedVals },
  { title: 'Loads', value: 'loads', template: templateForReducedVals },
  { title: 'Displays', value: 'displays', template: templateForReducedVals },
  {
    title: 'Load Rate', value: 'loadRate',
    template: function (val, row) {
      return templateForPercentVals(row.loads, row.impressions)
    },
    sortBy: function (row) {
      return row.loads / row.impressions
    }
  },
  {
    title: 'Display Rate', value: 'displayRate',
    template: function (val, row) {
      return templateForPercentVals(row.displays, row.loads)
    },
    sortBy: function (row) {
      return row.displays / row.loads
    }
  }
]

const templateForReducedVals = function (val) {
  return `${val || 0}`
}

const templateForPercentVals = function (numerator, denominator) {
  const rate = (numerator / denominator) || 0
  return `${(rate * 100).toFixed(1)}%`
}
