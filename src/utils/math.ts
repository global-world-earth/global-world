export function toRad(angle: number) {
  return (angle / 180) * Math.PI
}

export function toAngle(rad: number) {
  return (rad * 180) / Math.PI
}
