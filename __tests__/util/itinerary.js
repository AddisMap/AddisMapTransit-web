import {isTransit, routeComparator} from '../../lib/util/itinerary'

describe('util > itinerary', () => {
  it('isTransit should work', () => {
    expect(isTransit('CAR')).toBeFalsy()
  })

  describe('routeComparator', () => {
    const route1 = {
      longName: 'Across town',
      shortName: '10',
      sortOrder: 10
    }
    const route2 = {
      longName: 'Around town',
      shortName: '20',
      sortOrder: 2
    }
    const route3 = {
      longName: 'Around another town',
      shortName: '3',
      sortOrder: -999
    }
    const route4 = {
      longName: 'Loop route',
      shortName: '2',
      sortOrder: -999
    }
    const route5 = {
      longName: 'A-line',
      shortName: 'A',
      sortOrder: -999
    }
    const route6 = {
      longName: 'B-line',
      shortName: 'B',
      sortOrder: -999
    }
    const route7 = {
      longName: 'A meandering route',
      sortOrder: -999
    }
    const route8 = {
      longName: 'Zig-zagging route',
      shortName: '30',
      sortOrder: 2
    }
    const route9 = {
      longName: 'Express route',
      shortName: '30',
      sortOrder: 2
    }
    const route10 = {
      longName: 'Variation of express route',
      shortName: '30',
      sortOrder: 2
    }

    function sortRouteArray (...routes) {
      routes.sort(routeComparator)
      return routes
    }

    it('should sort routes based off of sortOrder', () => {
      expect(sortRouteArray(route1, route2)).toMatchSnapshot()
    })

    it('should prioritize routes with valid sortOrder', () => {
      expect(sortRouteArray(route2, route3)).toMatchSnapshot()
    })

    it('should sort routes based off of integer shortName with routes with same sortOrder', () => {
      expect(sortRouteArray(route8, route2)).toMatchSnapshot()
    })

    it('should sort routes based off of integer shortName', () => {
      expect(sortRouteArray(route3, route4)).toMatchSnapshot()
    })

    it('should prioritize routes with valid integer shortNames', () => {
      expect(sortRouteArray(route4, route5)).toMatchSnapshot()
    })

    it('should sort routes based off of shortNames', () => {
      expect(sortRouteArray(route5, route6)).toMatchSnapshot()
    })

    it('should prioritize routes with shortNames over those with just longNames', () => {
      expect(sortRouteArray(route6, route7)).toMatchSnapshot()
    })

    it('should sort routes based off of longNames', () => {
      expect(sortRouteArray(route9, route10)).toMatchSnapshot()
    })

    it('should sort routes on all of the criteria at once', () => {
      expect(sortRouteArray(
        route1,
        route2,
        route3,
        route4,
        route5,
        route6,
        route7,
        route8,
        route9,
        route10
      )).toMatchSnapshot()
    })
  })
})
