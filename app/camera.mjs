
export default class Camera {
    constructor(
        /** Viewing */
        aspect = 1,
        angle = 30,
        near = 1e-6,
        far = 1e6,
        delta = 0.01,

        /** Positioning */
        to = [0, 0, 0],
        up = [0, 1, 0],
        from = [3, 3, 3],
    ) {

        /** Controls */
        this.delta = delta

        /** Look Setup */
        this.to = new Float32Array(to)
        this.up = new Float32Array(up)
        this.from = new Float32Array(from)

        /** Matrices */
        this.view = new Float32Array(16)
        this.proj = new Float32Array(16)
        this.model = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])

        /** Project Setup */
        this.far = far
        this.near = near
        this.aspect = aspect
        this.angle = Math.PI * angle / 180 / 2

        this.depth = 1 / (this.far - this.near)
        this.sinAngle = Math.sin(this.angle)
        this.cosAngle = Math.cos(this.angle)
        this.cotAngle = this.cosAngle / this.sinAngle
    }

    look() {
        /** Define Forward-Facing */
        let fx = this.from[0] - this.to[0]
        let fy = this.from[1] - this.to[1]
        let fz = this.from[2] - this.to[2]

        /** Normalize Forward-Facing */
        const fn = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)

        fx *= fn
        fy *= fn
        fz *= fn

        /** Calculate Cross Product of Up and Forward */
        let sx = this.up[1] * fz - this.up[2] * fy
        let sy = this.up[2] * fx - this.up[0] * fz
        let sz = this.up[0] * fy - this.up[1] * fx

        /** Normalize Side-Facing */
        const sn = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)

        sx *= sn
        sy *= sn
        sz *= sn

        /** Calculate Cross Product of Side and Forward */
        const ux = fy * sz - fz * sy;
        const uy = fz * sx - fx * sz;
        const uz = fx * sy - fy * sx;

        /** Assign Rotation to Look Matrix */
        this.view[0] = sx; this.view[4] = sy; this.view[8] = sz; this.view[12] = 0;
        this.view[1] = ux; this.view[5] = uy; this.view[9] = uz; this.view[13] = 0;
        this.view[2] = fx; this.view[6] = fy; this.view[10] = fz; this.view[14] = 0;
        this.view[3] = 0; this.view[7] = 0; this.view[11] = 0; this.view[15] = 1;

        /** Assign Translation to Look Matrix */
        this.view[12] += this.view[0] * -this.from[0] + this.view[4] * -this.from[1] + this.view[8] * -this.from[2]
        this.view[13] += this.view[1] * -this.from[0] + this.view[5] * -this.from[1] + this.view[9] * -this.from[2]
        this.view[14] += this.view[2] * -this.from[0] + this.view[6] * -this.from[1] + this.view[10] * -this.from[2]
        this.view[15] += this.view[3] * -this.from[0] + this.view[7] * -this.from[1] + this.view[11] * -this.from[2]

        return this.view
    }

    project() {
        this.proj[0] = this.cotAngle / this.aspect
        this.proj[5] = this.cotAngle
        this.proj[10] = -(this.far + this.near) * this.depth
        this.proj[11] = -1
        this.proj[14] = -2 * this.near * this.far * this.depth

        return this.proj
    }

    zoom(direction) {
        this.from[0] += direction * this.delta * (this.from[0] - this.to[0])
        this.from[1] += direction * this.delta * (this.from[1] - this.to[1])
        this.from[2] += direction * this.delta * (this.from[2] - this.to[2])
    }
}


// this.pointer = bb.tensor([0, 0, 0, 0])
//         this.rotation = bb.tensor([1, 0, 0, 0])
//         this.intermediary = bb.tensor([0, 0, 0, 0])

//         this.matrix = bb.eye([4, 4])
//         this.webgl.uniforms.u_ModelMatrix.set(this.matrix)

//         this.rotate = new bb.cached.multiply({
//             of: this.pointer,
//             with: this.rotation,
//             result: this.intermediary
//         })


// pointerdown(event) {
//     /** Clicked */
//     this.pointer = true

//     this.v1 = this.intersect()
// }

// pointermove(event) {
//     if (!this.pointer) return

//     this.v2 = this.intersect()

//     this.v = bb.cross({ of: this.v1, with: this.v2 }).unit()
//     this.d = this.v1.T().matMult({ with: this.v2 }).data[0]
//     this.n = this.v1.norm().data[0] * this.v2.norm().data[0]
//     this.a = Math.acos(this.d / this.n)

//     if (isNaN(this.a)) return

//     this.pointer.data[0] = Math.cos(this.a / 2)
//     this.pointer.data[1] = Math.sin(this.a / 2) * this.v.data[0]
//     this.pointer.data[2] = Math.sin(this.a / 2) * this.v.data[1]
//     this.pointer.data[3] = Math.sin(this.a / 2) * this.v.data[2]

//     this.rotate.invoke()

//     const qw = this.intermediary.data[0]
//     const qx = this.intermediary.data[1]
//     const qy = this.intermediary.data[2]
//     const qz = this.intermediary.data[3]

//     this.matrix.data[0] = 1.0 - 2.0 * qy * qy - 2.0 * qz * qz
//     this.matrix.data[4] = 2.0 * qx * qy - 2.0 * qz * qw
//     this.matrix.data[8] = 2.0 * qx * qz + 2.0 * qy * qw
//     this.matrix.data[12] = 0.0

//     this.matrix.data[1] = 2.0 * qx * qy + 2.0 * qz * qw
//     this.matrix.data[5] = 1.0 - 2.0 * qx * qx - 2.0 * qz * qz
//     this.matrix.data[9] = 2.0 * qy * qz - 2.0 * qx * qw
//     this.matrix.data[13] = 0.0

//     this.matrix.data[2] = 2.0 * qx * qz - 2.0 * qy * qw
//     this.matrix.data[6] = 2.0 * qy * qz + 2.0 * qx * qw
//     this.matrix.data[10] = 1.0 - 2.0 * qx * qx - 2.0 * qy * qy
//     this.matrix.data[14] = 0.0

//     this.matrix.data[3] = 0
//     this.matrix.data[7] = 0
//     this.matrix.data[11] = 0
//     this.matrix.data[15] = 1.0

//     this.render()
// }

// pointerup() {
//     this.pointerIsDown = false

//     this.rotation.data = this.intermediary.data.slice()
// }


// intersect() {
//     const r = 2
//     const ro = config.TO.subtract({ with: config.FROM }).slice([':3'])
//     const d = ro.norm().data[0]

//     const x = (event.x - this.canvas.width / 2) / (this.canvas.width / 2)
//     const y = (this.canvas.height / 2 - event.y) / (this.canvas.height / 2)

//     const yh = Math.tan(Math.PI * 15 / 180) * d
//     const xh = yh * config.ASPECT_RATIO

//     // const z = Math.sqrt((x * xh) ** 2 + (y * yh) ** 2)

//     const c = config.LOOK_MATRIX.matMult({ with: [[[x * xh]], [[y * yh]], [[0]], [[1]]] })
//     // const c = bb.tensor([[[-0.5]], [[0]], [[0]], [[1]]])

//     const rp = c.subtract({ with: config.FROM }).slice([':3']).unit()
//     const t = ro.T().matMult({ with: rp }).data[0]

//     const z = rp.multiply({ with: t }).subtract({ with: ro }).norm().data[0]

//     const ip = Math.sqrt(r ** 2 - z ** 2)

//     const i = rp.multiply({ with: t - ip })

//     // console.log(i.subtract({ with: ro }).norm().data[0])

//     return i.subtract({ with: ro })
// }