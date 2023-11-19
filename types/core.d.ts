// 地图接口
interface MapOptions {
  container: string
  zoom: number
  pitch: number
  rotation: number
  center: [number, number]
}

interface ViewStatus {
  zoom: number
  pitch: number
  rotation: number
  center: [number, number],
  zooms: [number, number]
}
