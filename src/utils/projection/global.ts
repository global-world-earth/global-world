import { toAngle, toRad } from '../math'

export class EllipseProjection {
  public static a = 6378137
  public static b = 6356752

  public static project(lng: number, lat: number): [number, number, number] {
    const result: [number, number, number] = [0, 0, 0]
    const a = this.a
    const b = this.b
    lng = toRad(lng)
    lat = toRad(lat)
    const height = 0

    const HALF_PI = Math.PI / 2
    const es = (this.a * a - b * b) / (a * a)

    if (lat < -HALF_PI && lat > -1.001 * HALF_PI) {
      lat = -HALF_PI
    } else if (lat > HALF_PI && lat < 1.001 * HALF_PI) {
      lat = HALF_PI
    } else if (lat < -HALF_PI) {
      result[0] = -Infinity
      result[1] = -Infinity
      result[2] = 0
      return [result[0], result[1], result[2]]
    } else if (lat > HALF_PI) {
      /* Latitude out of range */
      result[0] = Infinity
      result[1] = Infinity
      result[2] = 0
      return [result[0], result[1], result[2]]
    }

    if (lng > Math.PI) {
      lng -= 2 * Math.PI
    }
    const sinLat = Math.sin(lat)
    const cosLat = Math.cos(lat)
    const sinLat2 = sinLat * sinLat
    const rn = a / Math.sqrt(1.0 - es * sinLat2)
    result[0] = (rn + height) * cosLat * Math.cos(lng)
    result[1] = (rn + height) * cosLat * Math.sin(lng)
    result[2] = (rn * (1 - es) + height) * sinLat
    return result
  }

  public static Unproject(position: [number, number, number]): [number, number, number] {
    // ES = 0.006694379990141316
    const a = this.a
    const b = this.b
    const HALF_PI = Math.PI / 2
    const es = (a * a - b * b) / (a * a)
    const genau = 1e-12
    const genau2 = genau * genau
    const maxiter = 30

    let RX
    let RK
    let RN /* Earth radius at location */
    let CPHI0 /* cos of start or old geodetic latitude in iterations */
    let SPHI0 /* sin of start or old geodetic latitude in iterations */
    let CPHI /* cos of searched geodetic latitude */
    let SPHI /* sin of searched geodetic latitude */
    let SDPHI /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
    let iter /* # of continous iteration, max. 30 is always enough (s.a.) */

    const X = position[0]
    const Y = position[1]
    const Z = position[2] // Z value not always supplied
    let lng
    let lat
    let Height

    /* distance between semi-minor axis and location */
    const P = Math.sqrt(X * X + Y * Y)
     /* distance between center and location */
    const RR = Math.sqrt(X * X + Y * Y + Z * Z)
    if (P / a < genau) {
      /*  special case, if P=0. (X=0., Y=0.) */
      lng = 0.0

      /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
       *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
      if (RR / a < genau) {
        lat = HALF_PI
        Height = -b
        return position
      }
    } else {
      /*  ellipsoidal (geodetic) longitude
       *  leterval: -PI < Longitude <= +PI */
      lng = Math.atan2(Y, X)
    }

    /* --------------------------------------------------------------
     * Following iterative algorithm was developped by
     * "Institut for Erdmessung", University of Hannover, July 1988.
     * leternet: www.ife.uni-hannover.de
     * Iterative computation of CPHI,SPHI and Height.
     * Iteration of CPHI and SPHI to 10**-12 radian resp.
     * 2*10**-7 arcsec.
     * --------------------------------------------------------------
     */
    const CT = Z / RR
    const ST = P / RR
    RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST)
    CPHI0 = ST * (1.0 - es) * RX
    SPHI0 = CT * RX
    iter = 0

    /* loop to find sin(Latitude) resp. Latitude
     * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
    do {
      iter++
      RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0)

      /*  ellipsoidal (geodetic) height */
      Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0)

      RK = (es * RN) / (RN + Height)
      RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST)
      CPHI = ST * (1.0 - RK) * RX
      SPHI = CT * RX
      SDPHI = SPHI * CPHI0 - CPHI * SPHI0
      CPHI0 = CPHI
      SPHI0 = SPHI
    } while (SDPHI * SDPHI > genau2 && iter < maxiter)

    /*      ellipsoidal (geodetic) latitude */
    lat = Math.atan(SPHI / Math.abs(CPHI))
    return [toAngle(lng), toAngle(lat), Height]
  }

  public static GetResolution(zoom: number) {
    return (20037508.342789244 * 2) / 256 / Math.pow(2, zoom)
  }
}
