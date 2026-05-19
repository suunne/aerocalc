// configurator.js - ФИНАЛЬНАЯ ВЕРСИЯ (Работа с существующим HTML)

// ==========================================
// 1. БАЗЫ ДАННЫХ
// ==========================================

const motorManufacturers = {
    actro: [
        { id: "actro_25_xxl", name: "Actro 25-XXL", kv: 850, maxCurrent: 35, maxPower: 450, weight: 68, resistance: 0.06, io: 1.1, price: 4200 },
        { id: "actro_32_l", name: "Actro 32-L", kv: 760, maxCurrent: 45, maxPower: 600, weight: 85, resistance: 0.05, io: 1.2, price: 5100 },
        { id: "actro_40_xl", name: "Actro 40-XL", kv: 530, maxCurrent: 60, maxPower: 800, weight: 112, resistance: 0.04, io: 1.5, price: 6800 },
        { id: "actro_45_pro", name: "Actro 45-PRO", kv: 420, maxCurrent: 70, maxPower: 1000, weight: 145, resistance: 0.035, io: 1.8, price: 8900 }
    ],
    aerob: [
        { id: "aerob_2216", name: "AeroB 2216", kv: 950, maxCurrent: 30, maxPower: 320, weight: 58, resistance: 0.068, io: 0.9, price: 2450 },
        { id: "aerob_2814", name: "AeroB 2814", kv: 800, maxCurrent: 45, maxPower: 500, weight: 78, resistance: 0.055, io: 1.2, price: 3100 },
        { id: "aerob_3515", name: "AeroB 3515", kv: 650, maxCurrent: 55, maxPower: 700, weight: 98, resistance: 0.045, io: 1.4, price: 4300 },
        { id: "aerob_4120", name: "AeroB 4120", kv: 500, maxCurrent: 65, maxPower: 900, weight: 128, resistance: 0.038, io: 1.6, price: 5600 }
    ],
    dronex: [
        { id: "dronex_2208", name: "DroneX 2208", kv: 1100, maxCurrent: 28, maxPower: 300, weight: 52, resistance: 0.072, io: 0.85, price: 1850 },
        { id: "dronex_2810", name: "DroneX 2810", kv: 900, maxCurrent: 40, maxPower: 480, weight: 70, resistance: 0.058, io: 1.1, price: 2600 },
        { id: "dronex_3510", name: "DroneX 3510", kv: 720, maxCurrent: 50, maxPower: 650, weight: 90, resistance: 0.048, io: 1.3, price: 3500 },
        { id: "dronex_4012", name: "DroneX 4012", kv: 560, maxCurrent: 60, maxPower: 850, weight: 115, resistance: 0.040, io: 1.5, price: 4700 }
    ]
};

const escDatabase = {
    'hobbywing_skywalker_30a': { continuousCurrent: 30, maxCurrent: 45, weight: 28, length: 35, resistance: 0.0065, wireLength: 15, price: 1350 },
    'hobbywing_skywalker_40a': { continuousCurrent: 40, maxCurrent: 60, weight: 32, length: 38, resistance: 0.0055, wireLength: 15, price: 1650 },
    'hobbywing_skywalker_50a': { continuousCurrent: 50, maxCurrent: 75, weight: 40, length: 45, resistance: 0.0045, wireLength: 18, price: 2100 },
    'hobbywing_skywalker_60a': { continuousCurrent: 60, maxCurrent: 90, weight: 45, length: 48, resistance: 0.0040, wireLength: 18, price: 2650 }
};

const propellerDatabase = {
    'generic_thin': { name: 'Generic - thin', diameter: 9, pitch: 5, blades: 2, twistAngle: '+7.0°', efficiency: 0.72, weight: 12, material: 'plastic', price: 250 },
    'generic_normal': { name: 'Generic - normal', diameter: 10, pitch: 5.5, blades: 2, twistAngle: '+6.0°', efficiency: 0.75, weight: 14, material: 'plastic', price: 300 },
    'generic_wide': { name: 'Generic - wide', diameter: 11, pitch: 6, blades: 3, twistAngle: '+5.0°', efficiency: 0.78, weight: 16, material: 'nylon', price: 450 },
    'aeronaut_camcarbon': { name: 'Aeronaut CamCarbon', diameter: 12, pitch: 6.5, blades: 2, twistAngle: '+3.5°', efficiency: 0.82, weight: 18, material: 'carbon', price: 1450 }
};

const batteryDatabase = {
    "lipo150_80_120": { s: 3, p: 1, capacity: 150, currentC: 80, resistance: 0.0867, voltage: 3.7, currentMax: 120, weight: 5, price: 650 },
    "lipo1600_80_120": { capacity: 1600, currentC: 85, currentMax: 120, resistance: 0.081, voltage: 3.7, weight: 46, s: 3, p: 1, price: 2800 },
    "lipo3000_80_120": { capacity: 3000, currentC: 80, currentMax: 120, resistance: 0.043, voltage: 3.7, weight: 86, s: 3, p: 1, price: 4900 },
    "lipo4500_80_120": { s: 3, p: 1, capacity: 4500, currentC: 85, resistance: 0.0029, voltage: 3.7, currentMax: 120, weight: 128, price: 6800 }
};

// ==========================================
// 2. КОНСТАНТЫ
// ==========================================

const PHYSICS = {
    AIR_DENSITY_SEA_LEVEL: 1.225,
    GRAVITY: 9.80665,
    STANDARD_PRESSURE: 101325,
    STANDARD_TEMPERATURE: 288.15,
    GAS_CONSTANT: 287.058,
    TEMP_LAPSE_RATE: 0.0065,
    PROP_CONSTANT: 1.11,
    EFFICIENCY_OPTIMAL: 0.85,
    EFFICIENCY_MAX: 0.80,
    DISCHARGE_SAFETY: 0.8
};

let efficiencyRadarChart = null;
let powerChart = null;
let currentBudget = 0;

// ==========================================
// 3. ИНИЦИАЛИЗАЦИЯ
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('АэроКалькулятор PRO запущен');
    
    if (!document.getElementById('motorManufacturer')) {
        console.error('Ошибка: Элементы формы не найдены.');
        return;
    }

    // Инициализация всех компонентов
    initMotorSelection();
    initPropellerSelection();
    initEscSelection();      // Теперь не ломает HTML
    initBatterySelection();  // Теперь не ломает HTML
    
    initializeEventListeners();
    initializeCharts();
    initBudgetFilter();
    loadSavedProjects();
    
    // Небольшая задержка для гарантированной отрисовки перед первым расчетом
    setTimeout(() => {
        calculateAll();
    }, 100);
});

// ==========================================
// 4. УПРАВЛЕНИЕ КОМПОНЕНТАМИ (ИСПРАВЛЕНО)
// ==========================================

function formatManufacturerName(key) {
    const names = { 'actro': 'Actro', 'aerob': 'AeroB', 'dronex': 'DroneX' };
    return names[key] || key;
}

// --- МОТОРЫ (Здесь список пуст в HTML, поэтому создаем его) ---
function initMotorSelection() {
    const manufacturerSelect = document.getElementById('motorManufacturer');
    const typeSelect = document.getElementById('motorType');
    if (!manufacturerSelect || !typeSelect) return;
    
    // Заполняем производителей (список пуст в HTML)
    manufacturerSelect.innerHTML = '';
    Object.keys(motorManufacturers).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = formatManufacturerName(key);
        manufacturerSelect.appendChild(option);
    });
    
    manufacturerSelect.addEventListener('change', function() { 
        updateMotorTypes(this.value); 
    });
    
    typeSelect.addEventListener('change', function() {
        const manufacturer = document.getElementById('motorManufacturer').value;
        const motorId = this.value;
        if (manufacturer && motorId !== 'default' && motorManufacturers[manufacturer]) {
            const selectedMotor = motorManufacturers[manufacturer].find(m => m.id === motorId);
            if (selectedMotor) {
                updateMotorParameters(selectedMotor);
                calculateAll(); 
            }
        }
    });
    
    // Инициализация первого производителя
    updateMotorTypes('actro');
}

function updateMotorTypes(manufacturer) {
    const typeSelect = document.getElementById('motorType');
    if (!typeSelect) return;
    
    typeSelect.innerHTML = '<option value="default">Выберите тип мотора</option>';
    
    if (manufacturer && motorManufacturers[manufacturer]) {
        typeSelect.disabled = false;
        motorManufacturers[manufacturer].forEach(motor => {
            const option = document.createElement('option');
            option.value = motor.id;
            const priceFormatted = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(motor.price);
            option.textContent = `${motor.name} (KV: ${motor.kv}, ${motor.maxPower}Вт, ${priceFormatted})`;
            typeSelect.appendChild(option);
        });
        
        if (motorManufacturers[manufacturer].length > 0) {
            typeSelect.value = motorManufacturers[manufacturer][0].id;
            const selectedMotor = motorManufacturers[manufacturer].find(m => m.id === typeSelect.value);
            if (selectedMotor) {
                updateMotorParameters(selectedMotor);
                calculateAll();
            }
        }
    } else {
        typeSelect.disabled = true;
    }
}

function updateMotorParameters(motor) {
    if (!motor) return;
    setFieldValue('motorKv', motor.kv);
    setFieldValue('motorMaxCurrent', motor.maxCurrent);
    setFieldValue('motorMaxPower', motor.maxPower);
    setFieldValue('motorWeight', motor.weight);
    setFieldValue('motorResistance', motor.resistance);
    setFieldValue('motorNoLoadCurrent', (motor.io || (motor.kv * 0.001)).toFixed(2));
}

// --- ПРОПЕЛЛЕРЫ (НЕ ПЕРЕПИСЫВАЕМ, если опции уже есть) ---
function initPropellerSelection() {
    const propTypeSelect = document.getElementById('propType');
    if (!propTypeSelect) return;
    
    // ПРОВЕРКА: Если в списке уже есть опции (кроме дефолтной), не трогаем HTML
    const hasOptions = propTypeSelect.options.length > 1;
    
    if (!hasOptions) {
        // Если пусто, заполняем из базы (резервный вариант)
        propTypeSelect.innerHTML = '';
        Object.keys(propellerDatabase).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = propellerDatabase[key].name;
            propTypeSelect.appendChild(option);
        });
        propTypeSelect.value = 'generic_wide';
    } else {
        // Если опции есть в HTML, просто убеждаемся, что выбрано корректное значение
        if (!propellerDatabase[propTypeSelect.value]) {
            propTypeSelect.value = 'generic_wide';
        }
    }
    
    // Вешаем обработчик
    propTypeSelect.addEventListener('change', function() {
        updatePropellerParams();
        calculateAll();
    });
    
    // Первичное обновление
    updatePropellerParams();
}

function updatePropellerParams() {
    const propType = document.getElementById('propType').value;
    if (propellerDatabase[propType]) {
        const prop = propellerDatabase[propType];
        setFieldValue('propDiameter', prop.diameter);
        setFieldValue('propPitch', prop.pitch);
        setFieldValue('propBlades', prop.blades);
    }
}

// --- РЕГУЛЯТОРЫ (ESC) (НЕ ПЕРЕПИСЫВАЕМ, если опции уже есть) ---
function initEscSelection() {
    const escSelect = document.getElementById('escModel');
    if (!escSelect) return;

    const hasOptions = escSelect.options.length > 1;
    
    if (!hasOptions) {
        // Резервное заполнение, если HTML пуст
        escSelect.innerHTML = '<option value="default">выбрать</option>';
        Object.keys(escDatabase).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            const esc = escDatabase[key];
            option.textContent = `${key.replace(/_/g, ' ').toUpperCase()} (${esc.continuousCurrent}A)`;
            escSelect.appendChild(option);
        });
        escSelect.value = 'hobbywing_skywalker_40a';
    } else {
        // Проверка валидности текущего выбора
        if (!escDatabase[escSelect.value]) {
            escSelect.value = 'hobbywing_skywalker_40a';
        }
    }

    escSelect.addEventListener('change', function() {
        updateEscParams();
        calculateAll();
    });

    updateEscParams();
}

function updateEscParams() {
    const escSelect = document.getElementById('escModel');
    if (!escSelect) return;
    
    const escType = escSelect.value;
    if (escDatabase[escType]) {
        const esc = escDatabase[escType];
        setFieldValue('escCurrentContinuous', esc.continuousCurrent);
        setFieldValue('escCurrentMax', esc.maxCurrent);
        setFieldValue('escWeight', esc.weight);
        setFieldValue('escLength', esc.length);
        setFieldValue('escResistance', esc.resistance);
        setFieldValue('escWireLength', esc.wireLength);
    }
}

// --- АККУМУЛЯТОРЫ (BATTERY) (НЕ ПЕРЕПИСЫВАЕМ, если опции уже есть) ---
function initBatterySelection() {
    const battSelect = document.getElementById('batteryType');
    if (!battSelect) return;

    const hasOptions = battSelect.options.length > 1;
    
    if (!hasOptions) {
        // Резервное заполнение
        battSelect.innerHTML = '<option value="default">выбрать</option>';
        Object.keys(batteryDatabase).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            const batt = batteryDatabase[key];
            option.textContent = `LiPo ${batt.capacity}mAh`;
            battSelect.appendChild(option);
        });
        battSelect.value = 'lipo3000_80_120';
    } else {
        // Проверка валидности
        if (!batteryDatabase[battSelect.value]) {
            battSelect.value = 'lipo3000_80_120';
        }
    }

    battSelect.addEventListener('change', function() {
        updateBatteryParams();
        calculateAll();
    });

    updateBatteryParams();
}

function updateBatteryParams() {
    const battSelect = document.getElementById('batteryType');
    if (!battSelect) return;

    const batteryType = battSelect.value;
    if (batteryDatabase[batteryType]) {
        const battery = batteryDatabase[batteryType];
        const sCount = battery.s || 3;
        
        setFieldValue('batteryCapacity', battery.capacity);
        setFieldValue('batteryVoltage', (battery.voltage * sCount).toFixed(1));
        setFieldValue('batteryWeight', battery.weight);
        setFieldValue('batteryCurrentC', battery.currentC);
        setFieldValue('batteryCurrentMax', battery.currentMax);
        setFieldValue('batteryResistance', battery.resistance);
        setFieldValue('batteryCells', sCount);
    }
}

function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        const strValue = String(value);
        if (element.value !== strValue) {
            element.value = strValue;
            element.classList.add('field-changed');
            setTimeout(() => element.classList.remove('field-changed'), 500);
        }
    }
}

// ==========================================
// 5. ГЛАВНЫЙ РАСЧЕТ (Без изменений, как в предыдущей версии)
// ==========================================

function calculateAll() {
    try {
        const params = getInputParameters();
        const airDensity = calculateAirDensity(params.altitude, params.temperature);
        const results = performCalculations(params, airDensity);
        
        updateResults(results);
        updateCharts(results);
        updateSummary(results);
        
        const costData = calculateTotalCostDetailed(params);
        updateCostDisplay(costData.total, costData);
        updateBudgetRecommendations(results, costData);
        
        checkFlightConditions(results, airDensity);
        
    } catch (error) {
        console.error('Критическая ошибка в расчетах:', error);
    }
}

function calculateAirDensity(altitude, temperature) {
    const temperatureK = temperature + 273.15;
    const pressure = PHYSICS.STANDARD_PRESSURE * Math.pow(1 - 0.0065 * altitude / 288.15, 5.25588);
    const density = pressure / (PHYSICS.GAS_CONSTANT * temperatureK);
    return Math.max(density, 0.5);
}

function safeGetValue(id, defaultValue) {
    const element = document.getElementById(id);
    if (!element) return defaultValue;
    const value = element.value.trim();
    if (value === '' || value === 'undefined' || value === 'null') return defaultValue;
    const numValue = parseFloat(value);
    return isNaN(numValue) ? defaultValue : numValue;
}

function getInputParameters() {
    return {
        flightWeight: Math.max(safeGetValue('flightWeight', 1500), 0),
        motorCount: Math.max(safeGetValue('motorCount', 1), 1),
        wingArea: Math.max(safeGetValue('wingArea', 32), 0.1),
        wingSpan: safeGetValue('wingSpan', 1200),
        dragCoefficient: Math.max(safeGetValue('dragCoefficient', 0.03), 0.01),
        flightSpeed: Math.max(safeGetValue('flightSpeed', 80), 0),
        targetSpeed: Math.max(safeGetValue('targetSpeed', 120), 0),
        altitude: safeGetValue('altitude', 500),
        temperature: safeGetValue('temperature', 20),
        airPressure: safeGetValue('airPressure', 1013),
        battery: {
            capacity: Math.max(safeGetValue('batteryCapacity', 3000), 0),
            voltage: Math.max(safeGetValue('batteryVoltage', 11.1), 0),
            currentC: Math.max(safeGetValue('batteryCurrentC', 80), 0),
            currentMax: Math.max(safeGetValue('batteryCurrentMax', 120), 0),
            resistance: Math.max(safeGetValue('batteryResistance', 0.025), 0),
            weight: Math.max(safeGetValue('batteryWeight', 180), 0),
            s: Math.max(safeGetValue('batteryCells', 3), 1),
            type: document.getElementById('batteryType')?.value || 'lipo3000_80_120'
        },
        motor: {
            kv: Math.max(safeGetValue('motorKv', 760), 0),
            resistance: Math.max(safeGetValue('motorResistance', 0.05), 0),
            maxCurrent: Math.max(safeGetValue('motorMaxCurrent', 45), 0),
            maxPower: Math.max(safeGetValue('motorMaxPower', 600), 0),
            weight: Math.max(safeGetValue('motorWeight', 85), 0),
            noLoadCurrent: Math.max(safeGetValue('motorNoLoadCurrent', 1.5), 0),
            manufacturer: document.getElementById('motorManufacturer')?.value || 'actro',
            id: document.getElementById('motorType')?.value || 'actro_32_l'
        },
        propeller: {
            diameter: Math.max(safeGetValue('propDiameter', 10), 1),
            pitch: Math.max(safeGetValue('propPitch', 6), 1),
            blades: Math.max(safeGetValue('propBlades', 3), 2),
            type: document.getElementById('propType') ? document.getElementById('propType').value : 'generic_wide'
        },
        esc: {
            currentContinuous: Math.max(safeGetValue('escCurrentContinuous', 40), 0),
            currentMax: Math.max(safeGetValue('escCurrentMax', 60), 0),
            resistance: Math.max(safeGetValue('escResistance', 0.005), 0),
            weight: Math.max(safeGetValue('escWeight', 35), 0),
            length: Math.max(safeGetValue('escLength', 40), 0),
            wireLength: Math.max(safeGetValue('escWireLength', 15), 5),
            type: document.getElementById('escModel')?.value || 'hobbywing_skywalker_40a'
        }
    };
}

function performCalculations(params, airDensity) {
    const results = {};
    results.params = params;
    results.airDensity = airDensity;
    
    const wingAreaM2 = Math.max(params.wingArea / 10000, 0.001);
    const weightKg = Math.max(params.flightWeight / 1000, 0.001);
    
    results.wingLoading = weightKg / wingAreaM2;
    results.wingLoadingGdm2 = params.flightWeight / params.wingArea;
    
    const clMax = 1.2;
    results.stallSpeed = Math.sqrt((2 * weightKg * PHYSICS.GRAVITY) / (airDensity * wingAreaM2 * clMax));
    
    const capacityAh = params.battery.capacity / 1000;
    results.batteryEnergy = capacityAh * params.battery.voltage;
    const maxBatteryCurrent = capacityAh * params.battery.currentC;
    
    const nominalBatteryVoltage = 3.7 * params.battery.s;
    results.nominalVoltage = nominalBatteryVoltage;
    
    const optimalCurrentPerMotor = Math.max(params.motor.maxCurrent * 0.7, 0);
    const totalOptimalCurrent = optimalCurrentPerMotor * params.motorCount;
    const totalBatteryResistance = Math.max(params.battery.resistance * params.battery.s, 0);
    const batteryVoltageDropOptimal = totalOptimalCurrent * totalBatteryResistance;
    
    results.batteryVoltageUnderLoad = Math.max(nominalBatteryVoltage - batteryVoltageDropOptimal, nominalBatteryVoltage * 0.7);
    
    const escVoltageDropPerMotor = optimalCurrentPerMotor * params.esc.resistance;
    const motorVoltageOptimal = Math.max(results.batteryVoltageUnderLoad - escVoltageDropPerMotor, 0);
    
    results.motorCurrentOptimal = optimalCurrentPerMotor;
    results.motorVoltageOptimal = motorVoltageOptimal;
    results.motorRpmOptimal = Math.max(params.motor.kv * motorVoltageOptimal, 0);
    results.electricalPowerOptimal = optimalCurrentPerMotor * motorVoltageOptimal;
    results.mechanicalPowerOptimal = results.electricalPowerOptimal * PHYSICS.EFFICIENCY_OPTIMAL;
    results.motorEfficiencyOptimal = PHYSICS.EFFICIENCY_OPTIMAL * 100;
    
    results.motorCurrentMax = Math.max(Math.min(params.motor.maxCurrent, maxBatteryCurrent / Math.max(params.motorCount, 1), params.esc.currentMax / Math.max(params.motorCount, 1)), 0);
    
    const totalCurrentMax = results.motorCurrentMax * params.motorCount;
    const batteryVoltageDropMax = totalCurrentMax * totalBatteryResistance;
    const batteryVoltageUnderLoadMax = Math.max(nominalBatteryVoltage - batteryVoltageDropMax, nominalBatteryVoltage * 0.6);
    const escVoltageDropMax = results.motorCurrentMax * params.esc.resistance;
    
    results.motorVoltageMax = Math.max(batteryVoltageUnderLoadMax - escVoltageDropMax, 0);
    results.motorRpmMax = Math.max(params.motor.kv * results.motorVoltageMax, 0);
    results.electricalPowerMax = results.motorCurrentMax * results.motorVoltageMax;
    results.mechanicalPowerMax = results.electricalPowerMax * PHYSICS.EFFICIENCY_MAX;
    results.motorEfficiencyMax = PHYSICS.EFFICIENCY_MAX * 100;
    
    const propDiameterM = Math.max(params.propeller.diameter * 0.0254, 0.001);
    const propPitchM = Math.max(params.propeller.pitch * 0.0254, 0.001);
    
    results.staticThrust = calculateStaticThrust(propDiameterM, propPitchM, Math.max(results.motorRpmOptimal, 1000), airDensity, params.propeller.blades);
    results.propRpm = Math.max(results.motorRpmOptimal * 0.92, 0);
    results.zeroSpeedThrust = results.staticThrust;
    results.stallThrust = Math.max(results.staticThrust * 0.85, 0);
    results.flowSpeed = (results.propRpm * propPitchM * 60 / 1000) * 3.6;
    
    const totalStaticThrust = Math.max(results.staticThrust * params.motorCount, 0);
    results.thrustToWeight = totalStaticThrust / Math.max(params.flightWeight, 0.001);
    results.powerLoading = (results.electricalPowerOptimal * params.motorCount) / Math.max(weightKg, 0.001);
    
    const usableCapacity = Math.max(capacityAh * PHYSICS.DISCHARGE_SAFETY, 0);
    const averageCurrent = Math.max(results.motorCurrentOptimal * params.motorCount * 0.6, 0);
    results.minFlightTime = averageCurrent > 0 ? (usableCapacity / averageCurrent) * 60 : 0;
    results.mixedFlightTime = Math.max(results.minFlightTime * 1.3, 0);
    
    results.totalCapacityWh = Math.max(results.batteryEnergy, 0);
    results.usedCapacity = Math.max(usableCapacity * 1000, 0);
    results.theoreticalMaxSpeed = Math.max(results.flowSpeed * 1.15, 0);
    results.propulsionWeight = Math.max((params.motor.weight + params.esc.weight) * params.motorCount, 0);
    
    results.currentMarginESC = params.esc.currentContinuous - results.motorCurrentOptimal;
    results.currentMarginBattery = maxBatteryCurrent - (results.motorCurrentOptimal * params.motorCount);
    
    return results;
}

function calculateStaticThrust(diameter, pitch, rpm, airDensity, blades) {
    diameter = Math.max(diameter, 0.001);
    pitch = Math.max(pitch, 0.001);
    rpm = Math.max(rpm, 0);
    airDensity = Math.max(airDensity, 0);
    blades = Math.max(blades, 2);
    
    const area = Math.PI * Math.pow(diameter / 2, 2);
    const tipSpeed = (rpm / 60) * Math.PI * diameter;
    
    let bladeFactor = 1.0;
    if (blades === 3) bladeFactor = 0.85;
    if (blades === 4) bladeFactor = 0.75;
    
    const thrust = airDensity * area * Math.pow(tipSpeed, 2) * PHYSICS.PROP_CONSTANT * bladeFactor * 0.25;
    return Math.max(thrust / 0.00980665, 0);
}

// ==========================================
// 6. ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==========================================

function updateResults(results) {
    const params = results.params;
    function safeUpdateElement(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
    function formatValue(value, decimals, unit = '') {
        if (typeof value !== 'number' || isNaN(value)) return '0' + unit;
        return value.toFixed(decimals) + unit;
    }
    
    safeUpdateElement('resultWingLoading', formatValue(results.wingLoadingGdm2, 1, ' г/дм²'));
    safeUpdateElement('resultVoltageUnderLoad', formatValue(results.batteryVoltageUnderLoad, 2, ' В'));
    safeUpdateElement('resultNominalVoltage', formatValue(results.nominalVoltage, 1, ' В'));
    safeUpdateElement('resultEnergy', formatValue(results.batteryEnergy, 2, ' Вт·ч'));
    safeUpdateElement('resultTotalCapacity', formatValue(results.totalCapacityWh, 2, ' Вт·ч'));
    safeUpdateElement('resultUsedCapacity', formatValue(results.usedCapacity, 0, ' мАч'));
    safeUpdateElement('resultMinFlightTime', formatValue(results.minFlightTime, 1, ' мин'));
    safeUpdateElement('resultMixedFlightTime', formatValue(results.mixedFlightTime, 1, ' мин'));
    safeUpdateElement('resultBatteryWeight', formatValue(params.battery.weight, 0, ' г'));
    
    safeUpdateElement('resultMotorCurrent', formatValue(results.motorCurrentOptimal, 1, ' А'));
    safeUpdateElement('resultMotorVoltage', formatValue(results.motorVoltageOptimal, 2, ' В'));
    safeUpdateElement('resultMotorRpm', formatValue(results.motorRpmOptimal, 0, ' об/мин'));
    safeUpdateElement('resultElectricalPower', formatValue(results.electricalPowerOptimal, 0, ' Вт'));
    safeUpdateElement('resultMechanicalPower', formatValue(results.mechanicalPowerOptimal, 0, ' Вт'));
    safeUpdateElement('resultMotorEfficiency', formatValue(results.motorEfficiencyOptimal, 1, '%'));
    
    safeUpdateElement('resultMotorCurrentMax', formatValue(results.motorCurrentMax, 1, ' А'));
    safeUpdateElement('resultMotorVoltageMax', formatValue(results.motorVoltageMax, 2, ' В'));
    safeUpdateElement('resultMotorRpmMax', formatValue(results.motorRpmMax, 0, ' об/мин'));
    safeUpdateElement('resultElectricalPowerMax', formatValue(results.electricalPowerMax, 0, ' Вт'));
    safeUpdateElement('resultMechanicalPowerMax', formatValue(results.mechanicalPowerMax, 0, ' Вт'));
    safeUpdateElement('resultMotorEfficiencyMax', formatValue(results.motorEfficiencyMax, 1, '%'));
    
    safeUpdateElement('resultStaticThrust', formatValue(results.staticThrust, 0, ' г'));
    safeUpdateElement('resultPropRpm', formatValue(results.propRpm, 0, ' об/мин'));
    safeUpdateElement('resultStallThrust', formatValue(results.stallThrust, 0, ' г'));
    safeUpdateElement('resultZeroSpeedThrust', formatValue(results.zeroSpeedThrust, 0, ' г'));
    safeUpdateElement('resultFlowSpeed', formatValue(results.flowSpeed, 1, ' км/ч'));
    
    safeUpdateElement('resultPropulsionWeight', formatValue(results.propulsionWeight, 0, ' г'));
    safeUpdateElement('resultPowerLoading', formatValue(results.powerLoading, 0, ' Вт/кг'));
    safeUpdateElement('resultThrustToWeight', formatValue(results.thrustToWeight, 2, ':1'));
    safeUpdateElement('resultCurrentMax', formatValue(results.motorCurrentMax, 1, ' А'));
    safeUpdateElement('resultInputPowerMax', formatValue(results.electricalPowerMax, 0, ' Вт'));
    
    safeUpdateElement('resultCurrentMarginESC', formatValue(results.currentMarginESC, 1, ' А'));
    safeUpdateElement('resultCurrentMarginBattery', formatValue(results.currentMarginBattery, 1, ' А'));
    
    const densityIndicator = document.getElementById('airDensityDisplay');
    if (densityIndicator) {
        densityIndicator.textContent = results.airDensity.toFixed(3) + ' кг/м³';
        const seaLevel = PHYSICS.AIR_DENSITY_SEA_LEVEL;
        const diff = ((results.airDensity - seaLevel) / seaLevel) * 100;
        const sign = diff > 0 ? '+' : '';
        densityIndicator.title = `Отклонение от уровня моря: ${sign}${diff.toFixed(1)}%`;
    }
}

// ==========================================
// 7. СТОИМОСТЬ И РЕКОМЕНДАЦИИ
// ==========================================

function calculateTotalCostDetailed(params) {
    let total = 0;
    let breakdown = {};
    
    const motor = motorManufacturers[params.motor.manufacturer]?.find(m => m.id === params.motor.id);
    if (motor) { breakdown.motors = motor.price * params.motorCount; total += breakdown.motors; breakdown.motorUnitPrice = motor.price; } 
    else { breakdown.motors = 0; }
    
    const esc = escDatabase[params.esc.type];
    if (esc) { breakdown.esc = esc.price * params.motorCount; total += breakdown.esc; } 
    else { breakdown.esc = 0; }
    
    const prop = propellerDatabase[params.propeller.type];
    if (prop) { breakdown.props = prop.price * params.motorCount * 2; total += breakdown.props; } 
    else { breakdown.props = 0; }
    
    const battery = batteryDatabase[params.battery.type];
    if (battery) { breakdown.battery = battery.price; total += breakdown.battery; } 
    else { breakdown.battery = 0; }
    
    return { total, breakdown };
}

function generateBudgetRecommendations(costData, params, results) {
    const recommendations = [];
    const budget = parseFloat(document.getElementById('budgetFilter')?.value) || 0;
    const total = costData.total;
    
    if (budget > 0 && total > budget) {
        const diff = total - budget;
        recommendations.push({
            type: 'critical',
            text: `Бюджет превышен на ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(diff)}.`
        });
        
        let maxComponent = 'motors';
        let maxValue = 0;
        for (const [key, value] of Object.entries(costData.breakdown)) {
            if (value > maxValue) { maxValue = value; maxComponent = key; }
        }
        
        if (maxComponent === 'motors') {
            const currentManuf = params.motor.manufacturer;
            if (currentManuf === 'actro') recommendations.push({ type: 'tip', text: '💡 Совет: Моторы Actro дорогие. Попробуйте бренд <b>AeroB</b> или <b>DroneX</b> для экономии до 40%.' });
            else if (currentManuf === 'aerob') recommendations.push({ type: 'tip', text: '💡 Совет: Для максимальной экономии выберите моторы <b>DroneX</b>.' });
        } else if (maxComponent === 'props') {
             recommendations.push({ type: 'tip', text: '💡 Совет: Дорогие пропеллеры. Для тестов возьмите пластиковые (<b>Generic</b>), они дешевле в 3-4 раза.' });
        } else if (maxComponent === 'battery') {
             recommendations.push({ type: 'tip', text: '💡 Совет: Аккумулятор дорог. Возьмите меньшую емкость для отладки.' });
        }
    } 
    else if (budget > 0 && total < (budget * 0.5)) {
        recommendations.push({ type: 'success', text: `Отлично! Вы укладываетесь в бюджет с запасом (${Math.round((total/budget)*100)}% использовано).` });
        if (params.battery.capacity < 4500) {
             recommendations.push({ type: 'upgrade', text: '🚀 Апгрейд: Свободные средства позволяют взять батарею большей емкости (например, 4500 мАч) для увеличения времени полета.' });
        } else {
             recommendations.push({ type: 'upgrade', text: '🚀 Апгрейд: Можно улучшить пропеллеры до карбоновых (<b>Aeronaut</b>) для повышения КПД.' });
        }
    }
    else {
        if (params.propeller.type === 'aeronaut_camcarbon' && budget > 0 && total > (budget * 0.8)) {
            recommendations.push({ type: 'tip', text: '💡 Внимание: Карбоновые пропеллеры сильно увеличивают цену. Для экономии можно использовать нейлоновые.' });
        }
        if (results.mixedFlightTime < 10 && params.battery.capacity < 3000) {
             recommendations.push({ type: 'warning', text: '⚠️ Время полета малое. Увеличение емкости батареи даст лучший прирост, чем дорогие моторы.' });
        }
        if (recommendations.length === 0 && budget === 0) {
             recommendations.push({ type: 'info', text: 'ℹ️ Установите лимит бюджета в поле выше, чтобы получить персональные советы по экономии.' });
        }
    }
    
    return recommendations;
}

function updateCostDisplay(total, costData) {
    const costElement = document.getElementById('totalCostDisplay');
    const budgetInput = document.getElementById('budgetFilter');
    
    if (costElement) {
        const priceFormatted = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(total);
        costElement.textContent = priceFormatted;
        
        const budget = parseFloat(budgetInput?.value) || 0;
        if (budget > 0 && total > budget) {
            costElement.style.color = '#ef4444';
            costElement.title = "Превышает бюджет!";
        } else {
            costElement.style.color = '#10b981';
            costElement.title = "В пределах бюджета";
        }
    }
}

function updateBudgetRecommendations(results, costData) {
    const recElement = document.getElementById('budgetRecommendations');
    
    if (!recElement) return;
    
    const params = results.params;
    const recs = generateBudgetRecommendations(costData, params, results);
    
    if (recs.length === 0) {
        recElement.innerHTML = '<div style="font-size: 13px; color: #94a3b8; font-style: italic;">Конфигурация оптимальна.</div>';
        return;
    }
    
    let html = '<ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 13px;">';
    recs.forEach(rec => {
        let color = '#f1f5f9';
        if (rec.type === 'critical') color = '#ef4444';
        if (rec.type === 'success') color = '#10b981';
        if (rec.type === 'upgrade') color = '#3b82f6';
        if (rec.type === 'warning') color = '#f59e0b';
        if (rec.type === 'tip') color = '#94a3b8';
        if (rec.type === 'info') color = '#cbd5e1';
        
        html += `<li style="color: ${color}; margin-bottom: 4px;">${rec.text}</li>`;
    });
    html += '</ul>';
    
    recElement.innerHTML = html;
}

function initBudgetFilter() {
    const budgetInput = document.getElementById('budgetFilter');
    if (budgetInput) {
        budgetInput.addEventListener('input', function() {
            currentBudget = parseFloat(this.value) || 0;
            calculateAll();
        });
    }
}

// ==========================================
// 8. ГРАФИКИ
// ==========================================

function initializeCharts() {
    const radarCanvas = document.getElementById('efficiencyRadarChart');
    const powerCanvas = document.getElementById('powerChart');
    if (!radarCanvas || !powerCanvas) return;
    
    const radarCtx = radarCanvas.getContext('2d');
    efficiencyRadarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Тяговооруженность', 'Запас по ESC', 'Запас по батарее', 'Время полета', 'Эффективность', 'Скорость'],
            datasets: [{
                label: 'Текущая система',
                data: [50, 70, 65, 50, 75, 60],
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: 'rgba(56, 189, 248, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(56, 189, 248, 1)'
            }, {
                label: 'Оптимальные значения',
                data: [80, 80, 80, 80, 80, 80],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(16, 185, 129, 0.5)'
            }]
        },
        options: {
            scales: { 
                r: { 
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, 
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
                    pointLabels: { color: '#f1f5f9', font: { size: 11 } }, 
                    ticks: { display: false, max: 100, min: 0 }, 
                    suggestedMin: 0, 
                    suggestedMax: 100 
                } 
            },
            plugins: { 
                legend: { display: true, position: 'bottom', labels: { color: '#f1f5f9', font: { size: 11 } } } 
            }
        }
    });
    
    const powerCtx = powerCanvas.getContext('2d');
    powerChart = new Chart(powerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Полезная мощность', 'Потери в моторе', 'Потери в ESC', 'Потери в батарее'],
            datasets: [{
                data: [70, 15, 8, 7],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)'],
                borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 1)'],
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true, 
            plugins: { 
                legend: { position: 'bottom', labels: { color: '#f1f5f9', font: { size: 11 } } } 
            } 
        }
    });
}

function updateCharts(results) {
    if (!efficiencyRadarChart || !powerChart) return;
    try {
        const thrustScore = Math.min(100, Math.max(20, results.thrustToWeight * 40));
        const escMarginScore = results.params.esc.currentContinuous > 0 ? Math.min(100, Math.max(0, (results.currentMarginESC / results.params.esc.currentContinuous) * 100)) : 50;
        const batteryCapacityAh = results.params.battery.capacity / 1000;
        const maxBatteryCurrent = batteryCapacityAh * results.params.battery.currentC;
        const batteryMarginScore = maxBatteryCurrent > 0 ? Math.min(100, Math.max(0, (results.currentMarginBattery / maxBatteryCurrent) * 100)) : 50;
        const timeScore = Math.min(100, Math.max(0, results.mixedFlightTime * 6));
        const efficiencyScore = Math.min(100, results.motorEfficiencyOptimal);
        const speedScore = results.params.targetSpeed > 0 ? Math.min(100, Math.max(0, (results.theoreticalMaxSpeed / results.params.targetSpeed) * 100)) : 50;
        
        efficiencyRadarChart.data.datasets[0].data = [thrustScore, escMarginScore, batteryMarginScore, timeScore, efficiencyScore, speedScore];
        efficiencyRadarChart.update();
        
        const usefulPower = results.motorEfficiencyOptimal;
        const motorLoss = 100 - results.motorEfficiencyOptimal;
        powerChart.data.datasets[0].data = [usefulPower, motorLoss, 3, 2];
        powerChart.update();
    } catch (error) { console.error('Ошибка обновления графиков:', error); }
}

// ==========================================
// 9. СВОДКА С РЕЙТИНГОМ
// ==========================================

function updateSummary(results) {
    const params = results.params;
    const summaryElement = document.getElementById('systemSummary');
    if (!summaryElement) return;
    
    let performanceClass = '';
    let performanceColor = 'critical';
    let recommendations = [];
    let issues = [];
    let warnings = [];
    
    const twr = results.thrustToWeight;
    const MAX_REALISTIC_TWR = 10.0; 

    if (twr > MAX_REALISTIC_TWR) {
        performanceClass = 'Превышающая';
        performanceColor = 'critical';
        issues.push('Значение тяговооруженности превышает физически возможные лимиты');
        recommendations.push('Проверьте корректность введенных данных');
    } else if (twr >= 1.3) {
        performanceClass = 'Гоночный';
        performanceColor = 'excellent';
        recommendations.push('Экстремальная тяговооруженность для профессиональных гонок');
    } else if (twr >= 1.0) {
        performanceClass = 'Акробатический';
        performanceColor = 'good';
        recommendations.push('Отличная тяговооруженность для фристайла');
    } else if (twr >= 0.7) {
        performanceClass = 'Спортивный';
        performanceColor = 'neutral';
        warnings.push('Вертикальный набор высоты будет ощутимым, но не мгновенным');
    } else if (twr >= 0.5) {
        performanceClass = 'Крейсерский';
        performanceColor = 'warning';
        warnings.push('Тяговооруженность на нижней границе для энергичных маневров');
    } else {
        performanceClass = 'Недостаточная';
        performanceColor = 'critical';
        issues.push('Критически низкая тяговооруженность');
        recommendations.push('Снизить вес или установить более мощные двигатели');
    }

    if (results.currentMarginESC < 5) {
        if (results.currentMarginESC < 0) {
            issues.push(`ESC перегружен! Превышение: ${Math.abs(results.currentMarginESC).toFixed(1)}А`);
            performanceColor = 'critical';
        } else {
            warnings.push(`Маленький запас по ESC: ${results.currentMarginESC.toFixed(1)}А`);
        }
    } else {
        recommendations.push(`Хороший запас по ESC: ${results.currentMarginESC.toFixed(1)}А`);
    }
    
    if (results.currentMarginBattery < 10) {
        if (results.currentMarginBattery < 0) {
            issues.push(`Батарея перегружена! Превышение: ${Math.abs(results.currentMarginBattery).toFixed(1)}А`);
            performanceColor = 'critical';
        } else {
            warnings.push(`Маленький запас по батарее: ${results.currentMarginBattery.toFixed(1)}А`);
        }
    } else {
        recommendations.push(`Достаточный запас по батарее: ${results.currentMarginBattery.toFixed(1)}А`);
    }
    
    const rating = calculateSystemRating(results);
    
    let summaryHTML = `<div class="summary-status ${performanceColor}">`;
    summaryHTML += `<div class="summary-header" style="display:flex; justify-content:space-between; align-items:center;">`;
    summaryHTML += `<div><strong>Класс: ${performanceClass}</strong></div>`;
    summaryHTML += `</div>`;
    
    summaryHTML += `<div class="summary-metrics">`;
    summaryHTML += `<div><strong>Тяговооруженность:</strong> ${twr.toFixed(2)}:1</div>`;
    summaryHTML += `<div><strong>Нагрузка на крыло:</strong> ${results.wingLoading.toFixed(1)} кг/м²</div>`;
    summaryHTML += `<div><strong>Удельная мощность:</strong> ${results.powerLoading.toFixed(0)} Вт/кг</div>`;
    summaryHTML += `<div><strong>Время полета:</strong> ${results.mixedFlightTime.toFixed(1)} мин</div>`;
    summaryHTML += `<div><strong>Скорость сваливания:</strong> ${results.stallSpeed.toFixed(1)} км/ч</div>`;
    summaryHTML += `</div>`;
    
    if (recommendations.length > 0) {
        summaryHTML += '<div class="summary-section"><strong>✅ Сильные стороны:</strong><ul>';
        recommendations.forEach(rec => summaryHTML += `<li>${rec}</li>`);
        summaryHTML += '</ul></div>';
    }
    
    if (warnings.length > 0) {
        summaryHTML += '<div class="summary-section warning"><strong>⚠️ Внимание:</strong><ul>';
        warnings.forEach(warn => summaryHTML += `<li>${warn}</li>`);
        summaryHTML += '</ul></div>';
    }
    
    if (issues.length > 0) {
        summaryHTML += '<div class="summary-section critical"><strong>❌ Критические проблемы:</strong><ul>';
        issues.forEach(issue => summaryHTML += `<li>${issue}</li>`);
        summaryHTML += '</ul></div>';
    }
    
    summaryHTML += '</div>';
    summaryElement.innerHTML = summaryHTML;
}

function calculateSystemRating(results) {
    let score = 0;
    const twr = results.thrustToWeight;
    const time = results.mixedFlightTime;
    const eff = results.motorEfficiencyOptimal;
    const marginEsc = results.currentMarginESC;
    const marginBat = results.currentMarginBattery;
    
    if (twr >= 1.5) score += 30;
    else if (twr >= 1.0) score += 20;
    else if (twr >= 0.7) score += 10;
    
    if (time >= 20) score += 25;
    else if (time >= 15) score += 15;
    else if (time >= 10) score += 5;
    
    if (eff >= 80) score += 15;
    else if (eff >= 70) score += 10;
    
    if (marginEsc > 10 && marginBat > 20) score += 30;
    else if (marginEsc > 5 && marginBat > 10) score += 15;
    else if (marginEsc > 0 && marginBat > 0) score += 5;
    
    if (score >= 90) return 'S+';
    if (score >= 80) return 'S';
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    if (score >= 20) return 'D';
    return 'F';
}

function checkFlightConditions(results, airDensity) {
    const alertBox = document.getElementById('weatherAlert');
    if (!alertBox) return;
    
    const twr = results.thrustToWeight;
    const isHot = results.params.temperature > 30;
    const isHigh = results.params.altitude > 1500;
    
    if (twr < 1.0) {
        alertBox.style.display = 'block';
        alertBox.className = 'weather-alert critical';
        alertBox.innerHTML = `⛔ <strong>ВЗЛЕТ НЕВОЗМОЖЕН!</strong> Тяги моторов недостаточно для веса аппарата в текущих условиях (TWR: ${twr.toFixed(2)}).`;
    } else if (twr < 1.2 && (isHot || isHigh)) {
        alertBox.style.display = 'block';
        alertBox.className = 'weather-alert warning';
        alertBox.innerHTML = `⚠️ <strong>Опасные условия!</strong> Из-за жары/высоты плотность воздуха упала до ${airDensity.toFixed(3)} кг/м³. Запас тяги критически мал.`;
    } else {
        alertBox.style.display = 'none';
    }
}

// ==========================================
// 10. МЕНЕДЖЕР ПРОЕКТОВ
// ==========================================

window.saveProject = function() {
    const projectName = prompt("Введите название проекта:", "Проект 1");
    if (!projectName) return;
    
    const params = getInputParameters();
    const projectData = {
        name: projectName,
        date: new Date().toLocaleString(),
        params: params
    };
    
    let projects = JSON.parse(localStorage.getItem('uavProjects') || '[]');
    projects.push(projectData);
    localStorage.setItem('uavProjects', JSON.stringify(projects));
    
    loadSavedProjects();
    showNotification(`Проект "${projectName}" сохранен!`, 'success');
};

window.loadProject = function(index) {
    const projects = JSON.parse(localStorage.getItem('uavProjects') || '[]');
    if (projects[index]) {
        const proj = projects[index];
        const p = proj.params;
        
        setFieldValue('flightWeight', p.flightWeight);
        setFieldValue('motorCount', p.motorCount);
        setFieldValue('wingArea', p.wingArea);
        setFieldValue('altitude', p.altitude);
        setFieldValue('temperature', p.temperature);
        setFieldValue('batteryCapacity', p.battery.capacity);
        setFieldValue('batteryCells', p.battery.s);
        setFieldValue('motorKv', p.motor.kv);
        setFieldValue('propDiameter', p.propeller.diameter);
        setFieldValue('escCurrentContinuous', p.esc.currentContinuous);
        
        const battSelect = document.getElementById('batteryType');
        if(battSelect) battSelect.value = p.battery.type;
        
        calculateAll();
        showNotification(`Проект "${proj.name}" загружен!`, 'info');
    }
};

window.deleteProject = function(index) {
    if(!confirm('Удалить этот проект?')) return;
    let projects = JSON.parse(localStorage.getItem('uavProjects') || '[]');
    projects.splice(index, 1);
    localStorage.setItem('uavProjects', JSON.stringify(projects));
    loadSavedProjects();
};

function loadSavedProjects() {
    const listElement = document.getElementById('savedProjectsList');
    if (!listElement) return;
    
    const projects = JSON.parse(localStorage.getItem('uavProjects') || '[]');
    
    if (projects.length === 0) {
        listElement.innerHTML = '<div style="color: #64748b; font-size: 13px; padding: 10px;">Нет сохраненных проектов</div>';
        return;
    }
    
    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
    projects.forEach((proj, index) => {
        html += `
            <li style="background: #1e293b; margin-bottom: 8px; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                <div>
                    <div style="font-weight: bold; color: #f1f5f9;">${proj.name}</div>
                    <div style="color: #64748b; font-size: 11px;">${proj.date}</div>
                </div>
                <div>
                    <button onclick="loadProject(${index})" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Загрузить</button>
                    <button onclick="deleteProject(${index})" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    listElement.innerHTML = html;
}

// ==========================================
// 11. СОБЫТИЯ
// ==========================================

function initializeEventListeners() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) calculateBtn.addEventListener('click', calculateAll);
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveProject);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => { location.reload(); });
    
    const weatherInputs = ['altitude', 'temperature'];
    weatherInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculateAll);
        }
    });
    
    const inputFields = document.querySelectorAll('.input-field, .select-field');
    inputFields.forEach(field => {
        field.addEventListener('input', function() { clearTimeout(window.calculationTimeout); window.calculationTimeout = setTimeout(calculateAll, 500); });
        field.addEventListener('change', calculateAll);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white; font-weight: 500; z-index: 10000; background: ${type==='success'?'#10b981':type==='error'?'#ef4444':'#3b82f6'}; animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;`;
    document.body.appendChild(notification);
    setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 3000);
}

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`;
document.head.appendChild(notificationStyles);

console.log('Configurator PRO loaded successfully');

