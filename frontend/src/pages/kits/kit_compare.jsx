import React, { useEffect, useState, useRef } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';

import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


const filterVTXsByType = (cameraType, vtxs) => {
    if (!vtxs || !cameraType) {
      return {};
    }
  
    const filteredVTXs = {};
  
    for (const key in vtxs) {
      const vtx = vtxs[key];
      if (
        (cameraType === "Аналогова" && vtx.Тип === "Аналогова") ||
        (cameraType === "Цифрова" && vtx.Тип === "Цифрова")
      ) {
        filteredVTXs[key] = vtx;
      }
    }
  
    return filteredVTXs;
};

const filterCamerasByVTXType = (vtxType, cameras) => {
    if (!cameras || !vtxType) {
      return {};
    }
  
    const filteredCameras = {};
  
    for (const key in cameras) {
      const camera = cameras[key];
      if (
        (vtxType === "Аналогова" && camera.Тип === "Аналогова") ||
        (vtxType === "Цифрова" && camera.Тип === "Цифрова")
      ) {
        filteredCameras[key] = camera;
      }
    }
  
    return filteredCameras;
};

const filterAntennasByFrequency = (receiverFrequencies, antennas) => {
    if (!antennas || !receiverFrequencies || receiverFrequencies.length === 0) {
      return {};
    }
  
    const filteredAntennas = {};
  
    for (const key in antennas) {
      const antenna = antennas[key];
      const antennaFrequencies = antenna["Робоча частота"];
  
      if (antennaFrequencies.some(freq => receiverFrequencies.includes(freq))) {
        filteredAntennas[key] = antenna;
      }
    }
  
    return filteredAntennas;
};

const filterReceiversByFrequency = (antennaFrequencies, receivers) => {
    if (!receivers || !antennaFrequencies || antennaFrequencies.length === 0) {
      return {};
    }
  
    const filteredReceivers = {};
  
    for (const key in receivers) {
      const receiver = receivers[key];
      const receiverFrequencies = receiver["Робоча частота"];
  
      if (receiverFrequencies.some(freq => antennaFrequencies.includes(freq))) {
        filteredReceivers[key] = receiver;
      }
    }
  
    return filteredReceivers;
};

const filterBatteriesByMotor = (motor, batteries) => {
    if (!batteries || !motor) {
      return {};
    }
  
    const motorMaxCurrent = motor["Максимальний струм"];
  
    const filteredBatteries = {};
  
    for (const key in batteries) {
      const battery = batteries[key];
      const batteryPeakCurrent = battery["Піковий струм"];
  
      if (batteryPeakCurrent >= motorMaxCurrent) {
        filteredBatteries[key] = battery;
      }
    }
  
    return filteredBatteries;
};

const filterMotorsByTurnRegulator = (turn_regulator, motors) => {
    turn_regulator = original_turn_regulators[turn_regulator];
    const turnRegulatorMaxCurrent = turn_regulator["Максимальний струм"] || Infinity;
    console.log(turn_regulator);
    const filteredMotors = Object.entries(motors)
      .filter(([motorName, motorSpecs]) => {
        console.log(`${motorSpecs["Максимальний струм"]} == ${turnRegulatorMaxCurrent}`);
        const motorMaxCurrent = motorSpecs["Максимальний струм"] || 0;
        return motorMaxCurrent <= turnRegulatorMaxCurrent;
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredMotors;
};

const filterRegulatorsByMotor = (motor, turn_regulators) => {
    motor = original_motors[motor];
    const motorMaxCurrent = motor["Максимальний струм"] || Infinity;
  
    const filteredRegulators = Object.entries(turn_regulators)
      .filter(([regulatorName, regulatorSpecs]) => {
        const regulatorMaxCurrent = regulatorSpecs["Максимальний струм"] || 0;
        return regulatorMaxCurrent >= motorMaxCurrent;
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredRegulators;
};

const filterMotorsByStack = (stack, motors) => {
    stack = original_flight_controller_aios[stack];
    const turnRegulatorMaxCurrent = stack["Максимальний струм"] || Infinity;

    const filteredMotors = Object.entries(motors)
      .filter(([motorName, motorSpecs]) => {
        console.log(`${motorSpecs["Максимальний струм"]} == ${turnRegulatorMaxCurrent}`);
        const motorMaxCurrent = motorSpecs["Максимальний струм"] || 0;
        return motorMaxCurrent <= turnRegulatorMaxCurrent;
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredMotors;
};

const filterStacksByMotor = (motor, stacks) => {
    motor = original_motors[motor];
    const motorMaxCurrent = motor["Максимальний струм"] || Infinity;
  
    const filteredRegulators = Object.entries(stacks)
      .filter(([regulatorName, regulatorSpecs]) => {
        const regulatorMaxCurrent = regulatorSpecs["Максимальний струм"] || 0;
        return regulatorMaxCurrent >= motorMaxCurrent;
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredRegulators;
};

const filterPropellersByMotor = (motor, propellers) => {
    motor = original_motors[motor];
    const motorShaftDiameter = motor["Діаметр валу"];

    const filteredPropellers = Object.entries(propellers)
      .filter(([propellerName, propellerSpecs]) => {
        const propellerShaftDiameter = propellerSpecs["Вал"];
        const minShaftDiameter = motorShaftDiameter;
        const maxShaftDiameter = motorShaftDiameter + 0.5;
        return (
          propellerShaftDiameter >= minShaftDiameter &&
          propellerShaftDiameter <= maxShaftDiameter
        );
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredPropellers;
};

// Відео
const original_cameras = {
    "Caddx Ratel 2 V2": {
        "Тип": "Аналогова",
        "Роздільна здатність": "1200 TVL",
        "Вага": 5.9
    },
    "RunCam Phoenix 2 SP": {
        "Тип": "Аналогова",
        "Роздільна здатність": "1500 TVL",
        "Вага": 7.5
    },
    "Caddx Nebula Pro Nano": {
        "Тип": "Цифрова",
        "Роздільна здатність": "720p/120 кадрів в секунду",
        "Вага": 3.5
    },
    "Foxeer Razer Pico 16:9": {
        "Тип": "Аналогова",
        "Роздільна здатність": "1200 TVL",
        "Вага": 1.65
    },
    "RunCam Nano 4": {
        "Тип": "Аналогова",
        "Роздільна здатність": "800 TVL",
        "Вага": 1.5
    }
};

const original_vtxs = {
    "AKK FX2 Ultimate": {
        "Тип": "Аналогова",
        "Вихідна потужність": "25/200/500/800/1200mW",
        "Частота": 5.8,
        "Вага": 9.6
    },
    "TBS UNIFY PRO32 HV (MMCX)": {
        "Тип": "Аналогова",
        "Вихідна потужність": "14 дБм (25 мВт), 20 дБм (100 мВт), 26 дБм (400 мВт), 30 дБм + (1000 мВт +)",
        "Частота": 5.8,
        "Формат відео": "NTSC / PAL",
        "Вага": 8.7
    },
    "BETAFPV M03 5,8G": {
        "Тип": "Аналогова",
        "Вихідна потужність": "PIT/25/100/200/400 мВт (V1.1, регульована)",
        "Частота": 5.8,
        "Формат відео": "NTSC / PAL",
        "Вага": 1.1
    },
    "AKK Race Ranger 1.6W 5.8GHz 48CH": {
        "Тип": "Аналогова",
        "Вихідна потужність": "200mW/400mW/800mW/1600mW",
        "Частота": 5.8,
        "Формат відео": "NTSC / PAL",
        "Вага": 16.8
    },
    "Foxeer Reaper Infinity VTX 5W 5.8Ghz 40Ch": {
        "Тип": "Аналогова",
        "Вихідна потужність": "25мВт/500мВт/1500мВт/3000мВт/5000мВт",
        "Частота": 5.8,
        "Формат відео": "NTSC / PAL",
        "Вага": 58.0
    }
}

const original_video_systems = {
    "Caddx Polar Vista": {
        "Тип": "Цифрова",
        "Частота": 5.8,
        "Вага": 35.0
    },
    "Caddx Walksnail Avatar mini": {
        "Тип": "Цифрова",
        "Частота": 5.8,
        "Вага": 7.4
    },
    "RunCam Airunit WASP": {
        "Тип": "Цифрова",
        "Частота": 5.8,
        "Вага": 33.0
    },
    "Caddx Walksnail Avatar HD Mini": {
        "Тип": "Цифрова",
        "Частота": 5.8,
        "Вага": 10.3
    },
    "RunCam Link Wasp Nano": {
        "Тип": "Цифрова",
        "Частота": 5.8,
        "Вага": 25.5
    }
}

// Польотні контроллери / Стек
const original_turn_regulators = {
    "T-Motor F55A Pro II ESC": {
        "Тип": "4",
        "Робоча напруга": "10.0-27.0 В",
        "Максимальний струм": 55,
        "Вага": 74.0
    },
    "T-Motor F35A 3-6S BLHeli-32": {
        "Тип": "Одинарний",
        "Робоча напруга": "11.1-22.2 В",
        "Максимальний струм": 35,
        "Вага": 8.1
    },
    "HOBBYWING XRotor 40A OPTO 2-6S": {
        "Тип": "Одинарний",
        "Робоча напруга": "7.4-22.2 В",
        "Максимальний струм": 60,
        "Вага": 26.0
    },
    "SPEEDYBEE BLS 50A 30X30 4В1 ESC": {
        "Тип": "4",
        "Робоча напруга": "16.8-25.2 В",
        "Максимальний струм": 66,
        "Вага": 56.0
    },
    "60A 2-6S Li-po HOBBYWING SKY WALKER": {
        "Тип": "Одинарний",
        "Робоча напруга": "7.4-22.2 В",
        "Максимальний струм": 60,
        "Вага": 14.0
    }
}

const original_flight_controllers = {
    "SpeedyBee F405 V3 BLS 50A": {
        // "Максимальний струм": 55,
        "Робоча напруга": "7.0-22.0 В",
        "Процесор":	"STM32F722",
        "Вага": 9.0
    },
    "Happymodel CrazyF411 ELRS": {
        // "Максимальний струм": 25,
        "Робоча напруга": "7.0-17.0 В",
        "Процесор":	"STM32F411CEU6",
        "Вага": 4.9
    },
    "iFlight SucceX-D Mini F7 TwinG": {
        // "Максимальний струм": 25,
        "Робоча напруга": "5.0-26.0 В",
        "Процесор":	"STM32F722RET6",
        "Вага": 6.5
    },
    "JHEMCU GF30F722 ICM F722, 30x30 BS-03": {
        "BEC": "5В 2.5А - 10В 2А",
        "Процесор":	"STM32F722RET6",
        "Вага": 8.8
    },
    "Happymodel DiamondF4 ELRS": {
        "BEC": "5В 1.0А",
        "Процесор":	"STM32F411CEU6",
        "Вага": 3.4
    }
}

const original_flight_controller_aios = {
    "SpeedyBee F405 V3 BLS 50A": {
        "Максимальний струм": 60,
        "Робоча напруга": "11.1-22.2 В",
        "Вага": 23.4,
        "Буззер": true
    },
    "Hobbyporter F405+65A": {
        "Максимальний струм": 65,
        "Робоча напруга": "7.4-22.2 В",
        "Вага": 20.5,
        "Буззер": false
    },
    "BETAFPV F4 1S 12A AIO 2022": {
        "Максимальний струм": 25,
        "Робоча напруга": "3.7-7.4 В",
        "Процесор": "STM32F411CEU6",
        "Вага": 4.74,
        "Буззер": false
    },
    "Happymodel ELRS F4 2G4 AIO": {
        "Максимальний струм": 6,
        "Робоча напруга": "2.9-4.5 В",
        "Процесор": "STM32F411CEU6",
        "Вага": 4.57,
        "Буззер": false
    },
    "FlashHobby F405 (BLS 60A, 30.5x30.5, 4-in-1ESC)": {
        "Максимальний струм": 60,
        "Робоча напруга": "11.1-22.2 В",
        "Процесор": "STM32F405",
        "Вага": 7.5,
        "Буззер": false
    }
}

const filterMotorsByPropeller = (propeller, motors) => {
    propeller = original_propellers[propeller];
    const propellerShaftDiameter = propeller["Вал"];
  
    const filteredMotors = Object.entries(motors)
      .filter(([motorName, motorSpecs]) => {
        const motorShaftDiameter = motorSpecs["Діаметр валу"];
        const minShaftDiameter = propellerShaftDiameter - 0.5;
        const maxShaftDiameter = propellerShaftDiameter + 0.5;

        return (
          motorShaftDiameter >= minShaftDiameter &&
          motorShaftDiameter <= maxShaftDiameter
        );
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  
    return filteredMotors;
};

// Матеріальні компоненти
const original_propellers = {
    "HQProp 7x4x3 полікарбонат": {
        "Діаметр пропелера": "7 дюймів",
        "Крок": 4,
        "Лопаті": 3,
        "Матеріал": "полікарбонат",
        "Вал": 5.0,
        "Вага": 36.4
    },
    "Gemfan 31mm 1208-3 1.5мм": {
        "Діаметр пропелера": "31 мм",
        "Крок": 0.8,
        "Лопаті": 3,
        "Матеріал": "полікарбонат",
        "Вал": 1.49,
        "Вага": 0.84
    },
    "HQprop 7040": {
        "Діаметр": "7 дюймів",
        "Крок": 4,
        "Лопаті": 3,
        "Матеріал": "полікарбонат",
        "Вага": 9.1,
        "Вал": 20.0
    },
    "Gemfan 8040": {
        "Діаметр пропелера": "8 дюймів",
        "Крок": 4.0,
        "Лопаті": 3,
        "Матеріал": "армований полікарбонат",
        "Вал": 5.0,
        "Вага": 42.0
    },
    "GemFan 8060-3": {
        "Діаметр пропелера": "8 дюймів",
        "Крок": 6.0,
        "Лопаті": 3,
        "Матеріал": "армований нейлон",
        "Вал": 5.0,
        "Вага": 42.0
    }
}

const original_motors = {
    "T-Motor F40 Pro II 2400KV": {
        "Максимальний струм": 49.62,
        "Робоча напруга": "11.1-14.8 В",
        "Діаметр валу": 5.0,
        "Максимальна потужність": "745.8 Вт",
        "Рекомендовані пропелери": "-",
        "Рекомендована батарея": "3S Li-Po",
        "Вага": 110.0,
        "Діаметр мотору": "27.9 мм.",
        "Розмір отвору вала": "5 мм.",
        "Діаметр кріпильних отворів": "М3",
        "Відстань кріпильних отворів від центру": "16 мм."
    },
    "Emax ECO II 2807 1300KV": {
        "Максимальний струм": 50.0,
        "Робоча напруга": "11.1-22.2 В",
        "Діаметр валу": 4.0,
        "Максимальна потужність": "1310 Вт",
        "Рекомендовані пропелери": "6 дюймів",
        "Рекомендована батарея": "3-6s LiPo",
        "Вага": 190.4,
        "Діаметр мотору": "33.9 мм.",
        "Розмір отвору вала": "4 мм.",
        "Діаметр кріпильних отворів": "М3",
        "Відстань кріпильних отворів від центру": "19 мм."
    },
    "T-Motor F40 PRO III 2306.5 1600KV": {
        "Максимальний струм": 37.3,
        "Робоча напруга": "14.8-22.2 В",
        "Діаметр валу": 4.0,
        "Максимальна потужність": "750.0 Вт",
        "Рекомендовані пропелери": "GF5149-3\", GF5150-3\", GF5152-3",
        "Рекомендована батарея": "4-6S",
        "Вага": 134.0,
        "Діаметр мотору": "27.9 мм.",
        "Розмір отвору вала": "4 мм.",
        "Діаметр кріпильних отворів": "М3",
        "Відстань кріпильних отворів від центру": "16 мм."
    },
    "Happymodel SE0802 22000KV": {
        "Максимальний струм": 4.0,
        "Робоча напруга": "11.1-14.8 В",
        "Діаметр валу": 1.0,
        "Максимальна потужність": "14.9 Вт",
        "Рекомендовані пропелери": "",
        "Рекомендована батарея": "1-2S LiPo",
        "Вага": 7.6,
        "Діаметр мотору": "10.5 мм.",
        "Розмір отвору вала": "1 мм.",
        "Діаметр кріпильних отворів": "М1.4",
        "Відстань кріпильних отворів від центру": "6.5 мм."
    },
    "T-Motor VELOX VELOCE V2207.5 V2 2550KV": {
        "Максимальний струм": 4.0,
        "Робоча напруга": "11.1-14.8 В",
        "Діаметр валу": 5.0,
        "Максимальна потужність": "557 Вт",
        "Рекомендовані пропелери": "5 дюймів",
        "Рекомендована батарея": "4 - 6S",
        "Вага": 142.4,
        "Діаметр мотору": "27.6 мм.",
        "Розмір отвору вала": "М5",
        "Діаметр кріпильних отворів": "М3",
        "Відстань кріпильних отворів від центру": "16 мм."
    }
}

const original_batteries = {
    "Energy Life Li-Ion 6S2P горизонтальна 21700-P42A 12AWG XT60-F": {
        "Мінімальна напруга": 19.2,
        "Максимальна напруга": 25.2,
        "Номінальна напруга": "21.6 В",
        "Ємність": "8400 мА·год",
        "Конфігурація": "6S2P",
        "Хімія": "Li-Ion",
        "Конектор": "XT60-F",
        "Номінальний струм": 60.0,
        "Піковий струм": 90.0
    },
    "Fullymax 22.2V 1600mAh Li-Po 6S 100C XT60": {
        "Мінімальна напруга": 19.8,
        "Максимальна напруга": 25.2,
        "Номінальна напруга": 22.2,
        "Ємність": "1600 мА·год",
        "Конфігурація": "6S",
        "Хімія": "Li-Ion",
        "Конектор": "XT60",
        "Номінальний струм": 100.0,
        "Піковий струм": 150.0
    }
}

// Зв'язок
const original_receivers = {
    "TBS Crossfire Nano RX (SE)": {
        "Протокол зв'язку": "CROSSFIRE",
        "Робоча частота": [868, 915], // МГц
        "Робоча напруга": "3.3-8.4 В",
        "Вага": 0.5
    },
    "915MHz HappyModel ELRS ES900RX": {
        "Протокол зв'язку": "ELRS",
        "Робоча частота": [915],
        "Робоча напруга": "4.5-5.0 В",
        "Вага": 1.5
    },
    "FrSky RX8R-PRO 2.4 ГГц": {
        "Протокол зв'язку": "ACCST D8 | ACCST D16",
        "Робоча частота": [2450],
        "Робоча напруга": "3.5-10.0 В",
        "Вага": 14.8
    },
    "ELRS Lite RX": {
        "Протокол зв'язку": "ELRS",
        "Робоча частота": [2400, 2500],
        "Робоча напруга": "5.0 В",
        "Вага": 0.44
    },
    "BETAFPV ELRS Lite Receiver": {
        "Протокол зв'язку": "ELRS",
        "Робоча частота": [2400],
        "Робоча напруга": "5.0 В",
        "Вага": 1.0
    }
}

const original_antennas = {
    "RushFPV Cherry 5.8GHz SMA 160mm": {
        "Довжина": 160,
        "Робоча частота": [5800],
        "Вага": 11.5
    },
    "ELRS GEPRC 915 мГц": {
        "Довжина": 75,
        "Робоча частота": [915],
        "Вага": 2.6
    },
    "Happymodel IPEX-MHF3 RX 2.4G": {
        "Довжина": 100,
        "Робоча частота": [2400],
        "Вага": 8.5
    },
    "TrueRC SINGULARITY 2.4 V1 SMA90 RHCP": {
        "Довжина": 96,
        "Робоча частота": [2400],
        "Вага": 9.45
    },
    "Foxeer Lollipop 4 Plus 2.6dBi SMA RHCP": {
        "Довжина": 150,
        "Робоча частота": [5800],
        "Вага": 10.5
    }
}

export const KitsCompare = (props) => {
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [selectedVTX, setSelectedVTX] = useState(null);
    const [selectedVideoSystem, setSelectedVideoSystem] = useState(null);

    const [selectedTurnRegulator, setSelectedTurnRegulator] = useState(null);
    const [selectedFlightController, setSelectedFlightController] = useState(null);
    const [selectedFlightControllerAIO, setSelectedFlightControllerAIO] = useState(null);

    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const [selectedAntenna, setSelectedAntenna] = useState(null);

    const [selectedMotor, setSelectedMotor] = useState(null);
    const [selectedPropeller, setSelectedPropeller] = useState(null);

    const [cameras, setCameras] = useState([]);
    const [vtxs, setVTXs] = useState([]);
    const [video_systems, setVideoSystems] = useState([]);
    const [receivers, setRecievers] = useState([]);
    const [turn_regulators, setTurnRegulators] = useState([]);
    const [flight_controllers, setFlightControllers] = useState([]);
    const [flight_controller_aios, setFlightControllerAIOs] = useState([]);
    const [antennas, setAntennas] = useState([]);
    const [motors, setMotors] = useState([]);
    const [propellers, setPropellers] = useState([]);
    
    const [result, setResult] = useState(null);

    const [amount, setAmount] = useState(null);

    const [batteryCapacity, setBatteryCapacity] = useState(null);
    const [batteryParameters, setBatteryParameters] = useState(null);

    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect (() => {
        setCameras(original_cameras);
        setVTXs(original_vtxs);
        setVideoSystems(original_video_systems);
        setRecievers(original_receivers);
        setTurnRegulators(original_turn_regulators);
        setFlightControllers(original_flight_controllers);
        setFlightControllerAIOs(original_flight_controller_aios);
        setAntennas(original_antennas);
        setMotors(original_motors);
        setPropellers(original_propellers);
    }, []);

    const handleCameraChange = (cameraName) => {
        setSelectedVideoSystem(null);

        setSelectedCamera(cameraName);

        const selectedCamera = cameras[cameraName];
        const cameraType = selectedCamera.Тип;
        const filteredVTXs = filterVTXsByType(cameraType, original_vtxs);
      
        setVTXs(filteredVTXs);
    };
    
    const handleVTXChange = (vtxName) => {
        setSelectedVideoSystem(null);
        
        setSelectedVTX(vtxName);

        const selectedVTX = original_vtxs[vtxName];
        const vtxType = selectedVTX.Тип;
        const filteredCameras = filterCamerasByVTXType(vtxType, original_cameras);
      
        setCameras(filteredCameras);
    };
    
    const handleVideoSystemChange = (videoSystemName) => {
        setSelectedCamera(null);
        setSelectedVTX(null);
        
        setSelectedVideoSystem(videoSystemName);

        setCameras(original_cameras);
        setVTXs(original_vtxs);
    };

    /////////////////////////////// 

    const handleTurnRegulatorChange = (turn_regulator) => {
        setSelectedFlightControllerAIO(null);

        setSelectedTurnRegulator(turn_regulator);

        const filetered_motors = filterMotorsByTurnRegulator(turn_regulator, original_motors);
        setMotors(filetered_motors);
    }

    const handleFlightControllerChange = (flight_controller) => {
        setSelectedFlightControllerAIO(null);

        setSelectedFlightController(flight_controller);
    }

    const handleFlightControllerAIOChange = (flight_controller_aio) => {
        setSelectedTurnRegulator(null);
        setSelectedFlightController(null);

        setSelectedFlightControllerAIO(flight_controller_aio);

        setFlightControllers(original_flight_controllers);
        setTurnRegulators(original_turn_regulators);

        const filetered_motors = filterMotorsByStack(flight_controller_aio, original_motors);
        setMotors(filetered_motors);
    }

    //////////////////////////////

    const handleReceiverChange = (receiver) => {
        setSelectedReceiver(receiver);

        const selectedReceiver = original_receivers[receiver];
        const receiverFrequencies = selectedReceiver["Робоча частота"];
        const filteredAntennas = filterAntennasByFrequency(receiverFrequencies, original_antennas);
      
        setAntennas(filteredAntennas);
    }

    const handleAntennaChange = (antenna) => {
        setSelectedAntenna(antenna);

        const selectedAntenna = original_antennas[antenna];
        const antennaFrequencies = selectedAntenna["Робоча частота"];
        const filteredReceivers = filterReceiversByFrequency(antennaFrequencies, original_receivers);
      
        setRecievers(filteredReceivers);
    }

    const handleMotorChange = (motor) => {
        setSelectedMotor(motor);

        const originalMotor = original_motors[motor];
        setBatteryCapacity(originalMotor["Рекомендована батарея"]);

        setBatteryParameters(
            {
                "Діаметр мотору": originalMotor["Діаметр мотору"],
                "Розмір отвору вала": originalMotor["Розмір отвору вала"],
                "Діаметр кріпильних отворів": originalMotor["Діаметр кріпильних отворів"],
                "Відстань кріпильних отворів від центру": originalMotor["Відстань кріпильних отворів від центру"]
            }
        )

        const filetered_regulators = filterRegulatorsByMotor(motor, original_turn_regulators);
        setTurnRegulators(filetered_regulators);

        const filtered_stacks = filterStacksByMotor(motor, original_flight_controller_aios);
        setFlightControllerAIOs(filtered_stacks);

        const filtered_propellers = filterPropellersByMotor(motor, original_propellers);
        setPropellers(filtered_propellers);
    }

    const handlePropellerChange = (propeller) => {
        setSelectedPropeller(propeller);

        const filtered_motors = filterMotorsByPropeller(propeller, original_motors);
        setMotors(filtered_motors);
    }

    const handleButtonClick = () => {
        const result = {};
        const buf_amount = {};
        let totalWeight = 0;
      
        const addElementToResult = (element, key) => {
          if (element) {
            result[key] = { ...element };
            if (element.Вага) {
              totalWeight += element.Вага;
            }
          }
        };

        if (cameras[selectedCamera] && typeof cameras[selectedCamera] === 'object') {
            addElementToResult(cameras[selectedCamera], "Камера");
            buf_amount[selectedCamera] = 1;
        }
        if (vtxs[selectedVTX] && typeof vtxs[selectedVTX] === 'object') {
            addElementToResult(vtxs[selectedVTX], "Відеопередавач");
            buf_amount[selectedVTX] = 1;
        }
        if (video_systems[selectedVideoSystem] && typeof video_systems[selectedVideoSystem] === 'object') {
            addElementToResult(video_systems[selectedVideoSystem], "Відеосистема");
            buf_amount[selectedVideoSystem] = 1;
        }
        if (receivers[selectedReceiver] && typeof receivers[selectedReceiver] === 'object') {
            addElementToResult(receivers[selectedReceiver], "Приймач");
            buf_amount[selectedReceiver] = 1;
        }
        if (turn_regulators[selectedTurnRegulator] && typeof turn_regulators[selectedTurnRegulator] === 'object') {
            addElementToResult(turn_regulators[selectedTurnRegulator], "Регулятор обертів");
            if (turn_regulators[selectedTurnRegulator].Тип === "Одинарний") {
                buf_amount[selectedTurnRegulator] = 1;
            } else if (turn_regulators[selectedTurnRegulator].Тип === "4") {
                buf_amount[selectedTurnRegulator] = 4;
            }
        }
        if (flight_controllers[selectedFlightController] && typeof flight_controllers[selectedFlightController] === 'object') {
            addElementToResult(flight_controllers[selectedFlightController], "Польотний контролер");
            buf_amount[selectedFlightController] = 1;
        }
        if (flight_controller_aios[selectedFlightControllerAIO] && typeof flight_controller_aios[selectedFlightControllerAIO] === 'object') {
            addElementToResult(flight_controller_aios[selectedFlightControllerAIO], "Польотний контролер AIO");
            buf_amount[selectedFlightControllerAIO] = 1;
        }
        if (antennas[selectedAntenna] && typeof antennas[selectedAntenna] === 'object') {
            addElementToResult(antennas[selectedAntenna], "Антена");
            buf_amount[selectedAntenna] = 1;
        }
        if (motors[selectedMotor] && typeof motors[selectedMotor] === 'object') {
            addElementToResult(motors[selectedMotor], "Мотор");
            buf_amount[selectedMotor] = 4;
        }
        if (propellers[selectedPropeller] && typeof propellers[selectedPropeller] === 'object') {
            addElementToResult(propellers[selectedPropeller], "Пропелер");
            buf_amount[selectedPropeller] = 4;
        }

        setResult({ data: result, totalWeight });
        setAmount(buf_amount);

        setIsDuplicate(false);
    }

    const handleKitSave = () => {
        console.log("Amount = ", amount);
        const item = {
            "componetsList": amount,
            "battery": batteryCapacity,
            "frame": {
                "Діаметр мотору": batteryParameters["Діаметр мотору"],
                "Розмір отвору вала": batteryParameters["Розмір отвору вала"],
                "Діаметр кріпильних отворів": batteryParameters["Діаметр кріпильних отворів"],
                "Відстань кріпильних отворів від центру": batteryParameters["Відстань кріпильних отворів від центру"]
            }
        };

        let favorites = JSON.parse(localStorage.getItem('favorite_kits')) || [];
        favorites.push(item);
        console.log("FAVORITES = ", favorites);
        localStorage.setItem('favorite_kits', JSON.stringify(favorites));
        setIsDuplicate(true);
    }

    return (
        <div style={{ paddingTop: "70px" }}>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "30px", marginLeft: "100px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span className="w3-bar-item main-title" style={{ marginTop: "15px", fontSize: "30px" }}>
                        Камера
                    </span>
                    {Object.keys(cameras).map((cameraName, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="camera"
                                    value={cameraName}
                                    checked={selectedCamera === cameraName}
                                    onChange={() => handleCameraChange(cameraName)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{cameraName}</span>
                            </label>
                        </li>
                    ))}
                </div>
                
                {/* /////////////  Відеопередавач  ////////////// */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Відеопередавач (VTX)</span>
                    {Object.keys(vtxs).map((vtx, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="vtx"
                                    value={vtx}
                                    checked={selectedVTX === vtx}
                                    onChange={() => handleVTXChange(vtx)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{vtx}</span>
                            </label>
                        </li>
                    ))}
                </div>
            
                {/* /////////////  Відеосистема  ////////////// */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Відеосистема</span>
                    {Object.keys(video_systems).map((video_system, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="video_system"
                                    value={video_system}
                                    checked={selectedVideoSystem === video_system}
                                    onChange={() => handleVideoSystemChange(video_system)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{video_system}</span>
                            </label>
                        </li>
                    ))}
                </div>
            </div>

            {/* /////////////  Регулятор обертання  ////////////// */}

            <div style={{ width: "min-content", display: "flex", flexDirection: "row", marginTop: "30px", marginLeft: "100px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Регулятор обертання (ESC)</span>
                    {Object.keys(turn_regulators).map((turn_regulator, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="turn_regulator"
                                    value={turn_regulator}
                                    checked={selectedTurnRegulator === turn_regulator}
                                    onChange={() => handleTurnRegulatorChange(turn_regulator)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{turn_regulator}</span>
                            </label>
                        </li>
                    ))}
                </div>
                
                {/* /////////////  Польотний контролер  ////////////// */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Польотний контролер</span>
                    {Object.keys(flight_controllers).map((flight_controller, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="flight_controller"
                                    value={flight_controller}
                                    checked={selectedFlightController === flight_controller}
                                    onChange={() => handleFlightControllerChange(flight_controller)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{flight_controller}</span>
                            </label>
                        </li>
                    ))}
                </div>
            
                {/* /////////////  Польотний контролер (AIO)  ////////////// */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Стек (AIO)</span>
                    {Object.keys(flight_controller_aios).map((flight_controller_aio, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="flight_controller_aio"
                                    value={flight_controller_aio}
                                    checked={selectedFlightControllerAIO === flight_controller_aio}
                                    onChange={() => handleFlightControllerAIOChange(flight_controller_aio)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{flight_controller_aio}</span>
                            </label>
                        </li>
                    ))}
                </div>
            </div>

            {/* ////////  Приймач  //////// */}

            <div style={{ width: "min-content", display: "flex", flexDirection: "row", marginTop: "30px", marginLeft: "100px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Приймач сигналу</span>
                    {Object.keys(receivers).map((receiver, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="receiver"
                                    value={receiver}
                                    checked={selectedReceiver === receiver}
                                    onChange={() => handleReceiverChange(receiver)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{receiver}</span>
                            </label>
                        </li>
                    ))}
                </div>

                {/* ////////  Антена  /////// */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Антена</span>
                    {Object.keys(antennas).map((antenna, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="antenna"
                                    value={antenna}
                                    checked={selectedAntenna === antenna}
                                    onChange={() => handleAntennaChange(antenna)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{antenna}</span>
                            </label>
                        </li>
                    ))}
                </div>

                {/* {/////////  Мотор  //////////} */}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Мотори</span>
                    {Object.keys(motors).map((motor, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="motor"
                                    value={motor}
                                    checked={selectedMotor === motor}
                                    onChange={() => handleMotorChange(motor)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{motor}</span>
                            </label>
                        </li>
                    ))}
                </div>
            </div>

            {/* //////// Пропелер /////// */}

            <div style={{ width: "min-content", display: "flex", flexDirection: "row", marginTop: "30px", marginLeft: "100px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "450px" }}>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Пропелери</span>
                    {Object.keys(propellers).map((propeller, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="propeller"
                                    value={propeller}
                                    checked={selectedPropeller === propeller}
                                    onChange={() => handlePropellerChange(propeller)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{propeller}</span>
                            </label>
                        </li>
                    ))}
                </div>

                {/* /////////////  Батарея  ////////////// */}

                {/* <div>
                    <span style={{ marginTop: "15px", fontSize: "30px" }} className="w3-bar-item main-title">Батарея</span>
                    {Object.keys(batteries).map((battery, index) => (
                        <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "20px" }}>
                            <label className="custom-checkbox">
                                <input
                                    type="radio"
                                    name="battery"
                                    value={battery}
                                    checked={selectedBattery === battery}
                                    onChange={() => handleBatteryChange(battery)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text" style={{ fontSize: "20px" }}>{battery}</span>
                            </label>
                        </li>
                    ))}
                </div> */}
            </div>
            
            <div style={{ paddingTop: "50px", paddingBottom: "50px", paddingLeft: "40%" }}>
                <button align="center"
                    className="btn btn-success"
                    style={{ backgroundColor: 'green', color: 'white' }}
                    onClick={handleButtonClick}
                >
                    Згенерувати характеристики
                </button>
            </div>

            {result && (
                <div className="result" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '45%', marginRight: '2%', paddingLeft: "10%" }}>
                        <h2 align="center">Характеристики комплектуючих</h2>
                        {Object.entries(result.data).map(([key, value]) => (
                            <div key={key}>
                                <h3>{key}</h3>
                                <ul>
                                    {Object.entries(value).map(([prop, val]) => (
                                        <li key={prop}>{prop}: {val}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <h3>Сумарна вага комплектуючих: {result.totalWeight} гр.</h3>
                    </div>
                    <div style={{ width: '45%', marginLeft: '2%', paddingRight: "10%" }}>
                        <h2 align="center">Список необхідних комплектуючих</h2>
                        {Object.entries(amount).map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: "20px" }} >{key}</h3>
                                <p style={{ marginLeft: 'auto' }}>{value} шт.</p>
                            </div>
                        ))}

                        <h2 style={{ marginTop: "20px" }}>Вимоги до батареї: {batteryCapacity}</h2>
                        <h2 style={{ marginTop: "20px" }}>Вимоги до рами</h2>
                        <ul>
                            <li style={{ marginLeft: 'auto', fontSize: "20px" }}>Діаметр мотору: {batteryParameters["Діаметр мотору"]}</li>
                            <li style={{ marginLeft: 'auto', fontSize: "20px" }}>Розмір отвору вала: {batteryParameters["Розмір отвору вала"]}</li>
                            <li style={{ marginLeft: 'auto', fontSize: "20px" }}>Діаметр кріпильних отворів: {batteryParameters["Діаметр кріпильних отворів"]}</li>
                            <li style={{ marginLeft: 'auto', fontSize: "20px" }}>Відстань кріпильних отворів від центру: {batteryParameters["Відстань кріпильних отворів від центру"]}</li>
                        </ul>

                        {!isDuplicate && (
                            <div align="center">
                                <button
                                    type="button"
                                    class="btn btn-dark"
                                    onClick={handleKitSave}
                                >
                                    Зберегти до корзини
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
