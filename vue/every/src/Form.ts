import { Pipe } from "./pipe";
const formData = {
  pipe_diameter_velocity: {
    title: "流速>管径",
    args: {
      flowrate_volume: {
        title: "流量",
        unit: "m3/h",
        html_tag: "input",
        type: "number",
        default_value: "1",
        value: null,
      },
      velocity: {
        title: "流速",
        unit: "m/s",
        html_tag: "input",
        type: "number",
        default_value: 0,
        value: null,
      },
    },
    results: {
      di: {
        title: "内径",
        unit: "mm",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: false,
    method: function () {
      if (
        this.args.flowrate_volume.value != null &&
        this.args.velocity.value != null
      ) {
        const pipe = new Pipe();
        pipe.fluid.flowRate_volume = this.args.flowrate_volume.value / 3600;
        this.results.di.value =
          pipe.diameter_velocity(this.args.velocity.value) * 1000;
      }
    },
  },
  pipe_diameter_drop_pressure: {
    title: "压降>管径",
    args: {
      flowrate_volume: {
        title: "流量",
        unit: "m3/h",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      density: {
        title: "密度",
        unit: "kg/m3",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      viscosity: {
        title: "运动粘度",
        unit: "m2/s",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      length: {
        title: "管长",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      drop_pressure: {
        title: "压降",
        unit: "MPa",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      di: {
        title: "内径",
        unit: "mm",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: false,
    method: function () {
      if (
        !verifyArg(
          this.args.flowrate_volume.value,
          this.args.density.value,
          this.args.viscosity.value,
          this.args.length.value,
          this.args.drop_pressure.value
        )
      ) {
        alert("输入数据错误!");
        return;
      }

      const pipe = new Pipe();
      pipe.fluid.flowRate_volume = this.args.flowrate_volume.value / 3600;
      pipe.fluid.setDensity(this.args.density.value);
      pipe.fluid.setViscosity(this.args.viscosity.value);
      this.results.di.value =
        pipe.diameter_pressureDrop(
          this.args.length.value,
          this.args.drop_pressure.value * 1e6
        ) * 1000;
    },
  },
  pipe_drop_pressure: {
    title: "阻力",
    args: {
      roughness: {
        title: "管道类别",
        html_tag: "select",
        value: 0,
      },
      di: {
        title: "管道内径",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      length: {
        title: "长度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      flowrate_mass: {
        title: "流量",
        unit: "kg/h",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      density: {
        title: "密度",
        unit: "kg/m3",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      viscosity: {
        title: "运动粘度",
        unit: "m2/s",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      elbow45: {
        title: "45°弯头",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 0.35,
      },
      elbow90: {
        title: "90°弯头",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 0.75,
      },
      elbow90_x: {
        title: "90°斜接弯头",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 1.3,
      },
      elbow180: {
        title: "180°弯头",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 1.5,
      },
      globeValve: {
        title: "截止阀（全开）",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 6,
      },
      angleValve: {
        title: "角阀（全开）",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 3,
      },
      gateValve: {
        title: "闸阀（全开）",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 0.17,
      },
      plugValve: {
        title: "旋塞阀（全开）",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 0.05,
      },
      butterflyValve: {
        title: "蝶阀（全开）",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 0.24,
      },
      checkValve0: {
        title: "旋启式止回阀",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 2,
      },
      checkValve1: {
        title: "升降式止回阀",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 10,
      },
      footValve: {
        title: "底阀",
        unit: "个",
        html_tag: "input",
        type: "number",
        value: 0,
        k: 15,
      },
    },
    results: {
      velocity: {
        title: "流速",
        unit: "m/s",
        value: 0,
      },
      line_drop_pressure: {
        title: "直管阻力",
        unit: "MPa",
        value: 0,
      },
      local_drop_pressure: {
        title: "局部阻力",
        unit: "MPa",
        value: 0,
      },
      total_drop_pressure: {
        title: "总阻力",
        unit: "MPa",
        value: 0,
      },
    },
    options: {
      roughness: [
        { value: "0.0000075", text: "无缝黄铜、铜及铅管" },
        { value: "0.000075", text: "操作中基本无腐蚀的无缝钢管" },
        { value: "0.00015", text: "操作中有轻度腐蚀的无缝钢管" },
        { value: "0.00035", text: "操作中有显著腐蚀的无缝钢管" },
        { value: "0.00033", text: "钢板卷管" },
        { value: "0.000675", text: "铸铁管" },
        { value: "0.00000575", text: "干净的玻璃管" },
      ],
    },
    is_multiple: true,
    has_total_row: true,
    method() {
      for (const key in [
        "roughness",
        "di",
        "length",
        "flowrate_mass",
        "density",
        "viscosity",
      ]) {
        if (Object.prototype.hasOwnProperty.call(this.args, key)) {
          if ((this.args as any)[key].value == 0) {
            alert("输入数据错误!");
            return;
          }
        }
      }
      const pipe = new Pipe();
      pipe.roughness = this.args.roughness.value;
      pipe.di = this.args.di.value / 1000;
      pipe.fluid.flowRate_mass = this.args.flowrate_mass.value / 3600;
      pipe.fluid.setDensity(this.args.density.value);
      pipe.fluid.setViscosity(this.args.viscosity.value);
      this.results.velocity.value = pipe.velocity();
      this.results.line_drop_pressure.value =
        pipe.dropPressure_line(this.args.length.value) / 1e6;

      let k = 0;
      [
        "elbow45",
        "elbow90",
        "elbow90_x",
        "elbow180",
        "globeValve",
        "angleValve",
        "gateValve",
        "plugValve",
        "butterflyValve",
        "checkValve0",
        "checkValve1",
        "footValve",
      ].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.args, key)) {
          k += (this.args as any)[key].k * (this.args as any)[key].value;
        }
      });

      this.results.local_drop_pressure.value = pipe.dropPressure_local(k);
      this.results.total_drop_pressure.value =
        this.results.line_drop_pressure.value +
        this.results.local_drop_pressure.value;
    },
  },
  pipe_weight: {
    title: "钢管重量",
    args: {
      do_: {
        title: "外径",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      thk: {
        title: "壁厚",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      density: {
        title: "管材密度",
        unit: "kg/m3",
        html_tag: "input",
        type: "number",
        value: 7850,
      },
      length: {
        title: "长度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      per_weight: {
        title: "单量",
        unit: "kg/m",
        value: 0,
      },
      weight: {
        title: "总量",
        unit: "kg",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: true,
    method() {
      if (
        verifyArg(
          this.args.do_.value,
          this.args.thk.value,
          this.args.density.value
        )
      ) {
        alert("输入数据有误!");
        return;
      }

      const pipe = new Pipe();
      pipe.do_ = this.args.do_.value / 1000;
      pipe.di = this.args.do_.value / 1000 - (2 * this.args.thk.value) / 1000;
      pipe.material.density = this.args.density.value;

      this.results.per_weight.value = pipe.weight();
      this.results.weight.value = pipe.weight() * this.args.length.value;
    },
  },
  pipe_insul_weight: {
    title: "管道跨距",
    args: {
      do_: {
        title: "外径",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      thk: {
        title: "壁厚",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      insul_thk: {
        title: "保温厚",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      insul_density: {
        title: "保温密度",
        unit: "mm",
        html_tag: "input",
        type: "number",
        default_value: 200,
      },
      clad_thk: {
        title: "保护层厚",
        unit: "mm",
        html_tag: "input",
        type: "number",
        default_value: 0.6,
      },
      clad_density: {
        title: "保护层密度",
        unit: "mm",
        html_tag: "input",
        type: "number",
        default_value: 2720,
      },
      length: {
        title: "长度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      per_weight: {
        title: "单重",
        unit: "kg",
        value: 0,
      },
      total_weight: {
        title: "总重",
        unit: "kg",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: true,
  },
  pipe_anticorrosion_material: {
    title: "防腐材料量",
    args: {
      do_: {
        title: "管道外径",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      length: {
        title: "长度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      anticorrosion_area: {
        title: "刷漆量",
        unit: "m2",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: true,
  },
  pipe_insulation_material: {
    title: "绝热材料量",
    args: {
      do_: {
        title: "外径",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      insul_thk: {
        title: "绝热层厚",
        unit: "mm",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      length: {
        title: "长度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      insul_volume: {
        title: "绝热材料量",
        unit: "m3",
        value: 0,
      },
      clad_area: {
        title: "保护层材料量",
        unit: "m2",
        value: 0,
      },
    },
    options: {},
    is_multiple: true,
    has_total_row: true,
  },
  material_property: {
    title: "物性",
    args: {
      fluid_name: {
        title: "名称",
        html_tag: "select",
        value: 0,
      },
      temperture: {
        title: "温度",
        unit: "℃",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      pressure: {
        title: "压力",
        unit: "MPa(a)",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      density: {
        title: "密度",
        unit: "kg/m3",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      enthalpy: {
        title: "焓值",
        unit: "kj/kg",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      entropy: {
        title: "比熵",
        unit: "kj/kg/K",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      internal_energy: {
        title: "内能",
        unit: "kj/kg",
        html_tag: "input",
        type: "number",
        value: 0,
      },
      vapor_quality: {
        title: "干度",
        unit: "m",
        html_tag: "input",
        type: "number",
        value: 0,
      },
    },
    results: {
      viscosity: {
        title: "粘度",
        unit: "m2/s",
        value: 0,
      },
      z: {
        title: "压缩系数",
        unit: "",
        value: 0,
      },
    },
    options: {
      fluid_name: [
        { value: "1-Butene", text: "1-Butene" },
        { value: "Acetone", text: "Acetone" },
        { value: "Air", text: "Air" },
        { value: "Ammonia", text: "Ammonia" },
        { value: "Argon", text: "Argon" },
        { value: "Benzene", text: "Benzene" },
        { value: "CarbonDioxide", text: "CarbonDioxide" },
        { value: "CarbonMonoxide", text: "CarbonMonoxide" },
        { value: "CarbonylSulfide", text: "CarbonylSulfide" },
        { value: "CycloHexane", text: "CycloHexane" },
        { value: "CycloPropane", text: "CycloPropane" },
        { value: "Cyclopentane", text: "Cyclopentane" },
        { value: "D4", text: "D4" },
        { value: "D5", text: "D5" },
        { value: "D6", text: "D6" },
        { value: "Deuterium", text: "Deuterium" },
        { value: "Dichloroethane", text: "Dichloroethane" },
        { value: "DiethylEther", text: "DiethylEther" },
        { value: "DimethylCarbonate", text: "DimethylCarbonate" },
        { value: "DimethylEther", text: "DimethylEther" },
        { value: "Ethane", text: "Ethane" },
        { value: "Ethanol", text: "Ethanol" },
        { value: "EthylBenzene", text: "EthylBenzene" },
        { value: "Ethylene", text: "Ethylene" },
        { value: "EthyleneOxide", text: "EthyleneOxide" },
        { value: "Fluorine", text: "Fluorine" },
        { value: "HFE143m", text: "HFE143m" },
        { value: "HeavyWater", text: "HeavyWater" },
        { value: "Helium", text: "Helium" },
        { value: "Hydrogen", text: "Hydrogen" },
        { value: "HydrogenChloride", text: "HydrogenChloride" },
        { value: "HydrogenSulfide", text: "HydrogenSulfide" },
        { value: "IsoButane", text: "IsoButane" },
        { value: "IsoButene", text: "IsoButene" },
        { value: "Isohexane", text: "Isohexane" },
        { value: "Isopentane", text: "Isopentane" },
        { value: "Krypton", text: "Krypton" },
        { value: "MD2M", text: "MD2M" },
        { value: "MD3M", text: "MD3M" },
        { value: "MD4M", text: "MD4M" },
        { value: "MDM", text: "MDM" },
        { value: "MM", text: "MM" },
        { value: "Methane", text: "Methane" },
        { value: "Methanol", text: "Methanol" },
        { value: "MethylLinoleate", text: "MethylLinoleate" },
        { value: "MethylLinolenate", text: "MethylLinolenate" },
        { value: "MethylOleate", text: "MethylOleate" },
        { value: "MethylPalmitate", text: "MethylPalmitate" },
        { value: "MethylStearate", text: "MethylStearate" },
        { value: "Neon", text: "Neon" },
        { value: "Neopentane", text: "Neopentane" },
        { value: "Nitrogen", text: "Nitrogen" },
        { value: "NitrousOxide", text: "NitrousOxide" },
        { value: "Novec649", text: "Novec649" },
        { value: "OrthoDeuterium", text: "OrthoDeuterium" },
        { value: "OrthoHydrogen", text: "OrthoHydrogen" },
        { value: "Oxygen", text: "Oxygen" },
        { value: "ParaDeuterium", text: "ParaDeuterium" },
        { value: "ParaHydrogen", text: "ParaHydrogen" },
        { value: "Propylene", text: "Propylene" },
        { value: "Propyne", text: "Propyne" },
        { value: "R11", text: "R11" },
        { value: "R113", text: "R113" },
        { value: "R114", text: "R114" },
        { value: "R115", text: "R115" },
        { value: "R116", text: "R116" },
        { value: "R12", text: "R12" },
        { value: "R123", text: "R123" },
        { value: "R1233zd(E)", text: "R1233zd(E)" },
        { value: "R1234yf", text: "R1234yf" },
        { value: "R1234ze(E)", text: "R1234ze(E)" },
        { value: "R1234ze(Z)", text: "R1234ze(Z)" },
        { value: "R124", text: "R124" },
        { value: "R125", text: "R125" },
        { value: "R13", text: "R13" },
        { value: "R134a", text: "R134a" },
        { value: "R13I1", text: "R13I1" },
        { value: "R14", text: "R14" },
        { value: "R141b", text: "R141b" },
        { value: "R142b", text: "R142b" },
        { value: "R143a", text: "R143a" },
        { value: "R152A", text: "R152A" },
        { value: "R161", text: "R161" },
        { value: "R21", text: "R21" },
        { value: "R218", text: "R218" },
        { value: "R22", text: "R22" },
        { value: "R227EA", text: "R227EA" },
        { value: "R23", text: "R23" },
        { value: "R236EA", text: "R236EA" },
        { value: "R236FA", text: "R236FA" },
        { value: "R245ca", text: "R245ca" },
        { value: "R245fa", text: "R245fa" },
        { value: "R32", text: "R32" },
        { value: "R365MFC", text: "R365MFC" },
        { value: "R40", text: "R40" },
        { value: "R404A", text: "R404A" },
        { value: "R407C", text: "R407C" },
        { value: "R41", text: "R41" },
        { value: "R410A", text: "R410A" },
        { value: "R507A", text: "R507A" },
        { value: "RC318", text: "RC318" },
        { value: "SES36", text: "SES36" },
        { value: "SulfurDioxide", text: "SulfurDioxide" },
        { value: "SulfurHexafluoride", text: "SulfurHexafluoride" },
        { value: "Toluene", text: "Toluene" },
        { value: "Water", text: "Water" },
        { value: "Xenon", text: "Xenon" },
        { value: "cis-2-Butene", text: "cis-2-Butene" },
        { value: "m-Xylene", text: "m-Xylene" },
        { value: "n-Butane", text: "n-Butane" },
        { value: "n-Decane", text: "n-Decane" },
        { value: "n-Dodecane", text: "n-Dodecane" },
        { value: "n-Heptane", text: "n-Heptane" },
        { value: "n-Hexane", text: "n-Hexane" },
        { value: "n-Nonane", text: "n-Nonane" },
        { value: "n-Octane", text: "n-Octane" },
        { value: "n-Pentane", text: "n-Pentane" },
        { value: "n-Propane", text: "n-Propane" },
        { value: "n-Undecane", text: "n-Undecane" },
        { value: "o-Xylene", text: "o-Xylene" },
        { value: "p-Xylene", text: "p-Xylene" },
        { value: "trans-2-Butene", text: "trans-2-Butene" },
      ],
    },
    is_multiple: true,
    has_total_row: false,
  },
};

/**
 *
 * @param args
 * @returns
 */
function verifyArg(...args: any) {
  for (const val of args) {
    if (val == null) {
      return false;
    }
  }
  return true;
}
export default formData;
