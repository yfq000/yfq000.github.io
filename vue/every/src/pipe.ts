import { Fluid } from "./fluid.js"
/* 严格采用国际单位（SI），无例外 */
/**
 * 圆 周长
 * @param d 直径 m
 * @returns m
 */
function circleCircumference(d:number/* 直径 */):number {
    return Math.PI * d;
}

/**
 * 圆面积
 * @param d 直径 m
 * @returns m2
 */
function circleArea(d:number/* 直径 */):number {
    return Math.PI * Math.pow(d, 2) * 0.25;
}

/**
 * 圆环面积
 * @param di 
 * @param do_ 
 * @returns m2
 */
function cylinderArea(di:number /* 内径 m */, do_:number /* 外径 m */):number {
    return circleArea(do_) - circleArea(di);
}

/**
 * 雷诺数
 */
function reynolds(di:number /* 内径 m */, velocity:number, density:number, viscosity:number/* 运动粘度 m2/s */) {
    return di * velocity / viscosity;
}

class PipeMaterial {
    density:number = 7850;
    
    getDensity():number {
        return this.density;
    }
}

class Insul {
    density:number = 0;
    
    getDensity():number {
        return this.density;
    }
}

class Clad {
    density:number = 0;
    
    getDensity():number {
        return this.density;
    }
}

class Pipe {
    do_:number;
    di:number;
    material:PipeMaterial;
    roughness:number;
    k:number;
    fluid:Fluid;
    insul:Insul;
    clad:Clad;
    insulThk:number;
    cladThk:number;
    

    // static Roughness = {
    //     copper_pipe: (0.000005 + 0.00001) / 2,
    //     non_corrosive_pipe: (0.00005 + 0.0001) / 2,
    //     mildly_corrosive_pipe: (0.0001 + 0.0002) / 2,
    //     deep_corrosive_pipe: (0.0002 + 0.0005) / 2,
    //     reel_pipe: 0.00033,
    //     cast_iron_pipe: (0.0005 + 0.00085) / 2,
    //     glass_pipe: (0.0000015 + 0.00001) / 2
    // };

    constructor() {
        this.do_ = 0;
        this.di = 0;
        this.material = new PipeMaterial();
        this.roughness = 0;
        this.k = 0;
        this.fluid = new Fluid();
        this.insul = new Insul();
        this.clad = new Clad();
        this.insulThk = 0;
        this.cladThk = 0;   
    }


    /**
     * 单位长度质量 kg/m
     */
    weight():number {
        return cylinderArea(this.di, this.do_) * this.material.getDensity();
    }

    area():number {
        return circleCircumference(this.do_);
    }

    fluidWeight():number {
        return circleArea(this.di)* this.fluid.getDensity();
    }

    waterWeight():number {
        return circleArea(this.di) * 1000;
    }

    insulVolume():number {
        return cylinderArea(this.do_, this.do_ + 2 * this.insulThk);
    }

    insulWeight():number {
        return cylinderArea(this.do_, this.do_ + 2 * this.insulThk) * this.insul.getDensity();
    }

    cladArea():number {
        return circleCircumference(this.do_ + 2 * this.insulThk);
    }

    cladWeight():number {
        const cladDo = this.do_ + 2 * this.insulThk + 2 * this.cladThk;
        const cladDi = this.do_ + 2 * this.insulThk;
        return cylinderArea(cladDi, cladDo) * this.clad.getDensity();
    }

    velocity():number {
        return this.fluid.getFlowRate_volume() / circleArea(this.di);
    }

    diameter_velocity(velocity:number):number {
        return 2 * Math.sqrt(this.fluid.getFlowRate_volume() / velocity / Math.PI);
    }

    diameter_pressureDrop(length:number, pressureDrop:number /* Pa/m */):number {
        return 0.6568905 * Math.pow(this.fluid.getDensity(), 0.207) 
                * Math.pow(this.fluid.getViscosity(), 0.033)
                * Math.pow(length, 0.207)
                * Math.pow(this.fluid.getFlowRate_volume(), 0.38)
                * Math.pow(pressureDrop, -0.207);
        //0.007 * Math.pow(3600,0.38)*Math.pow(1000,0.207)
    }
    /**
     * 阻力系数
     */
    resistace() {
        const re = reynolds(this.di, this.velocity(), this.fluid.getDensity(), this.fluid.getViscosity());
        let lambda;
        if (re <= 2000) {
            lambda = 64 / re;
        }
        else if (re > 2000 && re <= 4000) {
            lambda = 0.3164 * Math.pow(re, -0.25);
        }
        else if (re > 4000 && re < 396 * this.di / this.roughness * Math.log10(3.7 * this.di / this.roughness)) {
            let x0 = 0, x1 = 0.1;
            do {
                const mid = (x0 + x1) / 2;
                if (1 / Math.pow(mid, 0.5) + 2 * Math.log10(this.roughness / (3.7 * this.di) + 2.51 / (re * Math.pow(mid, 0.5))) > 0) {
                    x0 = mid;
                }
                else {
                    x1 = mid;
                }
            } while (Math.abs(x0 - x1) > 1e-6);
            lambda = (x0 + x1) / 2;
        }
        else {
            let x0 = 0, x1 = 0.1;
            do {
                const mid = (x0 + x1) / 2;
                if (1 / Math.pow(mid, 0.5) + 2 * Math.log10(this.roughness / (3.7 * this.di)) > 0) {
                    x0 = mid;
                }
                else {
                    x1 = mid;
                }
            } while (Math.abs(x0 - x1) > 1e-6);
            lambda = (x0 + x1) / 2;
        }
        return lambda;
    }

    /**
     * 单位长度直管阻力 Pa/m
     */
    _dropPressure_line(resistace:number, velocity:number, density:number) {
        return resistace *  density * Math.pow(velocity, 2) / (2 * this.di);
    }

    dropPressure_line(length:number) {
        return length * this._dropPressure_line(this.resistace(), this.velocity(), this.fluid.getDensity());
    }

    /**
     * 局部阻力 Pa
     */
    _dropPressure_local(velocity:number, density:number) {
        return density * Math.pow(velocity, 2) / 2;
    }

    dropPressure_local(k:number/* 总局部阻力系数 */) {
        return k * this._dropPressure_local(this.velocity(), this.fluid.getDensity());
    }
}

export { Pipe }