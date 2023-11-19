import type { CoreMap } from '../core/map';
import { containerPosition } from '../utils/dom/dom';

export class UIEvents {
  container: HTMLElement | null
  map: CoreMap

  private _mouseMoveBind = this._mouseMove.bind(this)
  private _mouseDownBind = this._mouseDown.bind(this)
  private _mouseUpBind = this._mouseUp.bind(this)
  private _contextMenuBind = this._contextMenu.bind(this)
  private _startMousePos = [0, 0]
  private _lastMousePos = [0, 0]
  private _pressStatus = MouseStatus.never
  private _pitchOrRotate = ''

  constructor(map: CoreMap) {
    this.container = map.getContainer()
    this.map = map
    this.bindEvents()
  }

  bindEvents() {
    if (this.container) {
      this.container.addEventListener('mousedown', this._mouseDownBind)
      this.container.addEventListener('mousemove', this._mouseMoveBind)
      this.container.addEventListener('mouseup', this._mouseUpBind)
      this.container.addEventListener('contextmenu', this._contextMenuBind)
    }
  }

  _mouseDown(event: MouseEvent) {
    // event.preventDefault()
    if (event.button === 0) {
      this._pressStatus = MouseStatus.leftPress
    } else if (event.button === 2) {
      this._pressStatus = MouseStatus.rightPress
    }
    if (this.container) {
      this._startMousePos = containerPosition(event, this.container)
      this._lastMousePos = this._startMousePos
    }
  }

  _mouseMove(event: MouseEvent) {
    if (this._pressStatus === MouseStatus.never || !this.container) {
      return
    }

    const pos = containerPosition(event, this.container)
    const deltaPos = [pos[0] - this._lastMousePos[0], pos[1] - this._lastMousePos[1]];

    // 左按键平移
    if (this._pressStatus === MouseStatus.leftPress) {
      console.log('center');
    }

    // 右按键旋转和俯仰
    if (this._pressStatus === MouseStatus.rightPress) {
      // TODO: 暂时简单的判断右键的旋转还是俯仰
      if (!this._pitchOrRotate) {
        if (Math.abs(deltaPos[0]) > Math.abs(deltaPos[1])) {
          this._pitchOrRotate = 'rotate'
        } else {
          this._pitchOrRotate = 'pitch'
        }
      }

      if (this._pitchOrRotate === 'pitch') {
        this.map.view.addPitch(-deltaPos[1] / 5)
      } else {
        this.map.view.addRotation(deltaPos[0] / 5)
      }
    }
    this._lastMousePos = pos;
  }

  _mouseUp() {
    this._startMousePos = [0, 0]
    this._pressStatus = MouseStatus.never
    this._pitchOrRotate = ''
  }

  _contextMenu(event: MouseEvent) {
    event.preventDefault()
  }
}

// 鼠标按下状态
enum MouseStatus {
  'never',
  'press',
  'move',
  'leftPress',
  'rightPress',
}
