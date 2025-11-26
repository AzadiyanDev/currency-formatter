# currency-formatter
# کتابخانه فرمت کننده ارز و تبدیل اعداد به فارسی
## Currency Formatter Library

این کتابخانه برای فرمت کردن اعداد ارزی (سه رقم سه رقم با کاما) و تبدیل اعداد به حروف فارسی طراحی شده است.

---

## ویژگی‌ها

✅ **فرمت کردن اعداد با کاما (1,234,567.89)**  
✅ **تبدیل اعداد به حروف فارسی (صد و بیست و سه هزار)**  
✅ **پشتیبانی از اعشار فارسی**  
✅ **فرمت کردن زنده (Live Formatting) روی اینپوت‌ها**  
✅ **نمایش خودکار متن فارسی زیر اینپوت**  
✅ **قابل استفاده مجدد در تمام صفحات**  

---

## نصب و استفاده

### 1. اضافه کردن کتابخانه به صفحه

```html
<script src="~/js/currency-formatter.js"></script>
```

### 2. استفاده ساده - فرمت کردن عدد

```javascript
// فرمت کردن عدد با کاما
const formatted = currencyFormatter.formatNumber(1234567.89);
console.log(formatted); // "1,234,567.89"

// تبدیل به حروف فارسی
const words = currencyFormatter.numberToWords(1234567);
console.log(words); // "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت"

// تبدیل به حروف فارسی با نام ارز
const withCurrency = currencyFormatter.numberToWordsWithCurrency(1234567, 'دلار');
console.log(withCurrency); // "یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت دلار"
```

---

## روش‌های استفاده

### روش 1: فرمت کردن دستی

```javascript
// فقط فرمت کردن عدد
const number = 123456.78;
const formatted = currencyFormatter.formatNumber(number, 2); // 2 رقم اعشار
console.log(formatted); // "123,456.78"

// Parse کردن عدد فرمت شده
const parsed = currencyFormatter.parseFormattedNumber("123,456.78");
console.log(parsed); // 123456.78
```

---

### روش 2: پیکربندی کامل اینپوت (توصیه می‌شود)

این روش ساده‌ترین و کامل‌ترین روش است:

#### HTML
```html
<div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ</label>
    <input type="text" id="amountInput" placeholder="مبلغ را وارد کنید"
        class="w-full bg-white rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300 text-right">
    <!-- متن فارسی خودکار اینجا اضافه می‌شود -->
</div>
```

#### JavaScript
```javascript
const amountInput = document.getElementById('amountInput');

currencyFormatter.setupCurrencyInput(amountInput, {
    currencyName: 'دلار',        // نام ارز برای نمایش فارسی
    decimals: 2,                 // تعداد اعشار
    showPersianText: true,       // نمایش متن فارسی زیر اینپوت
    onChange: (numericValue, formattedValue) => {
        console.log('مقدار عددی:', numericValue);
        console.log('مقدار فرمت شده:', formattedValue);
        // هر عملیاتی که نیاز دارید اینجا انجام دهید
    }
});
```

**خروجی:**
- اینپوت به صورت زنده فرمت می‌شود: `1,234,567.89`
- زیر اینپوت متن فارسی نمایش داده می‌شود: `یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشتاد و نه دلار`

---

### روش 3: فرمت کردن زنده (بدون متن فارسی)

```javascript
const amountInput = document.getElementById('amountInput');

currencyFormatter.applyLiveFormatting(amountInput, {
    decimals: 2,
    onChange: (numericValue, formattedValue) => {
        console.log('مقدار:', numericValue);
    }
});
```

---

### روش 4: فقط نمایش متن فارسی

```javascript
const amountInput = document.getElementById('amountInput');

// ساخت المنت نمایش متن فارسی
const persianTextElement = currencyFormatter.createPersianTextDisplay(
    amountInput, 
    'تومان',  // نام ارز
    { 
        decimals: 0,
        className: 'my-custom-class'
    }
);

// المنت به صورت خودکار به DOM اضافه می‌شود و به تغییرات اینپوت واکنش می‌دهد
```

---

## مثال‌های کاربردی

### مثال 1: فرم پرداخت

```html
<div class="payment-form">
    <label>مبلغ پرداختی (تومان)</label>
    <input type="text" id="paymentAmount" class="form-control">
    <div id="amountInWords" class="text-muted mt-2"></div>
</div>

<script>
    const paymentInput = document.getElementById('paymentAmount');
    
    currencyFormatter.setupCurrencyInput(paymentInput, {
        currencyName: 'تومان',
        decimals: 0,  // تومان معمولا اعشار ندارد
        showPersianText: true
    });
</script>
```

---

### مثال 2: فرم تبدیل ارز (مانند ConversionHistory)

```javascript
// در هنگام انتخاب ارز مبدا
function prepareAmountStep() {
    const sourceAmountInput = document.getElementById('sourceAmountInput');
    
    // نقشه نام ارزها
    const currencyNames = {
        'USD': 'دلار',
        'EUR': 'یورو',
        'GBP': 'پوند',
        'TRY': 'لیر',
        'AED': 'درهم',
        'IRR': 'ریال',
        'IRT': 'تومان'
    };
    
    const currencyName = currencyNames[sourceCurrencyCode] || sourceCurrencyCode;
    
    currencyFormatter.setupCurrencyInput(sourceAmountInput, {
        currencyName: currencyName,
        decimals: 2,
        showPersianText: true,
        onChange: (numericValue) => {
            // محاسبه نرخ تبدیل
            calculateConversionRate(numericValue);
        }
    });
}
```

---

### مثال 3: جدول با فرمت کردن اعداد

```javascript
// فرمت کردن اعداد در جدول
function renderTable(data) {
    const rows = data.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${currencyFormatter.formatNumber(item.amount, 2)}</td>
            <td>${currencyFormatter.numberToWordsWithCurrency(item.amount, 'دلار')}</td>
        </tr>
    `).join('');
    
    document.getElementById('tableBody').innerHTML = rows;
}
```

---

### مثال 4: نمایش متن فارسی در هنگام Blur

```html
<input type="text" id="amountInput" placeholder="مبلغ">
<div id="persianText"></div>

<script>
    const input = document.getElementById('amountInput');
    const persianDiv = document.getElementById('persianText');
    
    currencyFormatter.applyLiveFormatting(input, {
        decimals: 2,
        onChange: (numericValue) => {
            if (numericValue > 0) {
                const words = currencyFormatter.numberToWordsWithCurrency(numericValue, 'ریال');
                persianDiv.textContent = words;
                persianDiv.classList.add('text-success');
            } else {
                persianDiv.textContent = '';
            }
        }
    });
</script>
```

---

## API Reference

### `formatNumber(value, decimals = 2)`
فرمت کردن عدد با کاما

**پارامترها:**
- `value` (number|string): عدد ورودی
- `decimals` (number): تعداد اعشار (پیش‌فرض: 2)

**برگشتی:** `string` - عدد فرمت شده

---

### `parseFormattedNumber(formattedValue)`
حذف کاماها و تبدیل به عدد

**پارامترها:**
- `formattedValue` (string): عدد فرمت شده

**برگشتی:** `number` - عدد بدون فرمت

---

### `numberToWords(value)`
تبدیل عدد به حروف فارسی

**پارامترها:**
- `value` (number|string): عدد ورودی

**برگشتی:** `string` - متن فارسی عدد

---

### `numberToWordsWithCurrency(value, currencyName)`
تبدیل عدد به حروف فارسی با نام ارز

**پارامترها:**
- `value` (number|string): عدد ورودی
- `currencyName` (string): نام ارز (مثل: دلار، تومان)

**برگشتی:** `string` - متن فارسی عدد با نام ارز

---

### `applyLiveFormatting(inputElement, options)`
اعمال فرمت کردن زنده روی اینپوت

**پارامترها:**
- `inputElement` (HTMLInputElement): المنت اینپوت
- `options` (Object):
  - `decimals` (number): تعداد اعشار
  - `onChange` (Function): تابع callback برای تغییرات

---

### `createPersianTextDisplay(inputElement, currencyName, options)`
ساخت المنت نمایش متن فارسی

**پارامترها:**
- `inputElement` (HTMLInputElement): المنت اینپوت
- `currencyName` (string): نام ارز
- `options` (Object):
  - `decimals` (number): تعداد اعشار
  - `className` (string): کلاس CSS سفارشی

**برگشتی:** `HTMLDivElement` - المنت div نمایش متن

---

### `setupCurrencyInput(inputElement, options)` ⭐ توصیه می‌شود
پیکربندی کامل اینپوت ارز

**پارامترها:**
- `inputElement` (HTMLInputElement): المنت اینپوت
- `options` (Object):
  - `currencyName` (string): نام ارز (پیش‌فرض: 'واحد')
  - `decimals` (number): تعداد اعشار (پیش‌فرض: 2)
  - `onChange` (Function): callback تغییرات
  - `showPersianText` (boolean): نمایش متن فارسی (پیش‌فرض: true)

---

## نکات مهم

### 1. استفاده از Instance سراسری
کتابخانه یک instance سراسری به نام `currencyFormatter` دارد که می‌توانید در همه جا استفاده کنید:

```javascript
// ✅ درست
currencyFormatter.formatNumber(123456);

// ❌ نیازی به ساخت instance جدید نیست
const formatter = new CurrencyFormatter();
```

---

### 2. تغییر نوع اینپوت
اینپوت باید از نوع `text` باشه، نه `number`:

```html
<!-- ✅ درست -->
<input type="text" id="amount">

<!-- ❌ غلط -->
<input type="number" id="amount">
```

---

### 3. سازگاری با RTL
برای فرمت درست اعداد در زبان فارسی، حتما `text-right` یا `direction: rtl` استفاده کنید:

```html
<input type="text" class="text-right" id="amount">
```

---

### 4. دریافت مقدار عددی
همیشه از `parseFormattedNumber` برای دریافت مقدار عددی استفاده کنید:

```javascript
const input = document.getElementById('amount');
const value = currencyFormatter.parseFormattedNumber(input.value);
// حالا value یک عدد واقعی است
```

---

## مثال کامل در یک صفحه

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مثال کامل</title>
    <style>
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input { 
            width: 100%; 
            padding: 0.5rem; 
            text-align: right; 
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .persian-text { 
            color: #666; 
            font-size: 0.875rem; 
            margin-top: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="form-group">
        <label>مبلغ (دلار)</label>
        <input type="text" id="amountUSD" placeholder="مبلغ به دلار">
    </div>

    <div class="form-group">
        <label>مبلغ (تومان)</label>
        <input type="text" id="amountIRT" placeholder="مبلغ به تومان">
    </div>

    <button onclick="showTotal()">محاسبه کل</button>
    <div id="total"></div>

    <script src="~/js/currency-formatter.js"></script>
    <script>
        // پیکربندی اینپوت دلار
        currencyFormatter.setupCurrencyInput(document.getElementById('amountUSD'), {
            currencyName: 'دلار',
            decimals: 2,
            showPersianText: true
        });

        // پیکربندی اینپوت تومان
        currencyFormatter.setupCurrencyInput(document.getElementById('amountIRT'), {
            currencyName: 'تومان',
            decimals: 0,
            showPersianText: true
        });

        function showTotal() {
            const usd = currencyFormatter.parseFormattedNumber(
                document.getElementById('amountUSD').value
            );
            const irt = currencyFormatter.parseFormattedNumber(
                document.getElementById('amountIRT').value
            );
            
            // محاسبه (فرض: نرخ تبدیل 50000 تومان)
            const totalInToman = (usd * 50000) + irt;
            
            document.getElementById('total').innerHTML = `
                <strong>مجموع:</strong> 
                ${currencyFormatter.formatNumber(totalInToman, 0)} تومان
                <br>
                <em>${currencyFormatter.numberToWordsWithCurrency(totalInToman, 'تومان')}</em>
            `;
        }
    </script>
</body>
</html>
```

---

## سوالات متداول

### Q: چطور می‌تونم تعداد اعشار رو تغییر بدم؟
```javascript
currencyFormatter.formatNumber(123.456789, 4); // "123.4568"
```

### Q: چطور کاما رو برای هزارگان فارسی استفاده کنم؟
این کتابخانه از کاما استاندارد استفاده می‌کنه که در فارسی هم معمول است.

### Q: آیا می‌تونم از این کتابخانه در Vue/React استفاده کنم؟
بله، کتابخانه vanilla JavaScript هست و با همه فریمورک‌ها سازگاره.

### Q: چطور می‌تونم نام ارزهای دیگه رو اضافه کنم؟
```javascript
const currencyNames = {
    'CAD': 'دلار کانادا',
    'JPY': 'ین',
    'CNY': 'یوان',
    // ...
};
```

---

## نسخه

**Version:** 1.0.0  
**Last Updated:** 2024-11-26  
**Author:** AzadiyanDev  
