'use strict';

const DAY_STRING = ['день', 'дня', 'дней'];

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [[2, 7], [3, 10], [7, 21]],
    deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    desktopTemplates = document.getElementById('desktopTemplates'),
    adapt = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    editable = document.getElementById('editable'),
    typeSite = document.querySelector('.type-site'),
    maxDeadlineDay = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    adaptValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    calcDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');

    
function declOfNum(n, titles, from) {
    return n + ' ' + titles[from ? n % 10 === 1 && n % 100 !== 11 ? 1 : 2 : n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

function showElem(elem) {
    elem.style.display = 'block';
}

function hideElem(elem) {
    elem.style.display = 'none';
}

// function dopOptionsString() {
//     //Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
//     let str = '';
//     if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {
//         str += 'Подключим';

//         if (metrikaYandex.checked) {
//             str+= ' Яндекс Метрику';
//             if (analyticsGoogle.checked && sendOrder.checked) {
//                 str += ', Гугл Аналитику и отправку заявок на почту.';
//                 return str;
//             }

//             if (analyticsGoogle.checked || sendOrder.checked) {
//                 str += ' и';
//             }
//         }

//         if (analyticsGoogle.checked) {
//             str += ' Гугл Аналитику';

//             if (sendOrder.checked) {
//                 str += ' и';
//             }
//         }

//         if (sendOrder.checked) {
//             str += ' отправку заявок на почту';
//         }
//         str += '.';
//      }

     

//     return str;
// }
function dopOptionsString2 () {
    let str = '';
    let str1;
    let str2;
    const dops = [metrikaYandex, analyticsGoogle, sendOrder];
    const chosen = [];
    for (const item of dops) {
        console.log(item.getAttribute('data-answer'));
        if (item.checked) {
            chosen.push(item.getAttribute('data-answer'));
        }
    }
    console.log(chosen);
    
    if (chosen.length < 2) {
        str1 =  chosen.slice().join();
        str2 = '';
        str =  str1 + str2;
    } else {
        str1 =  (chosen.slice(0, chosen.length - 1)).join(', ');
        str2 =  chosen.slice(chosen.length - 1).join();
        str =  str1 + str2;
    }
    
    console.log('str1 ' + str1);
    
    console.log('str2 ' + str2);
    if (chosen.length > 0 && chosen.length < 2) {
        str = ' Подключим ' + str1 + '.';
    } else if (chosen.length > 1) {
        str = ' Подключим ' + str1 + ' и ' + str2 + '.';
    } else {
        str = '';
    }
    return str;
    //return ((chosen.length > 0 && chosen.length < 2 ) ? (str = ' Подключим ' + str1 + '.') : (str = '  ' + (str1 + ' и ' + str2 + '.'))) || '';
}







function renderTextContent(total, site, maxDay, minDay) {

    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadlineDay.textContent = declOfNum(maxDay, DAY_STRING, true);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    function toggleAnswer(elem, content) {
        elem.checked ? content.textContent = 'Да' : content.textContent = 'Нет';
    }

    toggleAnswer(desktopTemplates, desktopTemplatesValue);
    toggleAnswer(adapt, adaptValue);
    toggleAnswer(mobileTemplates, mobileTemplatesValue);
    toggleAnswer(editable, editableValue);

    calcDescription.textContent = `
    Сделаем ${site}${adapt.checked ?
         ', адаптированный под мобильные устройства и планшеты': ''}.
         ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : ''}
        ${dopOptionsString2()}
    `;

}


function priceCalculation(elem = {}) {
    let result = 0,
        index = 0,
        options = [],
        site = '',
        maxDeadlineDay = DATA.deadlineDay[index][1],
        minDeadlineDay = DATA.deadlineDay[index][0],
        overPercent = 0;


    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for(const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
            site = item.dataset.site;
            maxDeadlineDay = DATA.deadlineDay[index][1];
            minDeadlineDay = DATA.deadlineDay[index][0];
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        } else if (item.classList.contains('want-faster') && item.checked) {
            const overDay = maxDeadlineDay - rangeDeadline.value;
                overPercent = overDay *(DATA.deadlinePercent[index] / 100);
        }
    }

    result += DATA.price[index];

    options.forEach(function(key) {
        if (typeof(DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key];
            } else {
                result += DATA.price[index] * DATA[key] / 100;
            }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index];
            }
        }
    });


    result += result * overPercent;
    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);

    totalPriceSum.textContent = result;
}

function handlerCallBackForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCalculation(target)
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }

    // ДИЗАЙН ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ

    if(adapt.checked) {
        mobileTemplates.disabled = false;
    } else {
        mobileTemplates.disabled = true;
        mobileTemplates.checked = false;
    }
}

function moveBackTotal() {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
    }
}
function moveTotal() {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
}
startButton.addEventListener('click', function() {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotal);
});


endButton.addEventListener('click', function(){
    
    for (const elem of formCalculate.elements){
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }

    cardHead.textContent = 'Заявка на разработку сайта';
    hideElem(totalPrice);
    showElem(total);

});

formCalculate.addEventListener('change', handlerCallBackForm);

priceCalculation();