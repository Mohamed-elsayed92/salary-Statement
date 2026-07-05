// تعريف البيانات في مصفوفة لتسهيل التكرار عليها
const configs = [
<<<<<<< HEAD
    { id: '1', max: 31, error: '.day-error', priceId: 'price-day', displayId: 'basic-salary' },
    { id: '2', max: 72, error: '.time-error', priceId: 'price-time', displayId: 'valu-time' },
    { id: '3', max: 5, error: '.trip-error', priceId: 'price-trip', displayId: 'value-trip' },
=======
    { id: '1', max:31, error: '.day-error', priceId: 'price-day', displayId: 'basic-salary' },
    { id: '2', max:72, error: '.time-error', priceId: 'price-time', displayId: 'valu-time' },
    { id: '3', max:5,  error: '.trip-error', priceId: 'price-trip', displayId: 'value-trip' },
>>>>>>> ee61aa1734c57c8fbcb6399d02c7b56d1f5b74d3
];

// بدل مقطوع: مبلغ ثابت شهري لموظفي الإدارة (لا يتغير مع الأيام أو الساعات)
const FIXED_ALLOWANCE = 300;

const employaeeData = [
    { id: 1, name: "علي عبد العزيز محمود", jop: "محاسب", department: "حسابات كرامة" },
    { id: 2, name: "محمد عبد الخالق مرعي", jop: "محاسب", department: "حسابات كرامة" },
];

// عناصر الواجهة
const elements = {
    totalSalary: document.getElementById('total-salary'),
    tableTotal: document.getElementById('total-amount'),
    insurance: document.getElementById('insurance-value'),
    deductions: document.getElementById('total-deductions'),
    deductions2: document.getElementById('total-deductions2'),
    tax: document.getElementById('tax-value'),
    otherDedactions: document.getElementById('other-deductions'),
    netSalary: document.getElementById('net-salary'),
    fixedAllowance: document.getElementById('fixed-allowance'),
    // عناصر عرض بيانات الموظفين
    employaeeData: document.getElementById('employeeIdInput'),
    empName: document.querySelector('.emp-name'),
    empJob: document.querySelector('.emp-job'),
    empDept: document.querySelector('.emp-dept'),
};

function findEmployee() {
    const enteredId = parseInt(elements.employaeeData.value);

    // البحث في مصفوفة employaeeData
    const employee = employaeeData.find(emp => emp.id === enteredId);

    if (employee) {
        // إذا وجد الموظف، نعرض بياناته
        if (elements.empName) elements.empName.innerText = employee.name;
        if (elements.empJob) elements.empJob.innerText = employee.jop;
        if (elements.empDept) elements.empDept.innerText = employee.department;
    } else {
        // إذا لم يوجد، نمسح البيانات
        [elements.empName, elements.empJob, elements.empDept].forEach(el => {
            if (el) el.innerText = "-----";
        });
    }
}

if (elements.employaeeData) {
    elements.employaeeData.addEventListener('input', findEmployee);
}

// 1. الحصول على التاريخ الحالي
const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);

// 2. استخراج اسم الشهر باللغة العربية
const monthName = currentDate.toLocaleString('ar-EG', { month: 'long' });

// 3. استخراج السنة
const yearNumber = currentDate.getFullYear();

// 4. وضع القيم داخل العناصر في الصفحة
document.getElementById('month-name').textContent = monthName;
document.getElementById('year-number').textContent = yearNumber;

function calculateEgyptTax(monthlySalary) {
    // 1. الإعدادات الأساسية (سنوية)
    const annualGross = monthlySalary * 12;
    const inshuranceBasic = 6412.5;
    const monthlyInsurance = (inshuranceBasic / 1.1875) * 0.11;
    const annualInsurance = monthlyInsurance * 12;
    const personalExemption = 20000; // الإعفاء الشخصي السنوي
    let taxableIncome = annualGross - annualInsurance - personalExemption;

    // 4. نظام الشرائح (للدخول التي لا تتجاوز 600 ألف جنيه سنوياً)
    const brackets = [
        { limit: 40000, rate: 0.00 },   // الشريحة الأولى (معفاة)
        { limit: 15000, rate: 0.10 },   // من 40,001 إلى 55,000
        { limit: 15000, rate: 0.15 },   // من 55,001 إلى 70,000
        { limit: 130000, rate: 0.20 },  // من 70,001 إلى 200,000
        { limit: 200000, rate: 0.225 }, // من 200,001 إلى 400,000
        { limit: 800000, rate: 0.25 },  // من 400,001 إلى 1,200,000
        { limit: Infinity, rate: 0.275 } // ما زاد عن 1,200,000
    ];

    let totalAnnualTax = 0;
    let remainingIncome = Math.max(0, taxableIncome);

    for (let bracket of brackets) {
        if (remainingIncome <= 0) break;
        let amountInBracket = Math.min(remainingIncome, bracket.limit);
        totalAnnualTax += amountInBracket * bracket.rate;
        remainingIncome -= amountInBracket;
    }

    const monthlyTax = totalAnnualTax / 12;
    return {
        monthlyTax: Math.max(0, monthlyTax),
        monthlyInsurance: monthlyInsurance,
        taxableIncome: taxableIncome / 12 // الوعاء الشهري للعرض فقط
    };
}

function updateUI() {
    let grandTotal = 0;
    let totalDeductions = 0;

    configs.forEach(conf => {
        const input = document.getElementById(`input${conf.id}`);
        const display = document.getElementById(conf.displayId);
        const priceElem = document.getElementById(conf.priceId);
        const errorElem = document.querySelector(conf.error);

        // التحقق من القيمة القصوى
        if (!input || !display) return; // تخطي إذا لم يوجد العنصر
        let val = parseFloat(input.value) || 0;
        const price = priceElem ? parseFloat(priceElem.innerText) : 0;
        if (val > conf.max) {
            val = conf.max;
            input.value = val;
            if (errorElem) errorElem.style.visibility = "visible";
            input.style.borderColor = input.style.outlineColor = "red";
        } else {
            if (errorElem) errorElem.style.visibility = "hidden";
            input.style.borderColor = "";
        }

        // 2. حساب القيم بناءً على نوع العنصر
        if (!conf.isDeduction) {
            // حساب المستحقات (ساعات/أيام * سعر)
            const subTotal = val * price;
            display.innerText = subTotal.toFixed(2);
            grandTotal += subTotal;
        } else {
            // حساب الخصومات (تؤخذ القيمة كما هي)
            display.innerText = val.toFixed(2);
            totalDeductions += val;
        }
    });

    // بدل مقطوع: مبلغ ثابت (مُخزَّن في FIXED_ALLOWANCE)، لكن لا يُحتسب أو يظهر
    // إلا بعد كتابة عدد الأيام في input1
    const daysInput = document.getElementById('input1');
    const daysVal = daysInput ? (parseFloat(daysInput.value) || 0) : 0;

    if (daysVal > 0) {
        grandTotal += FIXED_ALLOWANCE;
        if (elements.fixedAllowance) elements.fixedAllowance.innerText = FIXED_ALLOWANCE.toFixed(2);
    } else if (elements.fixedAllowance) {
        elements.fixedAllowance.innerText = "0.00";
    }

    // الشرط: هل إجمالي المستحقات أكبر من صفر؟
    if (grandTotal > 0) {
        const taxResults = calculateEgyptTax(grandTotal);
        if (elements.insurance) elements.insurance.innerText = taxResults.monthlyInsurance.toFixed(2);
        if (elements.tax) elements.tax.innerText = taxResults.monthlyTax.toFixed(2);
        let elshohada = (grandTotal - taxResults.monthlyInsurance) * .0005;
        elshohada = Math.max(0, elshohada);
        const finalDeductions = totalDeductions + taxResults.monthlyInsurance + taxResults.monthlyTax + elshohada;

        if (elements.deductions) elements.deductions.innerText = finalDeductions.toFixed(2);
        if (elements.deductions2) elements.deductions2.innerText = finalDeductions.toFixed(2);
        if (elements.otherDedactions) elements.otherDedactions.innerText = elshohada.toFixed(2);
        if (elements.netSalary) elements.netSalary.innerText = (grandTotal - finalDeductions).toFixed(2);
    } else {
        [elements.insurance, elements.tax, elements.deductions, elements.netSalary, elements.otherDedactions].forEach(el => {
            if (el) el.innerText = "0.00";
        });
    }
    if (elements.totalSalary) elements.totalSalary.innerText = grandTotal.toFixed(2);
    if (elements.tableTotal) elements.tableTotal.innerText = grandTotal.toFixed(2);
}

// ربط الحدث بجميع المدخلات
configs.forEach(conf => {
    const input = document.getElementById(`input${conf.id}`);
<<<<<<< HEAD
    if (input) input.addEventListener('input', updateUI);
});

// تشغيل الحساب مرة واحدة عند تحميل الصفحة (لعرض بدل المقطوع الثابت فوراً)
updateUI();
=======
 if(input) input.addEventListener('input', updateUI);
});
>>>>>>> ee61aa1734c57c8fbcb6399d02c7b56d1f5b74d3
