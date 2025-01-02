import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Product } from './product';
import { ProductShop } from './productShop';

import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const allData1 = [
    {
        "componentName": "Каркас: Mark4",
        "componentAmount": 1,
        "componentPrice": "699.0",
        "componentURL": "https://top-best.ua/uk/rama-kvadrokoptera-anomaly-mark-4-7-295mm-fpv-carbon-frame-black-chornyy.html?gad_source=1&gclid=EAIaIQobChMIzL6vsr72hQMV3GiRBR3dbQ1xEAQYAiABEgKpwvD_BwE"
    },
    {
        "componentName": "Політний стек: SpeedyBee F405 V3 Stack BLS 50A",
        "componentAmount": 1,
        "componentURL": "https://t-port.com.ua/ua/p2076653372-polyotnyj-stek-speedybee.html",
        "componentPrice": "2750.0"
    },
    {
        "componentName": "Мотори (4 шт.): EMAX ECOII Series ECO II 2807 6S 1300KV",
        "componentAmount": 4,
        "componentURL": "https://leti.com.ua/ru/electronics/motors/uangel-x2807-1300kv-4s-6s-brushless-motor-for-mark4-fpv/",
        "componentPrice": "3608.0"
    },
    {
        "componentName": "Пропелери: HQPROP 7040 7X4X3 (4 шт.)",
        "componentAmount": 4,
        "componentURL": "https://modelistam.com.ua/propellery-hqprop-7x4x3-polikarbonat-p-47600/?gad_source=1&gclid=EAIaIQobChMI19HY0L_2hQMVlz4GAB1nygbdEAQYASABEgL2wvD_BwE",
        "componentPrice": "170.0"
    },
    {
        "componentName": "Камера: Caddx Ant",
        "componentAmount": 1,
        "componentURL": "https://drono.store/fpv-kameras/494-1272-kamera-dlya-fpv-dronrejsingu-caddx-ant.html#/48-kolir-black/151-format_zobrazhennya-16_9",
        "componentPrice": "599.60"
    },
    {
        "componentName": "Відеопередавач (VTX): AKK Race Ranger 1.6W",
        "componentAmount": 1,
        "componentURL": "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_AKK_Race_Ranger_VTX_TX1918LX-p979482/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIg4S9n8D2hQMV6DEGAB0Ncg25EAQYASABEgK5W_D_BwE",
        "componentPrice": "792.0"
    },
    {
        "componentName": "Антена: Lollipop 4 V4 (SMA 10CM)",
        "componentAmount": 1,
        "componentURL": "https://prom.ua/ua/p2015004750-antenna-dlya-fpv.html?token=v2%3AVpBI5-W9b7lWNO15YWSTDY3ZXQ6EHprzw9I-mtuNslf76i32GqMoA9QJCs5eVhxKg26cODdyg47GiVqTbLDPlUSawjBCxKOAtdKBMHNIcAwhDhXYuezkS5LzCaTcsWGg&campaign_id=3615887&product_id=2015004750&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
        "componentPrice": "359.0"
    },
    {
        "componentName": "Приймач: Readytosky ELRS 915MHz",
        "componentAmount": 1,
        "componentURL": "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_HappyModel_Happymodel_ExpressLRS_ELRS_ES900RX_06g_Receiver_868MHZ-ES900RX-p938192/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIyOC6ysD2hQMV_KdoCR2ncA4mEAQYASABEgLeFfD_BwE",
        "componentPrice": "528.0"
    }
]

const allData2 = [
    {
        "componentName": "Каркас: Mark4",
        "componentAmount": 1,
        "componentPrice": "699.0",
        "componentURL": "https://top-best.ua/uk/rama-kvadrokoptera-anomaly-mark-4-7-295mm-fpv-carbon-frame-black-chornyy.html?gad_source=1&gclid=EAIaIQobChMIzL6vsr72hQMV3GiRBR3dbQ1xEAQYAiABEgKpwvD_BwE"
    },
    {
        "componentName": "Політний стек: SpeedyBee F405 V3 Stack BLS 50A",
        "componentAmount": 1,
        "componentURL": "https://t-port.com.ua/ua/p2076653372-polyotnyj-stek-speedybee.html",
        "componentPrice": "2750.0"
    },
    {
        "componentName": "Мотори (4 шт.): EMAX ECOII Series ECO II 2807 6S 1300KV",
        "componentAmount": 4,
        "componentURL": "https://leti.com.ua/ru/electronics/motors/uangel-x2807-1300kv-4s-6s-brushless-motor-for-mark4-fpv/",
        "componentPrice": "3608.0"
    },
    {
        "componentName": "Пропелери: HQPROP 7040 7X4X3 (4 шт.)",
        "componentAmount": 4,
        "componentURL": "https://modelistam.com.ua/propellery-hqprop-7x4x3-polikarbonat-p-47600/?gad_source=1&gclid=EAIaIQobChMI19HY0L_2hQMVlz4GAB1nygbdEAQYASABEgL2wvD_BwE",
        "componentPrice": "170.0"
    },
    {
        "componentName": "Камера: Caddx Ratel 2 V2",
        "componentAmount": 1,
        "componentURL": "https://prom.ua/ua/p2117280955-fpv-kamera-caddx.html?token=v2%3Af36SBZEF0f0M3PgCEdQwuF3iZfS7lU3qkN0Yb5TWV2xKEnJfzM1TLgzrayXGc2dWAGRrpHBnMSKCnyIpFMPqiCYpRIjD3C7JFdcjOkhRCwQdz_hRuVD_HQ5n5VQ9V-Rg&campaign_id=3887821&product_id=2117280955&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
        "componentPrice": "1040.0"
    },
    {
        "componentName": "Відеопередавач (VTX): JHEMCU 2.5W VTX 5.8G",
        "componentAmount": 1,
        "componentURL": "https://drone-azimyth.com.ua/index.php?route=product/product&product_id=959&gad_source=1&gclid=EAIaIQobChMIl4O27cf2hQMVdgCiAx2k-gvEEAQYASABEgJ3KfD_BwE",
        "componentPrice": "2200.0"
    },
    {
        "componentName": "Антена: RUSHFPV Cherry Long SMA 5.8G RHCP 160mm",
        "componentAmount": 1,
        "componentURL": "https://prom.ua/ua/p2114675426-antena-dlya-fpv.html?token=v2%3AQluFskRBYSZ9k41f7-KuYu4x5N3almnkW2Xd1ZQBvn6RfgPHaKLR9Zw6mdcpZSl8srcjWSivm_2i6ON5XISK2AQM_sKzaK1Z8MHWTyltaNe2wEUzOvaVZkcbeS0J-Jgq&campaign_id=3854154&product_id=2114675426&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
        "componentPrice": "312.0"
    },
    {
        "componentName": "Приймач: TBS Crossfire Nano RX (SE)",
        "componentAmount": 1,
        "componentURL": "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_TBS_Crossfire_Nano_SE_RX_with_T_antenna_HP167-0004-p954590/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIpurliMn2hQMV1EpBAh17XQ8eEAQYASABEgIEBPD_BwE",
        "componentPrice": "1190.0"
    },
    {
        "componentName": "Буззер: Буззер Tarot для пошуку моделі",
        "componentAmount": 1,
        "componentURL": "https://modelistam.com.ua/ua/buzzer-tarot-dlya-poiska-modeli-tl3005-p-34936/",
        "componentPrice": "280.0"
    },
    {
        "componentName": "GPS: Beitian BE-220 GPS",
        "componentAmount": 1,
        "componentURL": "https://top-best.ua/modul-dlya-kvadrokopterov-beitian-be-220-gps-white-belyy.html?gad_source=1&gclid=EAIaIQobChMI0InE5sn2hQMVzVGRBR3nwwSBEAQYASABEgKgV_D_BwE",
        "componentPrice": "559.0"
    }
]

const allData3 = [
    {
        "componentName": "Квадрокоптер: FPV CHG 7",
        "componentAmount": 1,
        "componentPrice": "16125.0",
        "componentURL": "https://rozetka.com.ua/ua/chg-seakd5pro/p422499858/"
    },
    {
        "componentName": "Пульт керування: Commando 8 ELRS 868/915MHz",
        "componentAmount": 1,
        "componentURL": "https://r202x.com/ru/pult-commando-8-elrs-868-915mhz-1w-1000mw-iflight-aparatura-dlia-drona-fpv-kvadrokoptera/",
        "componentPrice": "6777.0"
    },
    {
        "componentName": "Окуляри: iFlight Analog FPV Goggles, 5.8Ггц",
        "componentAmount": 1,
        "componentURL": "https://dron-shop.com.ua/fpv/fpv_googles/iflight-analog-fpv-goggles",
        "componentPrice": "3695.0"
    }
]

const downloadKit = async (index) => {
    console.log("INDEX = ", index);
    const headers = ["Назва комплектуючої", "Необхідна кількість", "Ціна, грн.", "Посилання на товар в магазині"];
    let data = [];

    if (index == 0) {
        data = [headers, ...allData1.map(item => [
            item.componentName,
            item.componentAmount,
            item.componentPrice,
            item.componentURL
        ])];
    }
    else if (index == 1) {
        data = [headers, ...allData2.map(item => [
            item.componentName,
            item.componentAmount,
            item.componentPrice,
            item.componentURL
        ])];
    }
    else if (index == 2) {
        data = [headers, ...allData3.map(item => [
            item.componentName,
            item.componentAmount,
            item.componentPrice,
            item.componentURL
        ])];
    }
    else return;

    try {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Components');
        XLSX.writeFile(wb, "kit-components.xlsx");
    } catch (err) {
        console.error('Error:', err);
    }
};

const ComponentList = () => {
    return (
        <div className="component-list" style={{ width:"80%", paddingLeft: "120px" }}>
            <h3><a href="https://youtu.be/75SbiwqW7DM?si=3QH5_ZYiWzLsHX2-" target="_blank">Посилання на відеоінструкцію зі збірки</a></h3>
            <h3><a href="https://youtu.be/NlzVfn5iKSE?si=h6mNHYuAVqZKObLP" target="_blank">Посилання на відеоінструкцію для налаштування</a></h3>

            <h3>Необхідні деталі та кріплення</h3>
            <ul>
                <li>Ремінець для кріплення батареї (для більшості Li-ion добре підійде 30см)</li>
                <li>5pcs iFlight 20x300mm FPV Belt Iron buckle</li>
                <li>YSIDO Tape Nylon Lipo Strap Belt (є різні розміри)</li>
                <li>Для кріплення VTX, потрібно 4 гвинтики М3х12 і для них 4 гайки М3. Також відеопередавач можна прикріпити стяжками.</li>
                <li>Демферні гумки для польотника чи регулятора</li>
                <li>Силіконові шайби для регулювання висоти стеку</li>
                <li>Запасні гайки для пропелерів (М5)</li>
                <li>Гайки для пропелерів від EMAX</li>
                <li>Сталеві та пластикові гвинти</li>
                <li>Сталеві та пластикові гайки</li>
                <li>Пластикові проставки М3</li>
                <li>Пластикові шайби різних розмірів</li>
                <li>Захисна оплітка (6мм) (не обво'зково)</li>
            </ul>
            <h3>Необхідні інструменти</h3>
            <ul>
                <li>Паяльник</li>
                <li>Стружка для чистки паяльника в корпусі. Окремо стружка</li>
                <li>Пінцет</li>
                <li>Екструдер для флюсу</li>
                <li>Лоток для гвинтів</li>
                <li>Припій</li>
                <li>Набір екстракторів для злизаних гвинтів</li>
            </ul>
        </div>
    );
};

const ComponentList3 = () => {
    return (
        <div className="component-list" style={{ width:"80%", paddingLeft: "120px" }}>
            <h3><a href="https://youtu.be/NlzVfn5iKSE?si=h6mNHYuAVqZKObLP" target="_blank">Посилання на відеоінструкцію для налаштування</a></h3>

            <h3>Опис</h3>
            <ul>
                <li>1. Рама карбонова FH 7 дюймов (6 мм)</li>
                <li>2. Політний контролер SpeedyBee F405 V3</li>
                <li>3. Безколекторний електро двигун FH2807-KV1300</li>
                <li>4. Повітряні гвинт GemFan 7040 (7/4/3)</li>
                <li>5. Камера Caddx Ratel Pro 1500TVL</li>
                <li>6. Приймач FH дальньої дії ELRS 915 МГц RX</li>
                <li>7. Передавач відео Akk FX Dominator 5.8 ГГц 2000 мВт VTX</li>
                <li>8. Антена FH Lollipop Cherry 5.8 ГГц</li>
            </ul>
        </div>
    );
};

const list1 = [
    {
        "componentDescription": {
            "Каркас: Mark4": [
                "https://top-best.ua/uk/rama-kvadrokoptera-anomaly-mark-4-7-295mm-fpv-carbon-frame-black-chornyy.html?gad_source=1&gclid=EAIaIQobChMIzL6vsr72hQMV3GiRBR3dbQ1xEAQYAiABEgKpwvD_BwE",
                "699.0"
            ],
            "Політний стек: SpeedyBee F405 V3 Stack BLS 50A": [
                "https://t-port.com.ua/ua/p2076653372-polyotnyj-stek-speedybee.html",
                "2750.0"
            ],
            "Мотори (4 шт.): EMAX ECOII Series ECO II 2807 6S 1300KV": [
                "https://leti.com.ua/ru/electronics/motors/uangel-x2807-1300kv-4s-6s-brushless-motor-for-mark4-fpv/",
                "3608.0"
            ],
            "Пропелери: HQPROP 7040 7X4X3 (4 шт.)": [
                "https://modelistam.com.ua/propellery-hqprop-7x4x3-polikarbonat-p-47600/?gad_source=1&gclid=EAIaIQobChMI19HY0L_2hQMVlz4GAB1nygbdEAQYASABEgL2wvD_BwE",
                "170.0"
            ],
            "Камера: Caddx Ant": [
                "https://drono.store/fpv-kameras/494-1272-kamera-dlya-fpv-dronrejsingu-caddx-ant.html#/48-kolir-black/151-format_zobrazhennya-16_9",
                "599.60"
            ],
            "Відеопередавач (VTX): AKK Race Ranger 1.6W": [
                "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_AKK_Race_Ranger_VTX_TX1918LX-p979482/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIg4S9n8D2hQMV6DEGAB0Ncg25EAQYASABEgK5W_D_BwE",
                "792.0"
            ],
            "Антена: Lollipop 4 V4 (SMA 10CM)": [
                "https://prom.ua/ua/p2015004750-antenna-dlya-fpv.html?token=v2%3AVpBI5-W9b7lWNO15YWSTDY3ZXQ6EHprzw9I-mtuNslf76i32GqMoA9QJCs5eVhxKg26cODdyg47GiVqTbLDPlUSawjBCxKOAtdKBMHNIcAwhDhXYuezkS5LzCaTcsWGg&campaign_id=3615887&product_id=2015004750&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
                "359.0"
            ],
            "Приймач: Readytosky ELRS 915MHz": [
                "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_HappyModel_Happymodel_ExpressLRS_ELRS_ES900RX_06g_Receiver_868MHZ-ES900RX-p938192/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIyOC6ysD2hQMV_KdoCR2ncA4mEAQYASABEgLeFfD_BwE",
                "528.0"
            ]
        },
        "componentImageURL": "https://images.prom.ua/5348731045_w640_h640_kvadrokopter-geprc-mark4.jpg"
    },
    {
        "componentDescription": {
            "Каркас: Mark4": [
                "https://top-best.ua/uk/rama-kvadrokoptera-anomaly-mark-4-7-295mm-fpv-carbon-frame-black-chornyy.html?gad_source=1&gclid=EAIaIQobChMIzL6vsr72hQMV3GiRBR3dbQ1xEAQYAiABEgKpwvD_BwE",
                "699.0"
            ],
            "Політний стек: SpeedyBee F405 V3 Stack BLS 50A": [
                "https://t-port.com.ua/ua/p2076653372-polyotnyj-stek-speedybee.html",
                "2750.0"
            ],
            "Мотори (4 шт.): EMAX ECOII Series ECO II 2807 6S 1300KV": [
                "https://leti.com.ua/ru/electronics/motors/uangel-x2807-1300kv-4s-6s-brushless-motor-for-mark4-fpv/",
                "3608.0"
            ],
            "Пропелери: HQPROP 7040 7X4X3 (4 шт.)": [
                "https://modelistam.com.ua/propellery-hqprop-7x4x3-polikarbonat-p-47600/?gad_source=1&gclid=EAIaIQobChMI19HY0L_2hQMVlz4GAB1nygbdEAQYASABEgL2wvD_BwE",
                "170.0"
            ],
            "Камера: Caddx Ratel 2 V2": [
                "https://prom.ua/ua/p2117280955-fpv-kamera-caddx.html?token=v2%3Af36SBZEF0f0M3PgCEdQwuF3iZfS7lU3qkN0Yb5TWV2xKEnJfzM1TLgzrayXGc2dWAGRrpHBnMSKCnyIpFMPqiCYpRIjD3C7JFdcjOkhRCwQdz_hRuVD_HQ5n5VQ9V-Rg&campaign_id=3887821&product_id=2117280955&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
                "1040.0"
            ],
            "Відеопередавач (VTX): JHEMCU 2.5W VTX 5.8G": [
                "https://drone-azimyth.com.ua/index.php?route=product/product&product_id=959&gad_source=1&gclid=EAIaIQobChMIl4O27cf2hQMVdgCiAx2k-gvEEAQYASABEgJ3KfD_BwE",
                "2200.0"
            ],
            "Антена: RUSHFPV Cherry Long SMA 5.8G RHCP 160mm": [
                "https://prom.ua/ua/p2114675426-antena-dlya-fpv.html?token=v2%3AQluFskRBYSZ9k41f7-KuYu4x5N3almnkW2Xd1ZQBvn6RfgPHaKLR9Zw6mdcpZSl8srcjWSivm_2i6ON5XISK2AQM_sKzaK1Z8MHWTyltaNe2wEUzOvaVZkcbeS0J-Jgq&campaign_id=3854154&product_id=2114675426&source=prom%3Asearch%3Aserp&locale=uk&category_ids=500415&from_spa=true",
                "312.0"
            ],
            "Приймач: TBS Crossfire Nano RX (SE)": [
                "https://www.itbox.ua/ua/product/Zapchastina_dlya_drona_TBS_Crossfire_Nano_SE_RX_with_T_antenna_HP167-0004-p954590/?utm_content=new_buyers&gad_source=1&gclid=EAIaIQobChMIpurliMn2hQMV1EpBAh17XQ8eEAQYASABEgIEBPD_BwE",
                "1190.0"
            ],
            "Буззер: Буззер Tarot для пошуку моделі": [
                "https://modelistam.com.ua/ua/buzzer-tarot-dlya-poiska-modeli-tl3005-p-34936/",
                "280.0"
            ],
            "GPS: Beitian BE-220 GPS": [
                "https://top-best.ua/modul-dlya-kvadrokopterov-beitian-be-220-gps-white-belyy.html?gad_source=1&gclid=EAIaIQobChMI0InE5sn2hQMVzVGRBR3nwwSBEAQYASABEgKgV_D_BwE",
                "559.0"
            ]
        },
        "componentImageURL": "https://prodrone.com.ua/content/images/45/390x390l80mc0/60049038610524.webp"
    },
    {
        "componentDescription": {
            "Квадрокоптер: FPV CHG 7": [
                "https://rozetka.com.ua/ua/chg-seakd5pro/p422499858/",
                "16125.0"
            ],
            "Пульт керування: Commando 8 ELRS 868/915MHz": [
                "https://r202x.com/ru/pult-commando-8-elrs-868-915mhz-1w-1000mw-iflight-aparatura-dlia-drona-fpv-kvadrokoptera/",
                "6777.0"
            ],
            "Окуляри: iFlight Analog FPV Goggles, 5.8Ггц": [
                "https://dron-shop.com.ua/fpv/fpv_googles/iflight-analog-fpv-goggles",
                "3695.0"
            ]
        },
        "componentImageURL": "https://content.rozetka.com.ua/goods/images/big/416442442.jpg",
    }
]


const list2 = [
    {
        "componentName": "Літак Heewing T2 Cruza PNP (Grey)",
        "componentPrice": "17800.0",
        "componentImageURL": "https://modelistam.com.ua/images/samolet-heewing-t2-cruza-pnp-grey.jpg",
        "componentExternalURL": "https://modelistam.com.ua/ua/samolet-heewing-cruza-pnp-grey-p-48972/?gad_source=1&gclid=EAIaIQobChMIr52l5Nj2hQMVo1FBAh00XAzKEAQYASABEgJHbPD_BwE",
        "componentShopName": "Modelistam",
        "componentCountry": "Україна"
    },
    {
        "componentName": "Квадрокоптер DarwinFPV TinyApe25 HD, ELRS 2.4Ггц",
        "componentPrice": "10398.0",
        "componentImageURL": "https://images.prom.ua/4697055295_kvadrokopter-darwinfpv-tinyape25.jpg",
        "componentExternalURL": "https://extreme-ukraine.com/p1896161346-kvadrokopter-darwinfpv-tinyape25.html?source=merchant_center&utm_source=google&utm_medium=cpc&utm_campaign=20311699884&utm_term=&utm_content=&utm_position=&utm_matchtype=&utm_placement=&utm_network=x&gad_source=1&gclid=EAIaIQobChMIhZiMsNv2hQMVQQqiAx1rkwWcEAQYCiABEgJjevD_BwE",
        "componentShopName": "Modelistam",
        "componentCountry": "Україна"
    },
    {
        "componentName": "БПЛА Крило",
        "componentPrice": "49999.0",
        "componentImageURL": "https://images.prom.ua/5412260422_w640_h640_dron-razvedchik-bpla.jpg",
        "componentExternalURL": "https://prom.ua/ua/p2101620687-dron-razvedchik-bpla.html",
        "componentShopName": "Prom.ua",
        "componentCountry": "Україна"
    },
    {
        "componentName": "Гексакоптер Yuneec H850 RTF/RTK T1",
        "componentPrice": "307844.0",
        "componentImageURL": "https://i.moyo.ua/img/products/5430/13_600.jpg?1714863947",
        "componentExternalURL": "https://www.moyo.ua/geksakopter_yuneec_h850_rtf_rtk_t1_2_acc_transportnyy_keys_universal_payload/543013.html?utm_source=google&utm_medium=cpc&utm_id=20589500605&utm_campaign=Performance_Max_Local_store_visits_and_promotions_%D0%BC%D0%B0%D0%BA%D1%81_%D1%86%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D1%8C&gad_source=1&gclid=EAIaIQobChMIkJuR9Nr2hQMVX09BAh0MSQ43EAQYBiABEgIuE_D_BwE",
        "componentShopName": "MOYO",
        "componentCountry": "Україна"
    },
    {
        "componentName": "Квадрокоптер RC E88 Pro 2023 Black - дрон з 4K і HD камерами",
        "componentPrice": "995.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/rce88pro2023/kvadrokoptere88prodrone2023%281%29-500x500.jpeg.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/others/rc-e88-pro-black-2023"
    },
    {
        "componentName": "Квадрокоптер RC X6 - дрон з 4K камерою, FPV, барометр",
        "componentPrice": "1395.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/rcx6pro/kvadrokopterx6drone%281%29-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/others/rc-x6"
    },
    {
        "componentName": "Квадрокоптер Eachine E58 / 998 / JY 019 − дрон з 2MP HD Wi-Fi камерою, FPV, барометр",
        "componentPrice": "1095.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/eachinee58/kvadrokoptereachinee58%281%29-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/eachine/eachine-e58-55"
    },
    {
        "componentName": "Квадрокоптер Emax Tinyhawk III RTF FPV Kit – FPV дрон з камерою",
        "componentPrice": "12695.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/emaxtinyhawkiiirtffpvkit/kopteremaxtinyhawkrtfkitdron-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/emax/tinyhawk-iii-rtf-kit"
    },
    {
        "componentName": "Квадрокоптер BetaFPV Cetus Pro FPV Kit – FPV-дрон з камерою, оптичне позиціонування, БК мотори, барометр, окуляри в кейсі",
        "componentPrice": "11295.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/betafpvcetusprofpvkit/betafpvcetusprofpvdronkitkvadrokopter-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/betafpv/betafpv-cetus-pro-fpv-kit"
    },
    {
        "componentName": "Квадрокоптер GEPRC CineLog 30 Analog 3 TBS Nano RX",
        "componentPrice": "12395.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/geprccinelog30analog/drongeprccinelog30cinewhoopanalog-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/geprc/cinelog-30-3-analog-tbs-nano-rx"
    },
    {
        "componentName": "Квадрокоптер Emax EZ Pilot Pro RTF Kit – FPV дрон з камерою, БК моторами, окулярами",
        "componentPrice": "10295.0",
        "componentImageURL": "https://www.flydron.com.ua/image/cache/catalog/quadcopters/emaxeasypilotprortfkit/emaxezpilotprortfkit-500x500.png.webp",
        "componentExternalURL": "https://www.flydron.com.ua/quadcopters/emax/ez-pilot-pro-rtf-kit"
    },
]


const instruction1 = "1";
const instruction2 = "2";
const instruction3 = "3";

const ProductList = ({search_result, setInstruction}) => {
    return (
      <div class="container py-2">
        <div class="row">
            {Array.isArray(search_result) && search_result.length > 0 ? (
                search_result.map(
                    (product, index) => (
                        <Product key={product.id} data={product} index={index} setInstruction={setInstruction} downloadKit={downloadKit} />
                    )
                )
            ) : (
                null
            )}
        </div>
      </div>
    );
};

const ProductShopList = ({search_result}) => {
    return (
      <div class="container py-2">
        <div class="row">
            {Array.isArray(search_result) && search_result.length > 0 ? (
              search_result.map((product) => <ProductShop key={product.id} data={product} />)
            ) : (
              null
            )}
        </div>
      </div>
    );
};

export const Kits = (props) => {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [instruction, setInstruction] = useState(null);

    const handleInstructionChange = (index) => {
        console.log("What =  ", index);

        if (index === currentIndex && index != null) {
            setCurrentIndex(null);
            setInstruction(null);
            return;
        }

        setCurrentIndex(index);
        if (index === 0) {
            setInstruction(instruction1);
        }
        else if (index === 1) {
            setInstruction(instruction2);
        }
        else if (index === 2) {
            setInstruction(instruction3);
        }
    }

    return (
        <div style={{ paddingTop: "70px" }}>
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="w3-bar-item sub-title" style={{ marginTop: "20px", marginLeft: "15%" }}>Набір для збору квадрокоптера</h5>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end align-items-center" style={{ paddingTop: "15px", paddingRight: "175px" }}>
                        <Link to="/kits/compare" className="btn btn-success">
                            Перевірити комплектуючі
                        </Link>
                    </div>
                </div>
                
                <ProductList
                    search_result={list1} 
                    setInstruction={handleInstructionChange}
                />
            </div>
            
            <div>
                {(instruction === "1" || instruction === "2") ? <ComponentList /> : (instruction === "3" ? <ComponentList3 /> : null)}
            </div>
        </div>
    );
};
