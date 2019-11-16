import bb from '../../../big-box'

import config from '../../resources'

export default class Zoom {
    constructor() {
        this.look = new bb.subtraction({ of: config.FROM, with: config.TO })
        this.delta = new bb.multiplication({ of: this.look.result, with: config.ZOOM_DELTA })

        this.zoomInTo = new bb.subtraction({ of: config.TO, with: this.delta.result, result: config.TO })
        this.zoomInFrom = new bb.subtraction({ of: config.FROM, with: this.delta.result, result: config.FROM })

        this.zoomOutTo = new bb.addition({ of: config.TO, with: this.delta.result, result: config.TO })
        this.zoomOutFrom = new bb.addition({ of: config.FROM, with: this.delta.result, result: config.FROM })

        this.invoke = this.invoke.bind(this)
    }

    invoke(zoomOut) {
        this.look.invoke()
        this.delta.invoke()

        if (zoomOut)
            return this.zoomOut()

        return this.zoomIn()
    }

    zoomIn() {
        this.zoomInTo.invoke()
        this.zoomInFrom.invoke()
    }

    zoomOut() {
        this.zoomOutTo.invoke()
        this.zoomOutFrom.invoke()
    }

}