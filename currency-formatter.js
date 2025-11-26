/**
 * کتابخانه فرمت کردن ارز و تبدیل اعداد به حروف فارسی
 * Currency Formatter Library
 */

class CurrencyFormatter {
    constructor() {
        // اسامی اعداد فارسی
        this.ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
        this.teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
        this.tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
        this.hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
        this.scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    }

    /**
     * فرمت کردن عدد با کاما (سه رقم سه رقم)
     * @param {number|string} value - عدد ورودی
     * @param {number} decimals - تعداد اعشار (پیش‌فرض: 2)
     * @returns {string} - عدد فرمت شده
     */
    formatNumber(value, decimals = 2) {
        if (!value && value !== 0) return '';

        const num = parseFloat(value);
        if (isNaN(num)) return '';

        // جداسازی قسمت صحیح و اعشاری
        const parts = num.toFixed(decimals).split('.');

        // فرمت کردن قسمت صحیح با کاما
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // حذف اعشار اگر صفر باشد
        if (decimals > 0 && parts[1] && parseFloat('0.' + parts[1]) === 0) {
            return parts[0];
        }

        return parts.join('.');
    }

    /**
     * حذف کاماها از عدد فرمت شده
     * @param {string} formattedValue - عدد فرمت شده با کاما
     * @returns {number} - عدد بدون فرمت
     */
    parseFormattedNumber(formattedValue) {
        if (!formattedValue) return 0;
        const cleaned = formattedValue.toString().replace(/,/g, '');
        return parseFloat(cleaned) || 0;
    }

    /**
     * تبدیل عدد سه رقمی به فارسی
     * @param {number} num - عدد سه رقمی
     * @returns {string} - متن فارسی عدد
     */
    convertThreeDigits(num) {
        if (num === 0) return '';

        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        const ten = Math.floor(remainder / 10);
        const one = remainder % 10;

        let result = this.hundreds[hundred];

        if (remainder === 0) {
            return result;
        }

        if (result) result += ' و ';

        if (remainder < 10) {
            result += this.ones[one];
        } else if (remainder < 20) {
            result += this.teens[remainder - 10];
        } else {
            result += this.tens[ten];
            if (one > 0) {
                result += ' و ' + this.ones[one];
            }
        }

        return result;
    }

    /**
     * تبدیل قسمت صحیح عدد به فارسی
     * @param {number} num - عدد صحیح
     * @returns {string} - متن فارسی عدد
     */
    convertIntegerToWords(num) {
        if (num === 0) return 'صفر';

        const parts = [];
        let scaleIndex = 0;

        while (num > 0) {
            const threeDigits = num % 1000;
            if (threeDigits > 0) {
                let part = this.convertThreeDigits(threeDigits);
                if (scaleIndex > 0 && part) {
                    part += ' ' + this.scales[scaleIndex];
                }
                parts.unshift(part);
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }

        return parts.join(' و ');
    }

    /**
     * تبدیل قسمت اعشاری به فارسی
     * @param {string} decimalPart - قسمت اعشاری (بعد از ممیز)
     * @returns {string} - متن فارسی اعشار
     */
    convertDecimalToWords(decimalPart) {
        if (!decimalPart || parseFloat('0.' + decimalPart) === 0) {
            return '';
        }

        // حذف صفرهای انتهایی
        decimalPart = decimalPart.replace(/0+$/, '');

        if (!decimalPart) return '';

        // تبدیل به عدد صحیح برای خواندن
        const decimalNum = parseInt(decimalPart);
        const decimalWords = this.convertIntegerToWords(decimalNum);

        return ' ممیز ' + decimalWords;
    }

    /**
     * تبدیل عدد به حروف فارسی کامل
     * @param {number|string} value - عدد ورودی
     * @returns {string} - متن فارسی عدد
     */
    numberToWords(value) {
        if (!value && value !== 0) return '';

        const num = parseFloat(value);
        if (isNaN(num)) return '';

        if (num === 0) return 'صفر';

        // جداسازی قسمت صحیح و اعشاری
        const parts = num.toFixed(8).split('.');
        const integerPart = parseInt(parts[0]);
        const decimalPart = parts[1];

        let words = this.convertIntegerToWords(Math.abs(integerPart));

        // اضافه کردن اعشار اگر وجود داشته باشد
        if (decimalPart && parseFloat('0.' + decimalPart) > 0) {
            words += this.convertDecimalToWords(decimalPart);
        }

        // اضافه کردن منفی اگر عدد منفی باشد
        if (num < 0) {
            words = 'منفی ' + words;
        }

        return words;
    }

    /**
     * تبدیل عدد به حروف فارسی با نام ارز
     * @param {number|string} value - عدد ورودی
     * @param {string} currencyName - نام ارز (مثل: دلار، تومان، یورو)
     * @returns {string} - متن فارسی عدد با نام ارز
     */
    numberToWordsWithCurrency(value, currencyName) {
        const words = this.numberToWords(value);
        if (!words) return '';

        return `${words} ${currencyName}`;
    }

    /**
     * اعمال فرمت کردن زنده روی یک اینپوت
     * @param {HTMLInputElement} inputElement - المنت اینپوت
     * @param {Object} options - تنظیمات
     * @param {number} options.decimals - تعداد اعشار
     * @param {Function} options.onChange - تابع برای اطلاع از تغییرات
     */
    applyLiveFormatting(inputElement, options = {}) {
        const decimals = options.decimals !== undefined ? options.decimals : 2;
        const onChange = options.onChange || (() => { });

        let lastValue = '';

        const formatInput = () => {
            // موقعیت کرسر را ذخیره کنیم
            const cursorPosition = inputElement.selectionStart;
            const oldValue = inputElement.value;
            const oldLength = oldValue.length;

            // پاک کردن کاما و کاراکترهای غیرمجاز
            let cleanValue = oldValue.replace(/[^0-9.]/g, '');

            // فقط یک نقطه مجاز
            const parts = cleanValue.split('.');
            if (parts.length > 2) {
                cleanValue = parts[0] + '.' + parts.slice(1).join('');
            }

            // محدود کردن اعشار
            if (parts.length === 2 && parts[1].length > decimals) {
                parts[1] = parts[1].substring(0, decimals);
                cleanValue = parts.join('.');
            }

            // فرمت کردن
            if (cleanValue) {
                const num = parseFloat(cleanValue);
                if (!isNaN(num)) {
                    const formatted = this.formatNumber(num, decimals);

                    // تنظیم مقدار جدید
                    inputElement.value = formatted;

                    // محاسبه موقعیت جدید کرسر
                    const newLength = formatted.length;
                    const diff = newLength - oldLength;
                    const newCursorPosition = cursorPosition + diff;

                    // بازگردانی کرسر
                    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

                    // فراخوانی callback
                    if (inputElement.value !== lastValue) {
                        lastValue = inputElement.value;
                        onChange(num, formatted);
                    }
                }
            } else {
                inputElement.value = '';
                onChange(0, '');
            }
        };

        // Event listeners
        inputElement.addEventListener('input', formatInput);
        inputElement.addEventListener('blur', () => {
            const num = this.parseFormattedNumber(inputElement.value);
            if (num > 0) {
                inputElement.value = this.formatNumber(num, decimals);
            }
        });
    }

    /**
     * ساخت المنت نمایش متن فارسی زیر اینپوت
     * @param {HTMLInputElement} inputElement - المنت اینپوت
     * @param {string} currencyName - نام ارز
     * @param {Object} options - تنظیمات
     * @returns {HTMLDivElement} - المنت نمایش متن فارسی
     */
    createPersianTextDisplay(inputElement, currencyName, options = {}) {
        const { decimals = 2, className = 'persian-amount-text' } = options;

        // ساخت المنت نمایش
        const displayElement = document.createElement('div');
        displayElement.className = `text-sm mt-2 text-gray-600 ${className}`;
        displayElement.style.minHeight = '20px';

        // اضافه کردن به DOM
        if (inputElement.nextSibling) {
            inputElement.parentNode.insertBefore(displayElement, inputElement.nextSibling);
        } else {
            inputElement.parentNode.appendChild(displayElement);
        }

        // تابع به‌روزرسانی متن
        const updateText = () => {
            const value = this.parseFormattedNumber(inputElement.value);
            if (value > 0) {
                const text = this.numberToWordsWithCurrency(value, currencyName);
                displayElement.textContent = text;
                displayElement.classList.remove('text-gray-400');
                displayElement.classList.add('text-gray-600', 'font-medium');
            } else {
                displayElement.textContent = '';
            }
        };

        // Event listeners
        inputElement.addEventListener('input', updateText);
        inputElement.addEventListener('blur', updateText);

        // به‌روزرسانی اولیه
        updateText();

        return displayElement;
    }

    /**
     * پیکربندی کامل یک اینپوت ارز
     * @param {HTMLInputElement} inputElement - المنت اینپوت
     * @param {Object} options - تنظیمات
     * @param {string} options.currencyName - نام ارز (مثل: دلار، تومان)
     * @param {number} options.decimals - تعداد اعشار
     * @param {Function} options.onChange - تابع برای اطلاع از تغییرات
     * @param {boolean} options.showPersianText - نمایش متن فارسی زیر اینپوت
     */
    setupCurrencyInput(inputElement, options = {}) {
        const {
            currencyName = 'واحد',
            decimals = 2,
            onChange = () => { },
            showPersianText = true
        } = options;

        // اعمال فرمت زنده
        this.applyLiveFormatting(inputElement, { decimals, onChange });

        // ساخت نمایش متن فارسی
        if (showPersianText) {
            this.createPersianTextDisplay(inputElement, currencyName, { decimals });
        }
    }
}

// ساخت instance سراسری
const currencyFormatter = new CurrencyFormatter();

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurrencyFormatter, currencyFormatter };
}
