export function watchSize(element: HTMLElement, listener: (width: number, height: number) => void) {
  // 创建iframe标签，设置样式并插入到被监听元素中
  // iframe 大小变化时的回调函数
  function sizeChange(): any {
    // 记录元素变化后的宽高
    // map._boundingClientRect = element.getBoundingClientRect();
    // map._clientPos = [element.clientLeft, element.clientTop];
    const width = element.offsetWidth
    const height = element.offsetHeight
    // 不一致时触发回调函数 cb，并更新元素当前宽高
    if (width !== oldWidth || height !== oldHeight) {
      listener(width, height)
      oldWidth = width
      oldHeight = height
    }
  }
  const iframe = document.createElement('iframe')
  iframe.style.cssText =
    'width: 100%;height: 100%;position: absolute;pointEvents:none; opacity:0; margin: 0;padding: 0;border: none;'
  iframe.onload = () => {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow!.onresize = sizeChange
    }
  }
  element.appendChild(iframe)
  iframe.src = 'about:blank'
  // 记录元素当前宽高
  let oldWidth = 0
  let oldHeight = 0
  sizeChange()
  // map.resize = sizeChange;
  window.onscroll = sizeChange
  return () => {
    iframe.contentWindow!.onresize = null
  }
}

// 计算鼠标在当前容器的位置
export function containerPosition(event: MouseEvent | TouchEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (event instanceof TouchEvent) {
    let t: Touch;
    if (event.touches.length > 0) {
      t = event.touches[0];
    } else {
      t = event.changedTouches[event.changedTouches.length - 1];
    }
    return [t.clientX - rect.left - el.clientLeft, t.clientY - rect.top - el.clientTop];
  }

  return [event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop];
}
