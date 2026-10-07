/** The bit of a Lottie file we read ourselves: its named markers. */
export type LottieData = {
  markers?: { tm: number; cm: string; dr: number }[]
}

/**
 * The [start, end] frame segment of a named marker (`cm` is the marker's
 * comment/name, `tm` its start frame, `dr` its duration), or null.
 */
export function markerSegment(data: LottieData, name: string): [number, number] | null {
  const marker = data.markers?.find((candidate) => candidate.cm === name)
  return marker ? [marker.tm, marker.tm + marker.dr] : null
}
