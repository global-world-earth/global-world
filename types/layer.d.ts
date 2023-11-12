import { GlobalMap } from '../interface/map'

interface LayerOptions {
  id: string
  zooms: [number, number]
  zIndex: number
  visible: boolean
  depth: boolean
  preLoad: boolean
  map: GlobalMap
}
