
document.addEventListener('DOMContentLoaded', function () {

    let transactions = [];
    let organizedObject = [];
    let settings = {
        income: 0,
        maxSpending: 0,
        savings: 0,
        currency: 'USD',
        rates: { USD: 0.00073, EUR: 0.00067, Naira: 1.15 }
    };
    let darkMode = false;
    let numberOfTransaction = 1;
    let id_editing = null;
    let sortStatus = { field: null, ascending: true };

    // Functions to be used
    function generateTransactionId() {
        return `txn_${numberOfTransaction++}`;
    }

    function nowDate() {
        return new Date().toISOString().split('T')[0];
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            console.log('Showing section:', sectionId);

            if (sectionId === 'dashboard') {
                updateDashboard();
            } else if (sectionId === 'records') {
                applySearchAndSort();
            }
        }
    }

    // Add or edit transaction section

    function nowDateTime() {
        return new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    function save_memory() {
        const data = {
            transactions: transactions,
            settings: settings,
            numberOfTransaction: numberOfTransaction,
            darkMode: darkMode
        };
        console.log(' Data saved to memory');
        return data;
    }

    function setupTransactionForm() {
        const form = document.getElementById('transactions');
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        const addCategoryInput = document.getElementById('addCategory');
        const addCategoryLabel = document.getElementById('addLabel');
        const categoryRow = document.getElementById('categoryRow');

        // Code for auto-generating id as the user adds a new transaction
        document.getElementById('uniqueid').value = generateTransactionId();
        document.getElementById('createdAt').value = nowDate();
        document.getElementById('date').value = nowDate();

        // show or hode category row based on type. It will show for expense and hide for income
        typeSelect.addEventListener('change', function () {
            if (this.value === 'income') {
                categoryRow.style.display = 'none';
                categorySelect.value = 'food';
                categorySelect.removeAttribute('required');
                addCategoryInput.value = '';
                addCategoryLabel.style.display = 'none';
                addCategoryInput.style.display = 'none';
                addCategoryInput.removeAttribute('required');
            } else {
                categoryRow.style.display = 'block';
                categorySelect.setAttribute('required', 'required');
            }
        });

        // Show or hide "Add Category" input based on selection. It shows when "other" is selected
        categorySelect.addEventListener('change', function () {
            if (this.value === 'other') {
                addCategoryLabel.style.display = 'inline';
                addCategoryInput.style.display = 'inline';
                addCategoryInput.required = true;
            } else {
                addCategoryLabel.style.display = 'none';
                addCategoryInput.style.display = 'none';
                addCategoryInput.required = false;
                addCategoryInput.value = '';
            }
        });

        function validateDate(dateString) {
            // Check format YYYY-MM-DD
            const datePattern = /^(\d{1,4})-(\d{2})-(\d{2})$/;
            const match = dateString.match(datePattern);

            if (!match) {
                return { valid: false, message: 'Date must be in YYYY-MM-DD format!' };
            }

            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);

            // Check year range
            if (year < 1 || year > 2025) {
                return { valid: false, message: 'Year must be between 0001 and 2025!' };
            }

            // Check month range
            if (month < 1 || month > 12) {
                return { valid: false, message: 'Month must be between 01 and 12!' };
            }

            // Check day range
            if (day < 1 || day > 31) {
                return { valid: false, message: 'Day must be between 01 and 31!' };
            }

            // Check valid date (handles months with different days)
            const dateObj = new Date(year, month - 1, day);
            if (dateObj.getFullYear() !== year ||
                dateObj.getMonth() !== month - 1 ||
                dateObj.getDate() !== day) {
                return { valid: false, message: 'Invalid date! Please check the day for this month.' };
            }

            // Check if date is not in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dateObj > today) {
                return { valid: false, message: 'Date cannot be in the future!' };
            }

            return { valid: true };
        }

        // Add real-time date validation feedback
        const dateInput = document.getElementById('date');
        dateInput.addEventListener('blur', function () {
            const validation = validateDate(this.value);
            if (!validation.valid) {
                this.setCustomValidity(validation.message);
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });

        // Clear custom validity on input
        dateInput.addEventListener('input', function () {
            this.setCustomValidity('');
        });

        // Java for submitting the form


        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const type = document.getElementById('type').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const description = document.getElementById('description').value.trim();
            const dateValue = document.getElementById('date').value.trim();

            // Form validation
            if (amount <= 0) {
                alert('Amount must be greater than zero!');
                return;
            }

            if (!description) {
                alert('Please add a description!');
                return;
            }

            const dateValidation = validateDate(dateValue);
            if (!dateValidation.valid) {
                alert(dateValidation.message);
                document.getElementById('date').focus();
                return;
            }

            const category = type === 'expense' ?
                (categorySelect.value === 'other' ? addCategoryInput.value : categorySelect.value) : '-';

            const formData = {
                uniqueid: document.getElementById('uniqueid').value,
                type: type,
                description: description,
                amount: amount,
                category: category,
                date: document.getElementById('date').value,
                createdAt: document.getElementById('createdAt').value,
                updatedAt: id_editing ? nowDateTime() : ''
            };

            // Validate category for expenses
            if (formData.type === 'expense' && formData.category === '-') {
                alert('Please select or add a category for expenses!');
                return;
            }

            if (id_editing) {
                // Update existing transaction
                const index = transactions.findIndex(t => t.uniqueid === id_editing);
                if (index !== -1) {
                    transactions[index] = formData;
                    alert('Transaction updated successfully!');
                }
                id_editing = null;
            } else {
                // Add new transaction
                transactions.push(formData);
                alert('Transaction added successfully!');
            }

            save_memory();

            // Reset form
            form.reset();
            document.getElementById('uniqueid').value = generateTransactionId();
            document.getElementById('createdAt').value = nowDate();
            document.getElementById('date').value = nowDate();
            document.getElementById('updatedAt').value = '';
            addCategoryLabel.style.display = 'none';
            addCategoryInput.style.display = 'none';

            // Reset to expense type and show category
            typeSelect.value = 'expense';
            categoryRow.style.display = 'block';
            categorySelect.setAttribute('required', 'required');

            showSection('records');
        });

        console.log('Transaction form setup complete');
    }

    //SEARCH AND SORT FUNCTIONALITY
    function setupSearchAndSort() {
        const searchInput = document.getElementById('searchInput');
        const caseInsensitiveCheckbox = document.getElementById('caseInsensitive');
        const searchError = document.getElementById('searchError');
        const sortButtons = document.querySelectorAll('.sort-btn');

        // Search functionality
        searchInput.addEventListener('input', function () {
            searchError.textContent = '';
            applySearchAndSort();
        });

        caseInsensitiveCheckbox.addEventListener('change', function () {
            applySearchAndSort();
        });

        // Sort functionality
        sortButtons.forEach(button => {
            button.addEventListener('click', function () {
                const sortField = this.getAttribute('data-sort');

                if (sortStatus.field === sortField) {
                    sortStatus.ascending = !sortStatus.ascending;
                } else {
                    sortStatus.field = sortField;
                    sortStatus.ascending = true;
                }

                // Update button text
                sortButtons.forEach(btn => {
                    const field = btn.getAttribute('data-sort');
                    const label = field.charAt(0).toUpperCase() + field.slice(1);
                    btn.textContent = `${label} ↕`;
                });

                const arrow = sortStatus.ascending ? ' &uarr;' : ' &darr;';
                const label = sortField.charAt(0).toUpperCase() + sortField.slice(1);
                this.textContent = `${label}${arrow}`;

                applySearchAndSort();
            });
        });
    }

    function applySearchAndSort() {
        const searchInput = document.getElementById('searchInput');
        const caseInsensitiveCheckbox = document.getElementById('caseInsensitive');
        const searchError = document.getElementById('searchError');

        let filtered = [...transactions];

        // Apply search filter
        if (searchInput.value.trim()) {
            try {
                const flags = caseInsensitiveCheckbox.checked ? 'i' : '';
                const regex = new RegExp(searchInput.value, flags);

                filtered = filtered.filter(transaction => {
                    return regex.test(transaction.description) ||
                        regex.test(transaction.type) ||
                        regex.test(transaction.category) ||
                        regex.test(transaction.amount.toString()) ||
                        regex.test(transaction.date) ||
                        regex.test(transaction.uniqueid);
                });

                searchError.textContent = '';
            } catch (error) {
                searchError.textContent = 'Invalid regex pattern';
                filtered = transactions;
            }
        }

        // Apply sorting
        if (sortStatus.field) {
            filtered.sort((a, b) => {
                let aVal = a[sortStatus.field];
                let bVal = b[sortStatus.field];

                if (sortStatus.field === 'amount') {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                } else if (sortStatus.field === 'date') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                } else {
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                }

                if (aVal < bVal) return sortStatus.ascending ? -1 : 1;
                if (aVal > bVal) return sortStatus.ascending ? 1 : -1;
                return 0;
            });
        }

        organizedObject = filtered;
        updateRecordsTable();
    }

    function highlightMatches(text, searchPattern, caseInsensitive) {
        if (!searchPattern) return text;

        try {
            const flags = caseInsensitive ? 'gi' : 'g';
            const regex = new RegExp(`(${searchPattern})`, flags);
            return String(text).replace(regex, '<mark>$1</mark>');
        } catch (error) {
            return text;
        }
    }

    //RECORDS part
    function updateRecordsTable() {
        const table = document.getElementById('recordsTable');
        const tbody = table.querySelector('tbody');
        const searchInput = document.getElementById('searchInput');
        const caseInsensitive = document.getElementById('caseInsensitive').checked;

        // Clear existing rows
        tbody.innerHTML = '';

        // Add filtered/sorted transactions
        organizedObject.forEach(transaction => {
            const row = tbody.insertRow();

            const searchPattern = searchInput.value.trim();

            // Create cells with highlighted matches
            const cells = [
                { value: transaction.uniqueid, highlight: false },
                { value: transaction.type, highlight: true },
                { value: transaction.description, highlight: true },
                { value: transaction.amount.toFixed(2) + ' RWF', highlight: true },
                { value: transaction.category || '-', highlight: true },
                { value: transaction.date, highlight: true },
                { value: transaction.createdAt, highlight: false },
                { value: transaction.updatedAt || '-', highlight: false }
            ];

            cells.forEach((cellData, index) => {
                const cell = row.insertCell();
                const headers = ['ID', 'Type', 'Description', 'Amount', 'Category', 'Date', 'Created At', 'Updated At'];
                cell.setAttribute('data-label', headers[index]);

                if (index === 1) {
                    // Type column with colored badge
                    const span = document.createElement('span');
                    span.className = transaction.type === 'income' ? 'badge-income' : 'badge-expense';

                    if (cellData.highlight && searchPattern) {
                        span.innerHTML = highlightMatches(cellData.value, searchPattern, caseInsensitive);
                    } else {
                        span.textContent = cellData.value;
                    }
                    cell.appendChild(span);
                } else {
                    if (cellData.highlight && searchPattern) {
                        cell.innerHTML = highlightMatches(cellData.value, searchPattern, caseInsensitive);
                    } else {
                        cell.textContent = cellData.value;
                    }
                }
            });

            // Action buttons
            const actionCell = row.insertCell();
            actionCell.setAttribute('data-label', 'Action');

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.setAttribute('data-id', transaction.uniqueid);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.setAttribute('data-id', transaction.uniqueid);

            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
        });

        console.log('Records table updated with', organizedObject.length, 'transactions');
    }

    // Event delegation for edit/delete buttons
    document.getElementById('recordsTable').addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            editTransaction(e.target.getAttribute('data-id'));
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTransaction(e.target.getAttribute('data-id'));
        }
    });

    function editTransaction(id) {
        const transaction = transactions.find(t => t.uniqueid === id);
        if (!transaction) return;

        id_editing = id;

        // Populate form
        document.getElementById('uniqueid').value = transaction.uniqueid;
        document.getElementById('type').value = transaction.type;
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('date').value = transaction.date;
        document.getElementById('createdAt').value = transaction.createdAt;
        document.getElementById('updatedAt').value = nowDateTime();

        // Handle category
        const categorySelect = document.getElementById('category');
        const addCategoryInput = document.getElementById('addCategory');
        const addCategoryLabel = document.getElementById('addLabel');
        const categoryRow = document.getElementById('categoryRow');

        if (transaction.type === 'expense') {
            categoryRow.style.display = 'block';
            categorySelect.setAttribute('required', 'required');

            const defaultCategories = ['food', 'books', 'transport', 'entertainment', 'fees'];
            if (defaultCategories.includes(transaction.category)) {
                categorySelect.value = transaction.category;
                addCategoryLabel.style.display = 'none';
                addCategoryInput.style.display = 'none';
            } else {
                categorySelect.value = 'other';
                addCategoryLabel.style.display = 'inline';
                addCategoryInput.style.display = 'inline';
                addCategoryInput.value = transaction.category;
                addCategoryInput.required = true;
            }
        } else {
            categoryRow.style.display = 'none';
            categorySelect.removeAttribute('required');
        }

        showSection('transaction');
        console.log('✏️ Editing transaction:', id);
    }

    function deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            transactions = transactions.filter(t => t.uniqueid !== id);
            save_memory();
            applySearchAndSort();
            updateDashboard();
            console.log('🗑️ Deleted transaction:', id);
        }
    }
    // DASHBOARD Part
    function updateDashboard() {
        // Calculate totals
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const transactionIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = settings.income + transactionIncome;
        const amountRemaining = totalIncome - totalExpenses;
        const plannedSavings = settings.savings;
        const diffMaxSpend = settings.maxSpending - totalExpenses;

        // Calculate top category
        const topCategory = getTopCategory();

        // Get currency display
        const currencyDisplay = getCurrencyDisplay();

        // Update display with converted amounts
        document.getElementById('totalIncome').textContent = currencyDisplay(totalIncome);
        document.getElementById('plannedSavings').textContent = currencyDisplay(plannedSavings);
        document.getElementById('totalExpenses').textContent = currencyDisplay(totalExpenses);
        document.getElementById('amountRemaining').textContent = currencyDisplay(amountRemaining);

        // Style amount remaining based on value
        const remainingSpan = document.getElementById('amountRemaining');
        if (amountRemaining < 0) {
            remainingSpan.style.color = '#d14d4fff';
            remainingSpan.classList.remove('positive-amount');
            remainingSpan.classList.add('negative-amount');
        } else {
            remainingSpan.style.color = '#5785c7ff';
            remainingSpan.classList.remove('negative-amount');
            remainingSpan.classList.add('positive-amount');
        }
        remainingSpan.style.fontWeight = 'bold';

        // Update difference from max spending
        const diffSpan = document.getElementById('diffMaxSpend');

        if (diffMaxSpend < 0) {
            diffSpan.style.color = '#d14d4fff';
            diffSpan.style.fontWeight = 'bold';
            diffSpan.innerHTML = currencyDisplay(diffMaxSpend) + ' <span style="color: red; font-weight: bold;"> You exceeded your budget!</span>';
        } else {
            diffSpan.style.color = '#5785c7ff';
            diffSpan.style.fontWeight = 'bold';
            diffSpan.textContent = currencyDisplay(diffMaxSpend);
        }

        // Update top category
        document.getElementById('topCategory').textContent = topCategory;

        // Update chart
        drawExpenseChart();

        console.log('Dashboard updated - Expenses:', totalExpenses, 'Income:', totalIncome);
    }

    // get currency display
    function getCurrencyDisplay() {
        const currency = settings.currency;
        let rate = 1;
        let currencySymbol = 'RWF';

        if (currency && currency !== '' && currency !== 'None') {
            currencySymbol = currency;
            if (currency === "USD") rate = settings.rates.USD;
            else if (currency === "EUR") rate = settings.rates.EUR;
            else if (currency === "Naira") rate = settings.rates.Naira;
        }

        return function (amount) {
            const convertedAmount = (amount * rate).toFixed(2);
            return `${convertedAmount} ${currencySymbol}`;
        };
    }

    function getTopCategory() {
        const expenseTransactions = transactions.filter(t => t.type === 'expense');

        if (expenseTransactions.length === 0) {
            return '-';
        }

        const categoryTotals = {};

        expenseTransactions.forEach(transaction => {
            const category = transaction.category || 'other';
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += transaction.amount;
        });

        let topCategory = '';
        let maxAmount = 0;

        for (const [category, amount] of Object.entries(categoryTotals)) {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategory = category;
            }
        }

        // Get currency display
        const currencyDisplay = getCurrencyDisplay();

        return topCategory ? `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} (${currencyDisplay(maxAmount)})` : '-';
    }

    function drawExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get last 7 days data
        const chartData = getLast7DaysData();

        // Set colors based on dark mode
        const bgColor = darkMode ? '#555' : '#fff';
        const axisColor = darkMode ? '#fff' : '#0f0101ff';
        const gridColor = darkMode ? '#777' : '#e0e0e0';
        const lineColor = darkMode ? '#30a588ff' : '#1b9f59ff';
        const textColor = darkMode ? '#fff' : '#555';

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (chartData.length === 0) {
            ctx.fillStyle = textColor;
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No expense data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Chart dimensions
        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Find max value
        const maxAmount = Math.max(...chartData.map(d => d.amount), 100);

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Draw line and points
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;

        chartData.forEach((data, index) => {
            const x = padding + (index / (chartData.length - 1)) * chartWidth;
            const y = canvas.height - padding - (data.amount / maxAmount) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points and labels
        ctx.fillStyle = lineColor;
        chartData.forEach((data, index) => {
            const x = padding + (index / (chartData.length - 1)) * chartWidth;
            const y = canvas.height - padding - (data.amount / maxAmount) * chartHeight;

            // Draw point
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw date label
            ctx.fillStyle = textColor;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.date.substring(5), x, canvas.height - padding + 20);

            ctx.fillStyle = lineColor;
        });

        // Draw Y-axis labels
        ctx.fillStyle = textColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxAmount / 5) * i;
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(value.toFixed(0), padding - 10, y + 4);
        }

        console.log('Chart drawn with', chartData.length, 'data points');
    }

    function getLast7DaysData() {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayExpenses = transactions
                .filter(t => t.type === 'expense' && t.date === dateStr)
                .reduce((sum, t) => sum + t.amount, 0);

            data.push({
                date: dateStr,
                amount: dayExpenses
            });
        }

        return data;
    }

    // Settings Java part
    function setupSettings() {
        const saveBtn = document.getElementById('saveBtn');
        const editBtn = document.getElementById('editBtn');
        const modeButton = document.getElementById('modeButton');

        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettings);
        }

        if (editBtn) {
            editBtn.addEventListener('click', enableEdit);
        }

        if (modeButton) {
            modeButton.addEventListener('click', toggleDarkMode);
        }

        // Load saved settings display
        if (settings.income > 0) {
            document.getElementById('showIncome').textContent = settings.income + " RWF";
            document.getElementById('showSpending').textContent = settings.maxSpending + " RWF";
            document.getElementById('showSavings').textContent = settings.savings + " RWF";
            disableInputs(true);
            saveBtn.style.display = "none";
            editBtn.style.display = "inline-block";
        }

        console.log('Settings setup complete');
    }

    function saveSettings() {
        const income = Number(document.getElementById("income").value);
        const spending = Number(document.getElementById("maxSpending").value);
        const savings = Number(document.getElementById("savings").value);
        const currency = document.getElementById("currency").value;

        const rateUSD = Number(document.getElementById("rateUSD").value);
        const rateEUR = Number(document.getElementById("rateEUR").value);
        const rateNaira = Number(document.getElementById("rateNaira").value);

        const errorMsg = document.getElementById("errorMsg");
        const converted = document.getElementById("converted");

        errorMsg.textContent = "";
        converted.textContent = "";

        try {
            if (!income || !spending || !savings) {
                throw "Please fill in all required income, spending, and savings fields.";
            }

            if (spending + savings > income) {
                throw "Your spending and savings combined exceed your total income!";
            }

            settings.income = income;
            settings.maxSpending = spending;
            settings.savings = savings;
            settings.currency = currency;
            // Only update rates if they are provided, otherwise keep existing
            if (rateUSD) settings.rates.USD = rateUSD;
            if (rateEUR) settings.rates.EUR = rateEUR;
            if (rateNaira) settings.rates.Naira = rateNaira;

            document.getElementById("showIncome").textContent = income + " RWF";
            document.getElementById('showSpending').textContent = spending + " RWF";
            document.getElementById("showSavings").textContent = savings + " RWF";

            if (currency && currency !== '') {
                let rate = 0;
                if (currency === "USD") rate = rateUSD;
                else if (currency === "EUR") rate = rateEUR;
                else if (currency === "Naira") rate = rateNaira;

                if (!rate) throw `Please enter the exchange rate for ${currency}.`;

                const convIncome = (income * rate).toFixed(2);
                const convSpend = (spending * rate).toFixed(2);
                const convSave = (savings * rate).toFixed(2);

                converted.textContent = `Converted (${currency}): Income = ${convIncome} | Spending = ${convSpend} | Savings = ${convSave}`;
            }

            disableInputs(true);
            document.getElementById('saveBtn').style.display = "none";
            document.getElementById('editBtn').style.display = "inline-block";

            save_memory();
            updateDashboard();

            alert("Settings saved successfully!");

        } catch (err) {
            errorMsg.textContent = "⚠️ " + err;
        } finally {
            document.getElementById("income").value = "";
            document.getElementById("maxSpending").value = "";
            document.getElementById('savings').value = "";
        }
    }

    function enableEdit() {
        disableInputs(false);
        document.getElementById("saveBtn").style.display = "inline-block";
        document.getElementById("editBtn").style.display = "none";
    }

    function disableInputs(state) {
        document.querySelectorAll("#settings input, #settings select").forEach(input => {
            input.disabled = state;
        });
    }

    function toggleDarkMode() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode');
        save_memory();
        // Redraw chart with new colors
        if (document.getElementById('dashboard').style.display === 'block') {
            drawExpenseChart();
        }
        console.log("Dark mode:", darkMode ? "ON" : "OFF");
    }

    // SETUP NAVIGATION BUTTONs
    const aboutBtn = document.getElementById("headAbout");
    const dashboardBtn = document.getElementById('headDashboard');
    const recordsBtn = document.getElementById("headRecords");
    const addTransBtn = document.getElementById('headAddTransaction');
    const settingsBtn = document.getElementById("headSettings");

    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => showSection('about'));
    }

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => showSection('dashboard'));
    }

    if (recordsBtn) {
        recordsBtn.addEventListener('click', () => showSection('records'));
    }

    if (addTransBtn) {
        addTransBtn.addEventListener('click', () => showSection('transaction'));
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => showSection('settings'));
    }

    // Java For Navigation Menu
    function shortMenu() {
        const hamburger = document.getElementById('hamburgerBtn');
        const menuBar = document.getElementById('headMenubar');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuButtons = document.querySelectorAll('.headMenubar button');

        if (!hamburger || !menuBar || !menuOverlay) {
            console.log('Hamburger menu elements not found');
            return;
        }

        // Toggle menu
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            menuBar.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuBar.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when overlay is clicked
        menuOverlay.addEventListener('click', function () {
            hamburger.classList.remove('active');
            menuBar.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when a menu item is clicked
        menuButtons.forEach(button => {
            button.addEventListener('click', function () {
                hamburger.classList.remove('active');
                menuBar.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        console.log(' Hamburger menu setup complete');
    }

    function info_memory() {
        console.log('Using in-memory data');
    }

    //INITIALIZE EVERYTHING
    info_memory();
    setupTransactionForm();
    shortMenu();
    setupSettings();
    setupSearchAndSort();
    organizedObject = [...transactions];

    // Show dashboard by default
    showSection("dashboard");

    console.log("Finance Tracker fully initialized and ready to use!");
});