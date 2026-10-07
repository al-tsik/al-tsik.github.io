import type { FigureType, FigureView } from '../content/schema'

type ViewField = Exclude<keyof FigureView, 'figure'>

/** Which view fields apply to each figure type. */
export const viewFieldsByType: Record<FigureType, readonly ViewField[]> = {
  model: ['parts', 'drawing', 'azimuth', 'elevation', 'zoom'],
  gallery: ['image'],
  video: ['time', 'until'],
  animation: ['marker'],
  drawing: ['region'],
  image: ['region'],
  dynamo: ['region'],
  code: ['lines'],
}

/** View fields that are set but don't apply to the figure's type. */
export function unsupportedViewFields(view: FigureView, type: FigureType): ViewField[] {
  const allowed = viewFieldsByType[type]
  return (Object.keys(view) as (keyof FigureView)[]).filter(
    (field): field is ViewField =>
      field !== 'figure' && view[field] !== undefined && !allowed.includes(field as ViewField),
  )
}
