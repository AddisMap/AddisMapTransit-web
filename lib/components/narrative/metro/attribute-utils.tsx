import { FormattedList, FormattedTime, IntlShape } from 'react-intl'
import { Itinerary, Leg } from '@opentripplanner/types'
import coreUtils from '@opentripplanner/core-utils'
import React from 'react'

import { firstTransitLegIsRealtime } from '../../../util/viewer'
import {
  getFirstLegStartTime,
  getLastLegEndTime
} from '../../../util/itinerary'

export const departureTimes = (
  itinerary: Itinerary & {
    allStartTimes: {
      legs: Leg[]
      realtime: boolean
    }[]
  },
  setItineraryTimeIndex: (index: number) => void,
  intl: IntlShape,
  activeItineraryTimeIndex?: number
): JSX.Element => {
  if (!itinerary.allStartTimes) {
    return (
      <button
        className={
          firstTransitLegIsRealtime(itinerary) ? 'realtime active' : 'active'
        }
        title={intl.formatMessage(
          { id: 'components.MetroUI.arriveAtTime' },
          { time: intl.formatTime(itinerary.endTime) }
        )}
      >
        <FormattedTime value={itinerary.startTime} />
      </button>
    )
  }

  const allStartTimes = itinerary.allStartTimes.sort(
    (a, b) => getFirstLegStartTime(a.legs) - getFirstLegStartTime(b.legs)
  )

  return (
    <FormattedList
      type="disjunction"
      value={allStartTimes.map((time, index) => {
        const classNames = []
        if (time.realtime) classNames.push('realtime')
        if (index === (activeItineraryTimeIndex || 0)) classNames.push('active')

        return (
          <button
            className={classNames.join(' ')}
            key={getFirstLegStartTime(time.legs)}
            onClick={() => setItineraryTimeIndex(index)}
            title={intl.formatMessage(
              { id: 'components.MetroUI.arriveAtTime' },
              { time: intl.formatTime(getLastLegEndTime(time.legs)) }
            )}
          >
            <FormattedTime value={getFirstLegStartTime(time.legs)} />
          </button>
        )
      })}
    />
  )
}

export const getFirstTransitLegStop = (
  itinerary: Itinerary
): string | undefined =>
  itinerary.legs?.find((leg: Leg) => leg?.from?.vertexType === 'TRANSIT')?.from
    ?.name

export const getFlexAttirbutes = (
  itinerary: Itinerary
): {
  isCallAhead: boolean
  isContinuousDropoff: boolean
  isFlexItinerary: boolean
  phone: string
} => {
  const isCallAhead = itinerary.legs?.some(
    coreUtils.itinerary.isReservationRequired
  )

  let phone = itinerary.legs
    .map((leg: Leg) => leg?.agencyName)
    .filter((name: string | undefined) => !!name)[0]

  if (isCallAhead) {
    // Picking 0 ensures that if multiple flex legs with
    // different phone numbers, the first leg is prioritized
    phone = itinerary.legs
      .map((leg: Leg) => leg.pickupBookingInfo?.contactInfo?.phoneNumber)
      .filter((number: string | undefined) => !!number)[0]
  }

  return {
    isCallAhead,
    isContinuousDropoff: itinerary.legs?.some(
      coreUtils.itinerary.isContinuousDropoff
    ),
    isFlexItinerary: itinerary.legs?.some(coreUtils.itinerary.isFlex),
    phone: phone || ''
  }
}

export const removeInsignifigantWalkLegs = (leg: Leg): boolean =>
  // Return true only for non walk-legs or walking legs over 400 meters
  // TODO: Make the 400 meters configurable?
  leg.mode !== 'WALK' || leg.distance > 400

/**
 * Generate text for all routes used in an itinerary.
 * TODO: include all alternate routes inside alternateRoutes as well!
 */
export const getItineraryRoutes = (
  itinerary: Itinerary,
  intl: IntlShape
): React.ReactNode => {
  return intl.formatList(
    itinerary.legs
      .map((leg: Leg) => {
        return leg.routeShortName
      })
      .filter((name) => !!name)
  )
}
